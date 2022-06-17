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
