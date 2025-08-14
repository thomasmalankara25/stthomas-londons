export interface S3UploadResult {
  success: boolean
  presignedUrl?: string
  objectKey?: string
  s3Url?: string
  error?: string
}

export async function uploadFileToS3(file: File): Promise<S3UploadResult> {
  try {
    // Step 1: Get presigned URL from our API
    const presignResponse = await fetch('/api/s3/presign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    })

    if (!presignResponse.ok) {
      const errorData = await presignResponse.json()
      throw new Error(errorData.error || 'Failed to get presigned URL')
    }

    const { presignedUrl, objectKey } = await presignResponse.json()

    // Step 2: Upload file directly to S3 using presigned URL
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to S3')
    }

    // Step 3: Return the S3 object URL
    const s3Url = `https://thomasbucket26.s3.amazonaws.com/${objectKey}`

    return {
      success: true,
      presignedUrl,
      objectKey,
      s3Url,
    }
  } catch (error) {
    console.error('S3 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

export function getS3UrlFromObjectKey(objectKey: string): string {
  return `https://thomasbucket26.s3.amazonaws.com/${objectKey}`
}
