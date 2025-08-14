# Environment Setup for S3 File Uploads

This document explains how to configure the environment variables needed for S3 file uploads in your church website.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=thomasbucket26
```

## How to Get AWS Credentials

### 1. Create IAM User
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. Give it a name like "church-website-s3-upload"
4. Select "Programmatic access"

### 2. Attach IAM Policy
1. Attach the policy from `docs/iam-policy-s3-upload.json`
2. Replace `YOUR_BUCKET_NAME` with `thomasbucket26` in the policy
3. Create the user

### 3. Get Access Keys
1. After creating the user, you'll get:
   - Access Key ID
   - Secret Access Key
2. Copy these to your `.env.local` file

## S3 Bucket Setup

### 1. Create S3 Bucket
1. Go to [S3 Console](https://console.aws.amazon.com/s3/)
2. Create bucket named `thomasbucket26`
3. Choose your preferred region
4. Keep default settings for now

### 2. Configure CORS
1. Go to bucket → Permissions → CORS
2. Use the configuration from `docs/s3-cors.md`
3. Replace `yourdomain.com` with your actual domain

### 3. Update Environment Variables
Make sure `AWS_REGION` matches your bucket's region.

## Testing the Setup

1. **Start your development server**: `pnpm dev`
2. **Go to**: `/admin/events/new`
3. **Upload an image** and click "Publish Event"
4. **Check the browser console** for any errors
5. **Verify in S3** that the file was uploaded to `uploads/` folder

## Troubleshooting

### Common Issues

1. **"AWS credentials are not configured"**
   - Check that `.env.local` exists and has correct values
   - Restart your development server after adding environment variables

2. **"S3 bucket configuration is missing"**
   - Verify `AWS_S3_BUCKET_NAME=thomasbucket26` is set

3. **CORS errors in browser**
   - Check S3 CORS configuration
   - Ensure your domain is in the allowed origins

4. **"Access denied" errors**
   - Verify IAM policy is attached to the correct user
   - Check that the bucket name in the policy matches exactly

### Security Notes

- **Never commit** `.env.local` to version control
- **Use least privilege** IAM policies
- **Rotate access keys** regularly
- **Monitor S3 access logs** for unusual activity

## File Upload Flow

1. **User selects image** in admin form
2. **Frontend calls** `/api/s3/presign` with file info
3. **API generates** presigned URL for S3
4. **Frontend uploads** directly to S3 using presigned URL
5. **S3 URL is saved** to `image_url` field in events table
6. **Event is created** with the S3 image URL

## File Storage Structure

```
thomasbucket26/
└── uploads/
    ├── 1234567890-event-image-1.jpg
    ├── 1234567891-event-image-2.png
    └── 1234567892-event-image-3.gif
```

Files are stored with timestamps to prevent naming conflicts.
