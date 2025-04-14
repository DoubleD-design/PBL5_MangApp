import boto3
import os

# Cấu hình AWS S3
AWS_ACCESS_KEY = "YOUR_ACCESS_KEY"
AWS_SECRET_KEY = "YOUR_SECRET_KEY"
BUCKET_NAME = "your-s3-bucket-name"
S3_REGION = "us-east-1"  # Thay bằng region của bạn

# Kết nối S3
s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=S3_REGION
)

def upload_to_s3(file_path, s3_key):
    try:
        s3.upload_file(file_path, BUCKET_NAME, s3_key, ExtraArgs={'ACL': 'public-read'})
        file_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
        print(f"File uploaded successfully: {file_url}")
        return file_url
    except Exception as e:
        print(f"Upload failed: {str(e)}")
        return None

# Ví dụ: Upload một file ảnh lên S3
file_path = "test_image.jpg"
s3_key = "uploads/test_image.jpg"
upload_to_s3(file_path, s3_key)
