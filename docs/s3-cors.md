# S3 CORS Configuration for File Uploads

This document explains how to configure Cross-Origin Resource Sharing (CORS) for your S3 bucket to enable direct file uploads from your web application.

## What is CORS?

Cross-Origin Resource Sharing (CORS) is a security feature that allows web applications to make requests to resources on different domains. For S3 file uploads, CORS must be properly configured to allow your frontend to upload files directly to S3.

## Why CORS is Needed

Without proper CORS configuration, browsers will block requests from your web application to S3, resulting in errors like:
- `Access to fetch at 'https://your-bucket.s3.amazonaws.com' from origin 'https://yourdomain.com' has been blocked by CORS policy`
- `No 'Access-Control-Allow-Origin' header is present on the requested resource`

## How to Configure S3 CORS

### 1. AWS Console Method

1. Go to the [S3 Console](https://console.aws.amazon.com/s3/)
2. Select your bucket
3. Click on the **Permissions** tab
4. Scroll down to **Cross-origin resource sharing (CORS)**
5. Click **Edit**
6. Paste the appropriate CORS configuration below
7. Click **Save changes**

### 2. AWS CLI Method

```bash
aws s3api put-bucket-cors --bucket thomasbucket26 --cors-configuration file://cors-config.json
```

## CORS Configuration Examples

### Development Environment

Use this configuration for local development and testing:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
       "https://st-thomas-ochre.vercel.app",

    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-meta-custom-header"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

### Production Environment

Use this configuration for production with your actual domain:

```json
[
  {
    "AllowedHeaders": [
      "Content-Type",
      "x-amz-meta-*",
      "x-amz-security-token"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "HEAD"
    ],
    "AllowedOrigins": [
      "https://yourdomain.com",
      "https://www.yourdomain.com",
      "https://admin.yourdomain.com"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-meta-custom-header"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

### Staging/Testing Environment

For staging or testing environments:

```json
[
  {
    "AllowedHeaders": [
      "Content-Type",
      "x-amz-meta-*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "HEAD"
    ],
    "AllowedOrigins": [
      "https://staging.yourdomain.com",
      "https://test.yourdomain.com",
      "https://dev.yourdomain.com"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

## Configuration Parameters Explained

### AllowedHeaders
- `Content-Type`: Required for specifying file MIME type
- `x-amz-meta-*`: Allows custom metadata headers
- `x-amz-security-token`: Required if using temporary credentials

### AllowedMethods
- `PUT`: Required for file uploads
- `GET`: Required for file downloads
- `POST`: Required for multipart uploads
- `HEAD`: Required for checking file existence
- `DELETE`: Optional, for file deletion

### AllowedOrigins
- **Development**: Local development URLs
- **Production**: Your actual domain(s)
- **Wildcards**: Use `*` for development only (not recommended for production)

### ExposeHeaders
- `ETag`: Useful for file integrity checks
- `x-amz-meta-*`: Custom metadata headers

### MaxAgeSeconds
- How long browsers should cache CORS preflight responses
- 3000 seconds (50 minutes) is a good default

## Security Best Practices

1. **Never use `*` for AllowedOrigins in production**
2. **Limit AllowedMethods to only what you need**
3. **Use specific domains instead of wildcards**
4. **Regularly review and update CORS policies**
5. **Test CORS configuration in all environments**

## Testing CORS Configuration

### Browser Developer Tools
1. Open Developer Tools (F12)
2. Go to Network tab
3. Attempt a file upload
4. Check for CORS errors in the console

### Test with cURL
```bash
curl -H "Origin: https://yourdomain.com" \
     -H "Access-Control-Request-Method: PUT" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-bucket.s3.amazonaws.com/uploads/test.txt
```

## Troubleshooting Common Issues

### CORS Error Still Occurring
1. **Check bucket region**: Ensure your S3 client is configured for the correct region
2. **Verify CORS policy**: Make sure the policy is saved and applied
3. **Clear browser cache**: CORS policies are cached by browsers
4. **Check domain spelling**: Ensure exact domain matches (including protocol)

### Preflight Request Failing
1. **Verify OPTIONS method**: Ensure your CORS policy allows OPTIONS
2. **Check headers**: Ensure required headers are in AllowedHeaders
3. **Review MaxAgeSeconds**: Increase if preflight requests are too frequent

## Environment-Specific Notes

### Development
- Use localhost origins
- Allow all headers for flexibility
- Include common development ports

### Production
- Use exact domain names
- Limit headers to essential ones
- Consider security implications of each allowed method

### Staging
- Use staging domain names
- Mirror production settings as closely as possible
- Test CORS configuration before deploying to production

## Related Documentation

- [AWS S3 CORS Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
