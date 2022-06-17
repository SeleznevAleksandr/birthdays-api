data "aws_kms_secrets" "notion_api_key" {
  secret {
    name    = "notion_api_key"
    payload = var.notion_api_key
  }
}

data "aws_kms_secrets" "notion_database_id" {
  secret {
    name    = "notion_database_id"
    payload = var.notion_database_id
  }
}

resource "aws_ssm_parameter" "dynamic" {
  for_each     = local.decoded_secrets
  name        = "${local.path_prefix}/${each.key}"
  type        = "SecureString"
  value       = each.value
  overwrite   = true
}
