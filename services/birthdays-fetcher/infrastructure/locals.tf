locals {
  decoded_secrets = {
    "NOTION_API_KEY"     = yamldecode(data.aws_kms_secrets.notion_api_key.plaintext["notion_api_key"]),
    "NOTION_DATABASE_ID" = yamldecode(data.aws_kms_secrets.notion_database_id.plaintext["notion_database_id"])
  }

  path_prefix = "/NOTION"
}
