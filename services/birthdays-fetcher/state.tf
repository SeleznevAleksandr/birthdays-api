resource "aws_s3_bucket" "widget-tstate-storage" {
  bucket = "birthdays-fetcher-artifacts"
}

resource "aws_s3_bucket_acl" "widget-tstate-storage-acl" {
  bucket = aws_s3_bucket.widget-tstate-storage.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "widget-tstate-storage-example" {
  bucket = aws_s3_bucket.widget-tstate-storage.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "widget-state-encryption" {
  bucket = aws_s3_bucket.widget-tstate-storage.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }

    bucket_key_enabled = true
  }
}
