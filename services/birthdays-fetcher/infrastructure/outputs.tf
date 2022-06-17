output "dynamodb_table_name" {
  description = "DynamoDB created table name"
  value       = aws_dynamodb_table.birthdays-table.name
}
