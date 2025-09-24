import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize S3 client with fallback credentials and region
const REGION = process.env.AWS_REGION || 'us-east-2'
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'AKIA3GFGRLXXPITTXL27'
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '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'

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'thomasbucket26'

export async function POST(request: NextRequest) {
  try {
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed. Use POST.' },
        { status: 405 }
      )
    }

    if (!REGION) {
      return NextResponse.json(
        { error: 'AWS region is not configured' },
        { status: 500 }
      )
    }

    if (!BUCKET_NAME) {
      return NextResponse.json(
        { error: 'S3 bucket configuration is missing' },
        { status: 500 }
      )
    }

    if (!ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: 'AWS credentials are not configured' },
        { status: 500 }
      )
    }

    let body: { filename: string; contentType: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    if (!body.filename || !body.contentType) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['filename', 'contentType'],
        },
        { status: 400 }
      )
    }

    const sanitizedFilename = body.filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const timestamp = Date.now()
    const objectKey = `uploads/${timestamp}-${sanitizedFilename}`

    const putObjectCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      ContentType: body.contentType,
      ACL: 'public-read',
    })

    const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 900,
    })

    return NextResponse.json({
      success: true,
      presignedUrl,
      objectKey,
      expiresIn: 900,
      bucket: BUCKET_NAME,
      region: REGION,
    })

  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}
