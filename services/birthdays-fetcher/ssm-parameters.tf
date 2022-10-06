data "aws_ssm_parameter" "notion_api_key" {
  name = "NOTION_API_KEY"
}

data "aws_ssm_parameter" "notion_database_id" {
  name = "NOTION_DATABASE_ID"
}
