import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize S3 client with fallback credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIA3GFGRLXXPITTXL27',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'thomasbucket26'

export async function POST(request: NextRequest) {
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed. Use POST.' },
        { status: 405 }
      )
    }

    // Check if required environment variables are set
    if (!BUCKET_NAME) {
      console.error('AWS_S3_BUCKET_NAME environment variable is not set')
      return NextResponse.json(
        { error: 'S3 bucket configuration is missing' },
        { status: 500 }
      )
    }

    // Check if we have credentials (either from env or fallback)
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'AKIA3GFGRLXXPITTXL27'
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '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'
    
    if (!accessKeyId || !secretAccessKey) {
      console.error('AWS credentials are not configured')
      return NextResponse.json(
        { error: 'AWS credentials are not configured' },
        { status: 500 }
      )
    }

    // Parse and validate request body
    let body: { filename: string; contentType: string }
    
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.filename || !body.contentType) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['filename', 'contentType'],
          received: Object.keys(body)
        },
        { status: 400 }
      )
    }

    // Validate filename
    if (typeof body.filename !== 'string' || body.filename.trim().length === 0) {
      return NextResponse.json(
        { error: 'Filename must be a non-empty string' },
        { status: 400 }
      )
    }

    // Validate content type
    if (typeof body.contentType !== 'string' || body.contentType.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content type must be a non-empty string' },
        { status: 400 }
      )
    }

    // Sanitize filename and create object key
    const sanitizedFilename = body.filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const timestamp = Date.now()
    const objectKey = `uploads/${timestamp}-${sanitizedFilename}`

    // Create the S3 command
    const putObjectCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      ContentType: body.contentType,
      ACL: 'public-read', // Make uploaded files publicly readable
    })

    // Generate presigned URL (valid for 15 minutes)
    const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 900, // 15 minutes
    })

    return NextResponse.json({
      success: true,
      presignedUrl,
      objectKey,
      expiresIn: 900,
      bucket: BUCKET_NAME,
    })

  } catch (error) {
    console.error('Error generating presigned URL:', error)
    
    // Return generic error message for security
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}
