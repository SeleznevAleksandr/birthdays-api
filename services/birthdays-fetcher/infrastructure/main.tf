terraform {
  backend "s3" {
    bucket = "birthdays-fetcher-artifacts"
    key    = "state"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.13.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_dynamodb_table" "birthdays-table" {
  name         = "Birthdays"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userName"
  
  attribute {
    name = "userName"
    type = "S"
  }

  tags = {
    Name = "dynamo-db-table-seleznev"
  }
}

resource "aws_lambda_function" "birthdays-fetcher" {
  function_name    = "birthdays-fetcher-lambda"
  role             = aws_iam_role.lambda-role.arn
  filename         = ".${path.module}/index.zip"
  handler          = "index.handler"
  runtime          = "nodejs14.x"
  timeout          = 60
  source_code_hash = filebase64sha256(".${path.module}/index.zip")

  environment {
    variables = {
      NOTION_API_KEY = aws_ssm_parameter.dynamic["NOTION_API_KEY"].value
      NOTION_DATABASE_ID = aws_ssm_parameter.dynamic["NOTION_DATABASE_ID"].value
    }
  }
}

resource "aws_iam_role" "lambda-role" {
  name = "lambda-birthdays-fetcher"
  path = "/"

  assume_role_policy = data.aws_iam_policy_document.policy-main.json
}

data "aws_iam_policy_document" "policy-main" {
  statement {
    actions = [
      "sts:AssumeRole"
    ]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "additional-policy" {
  statement {
    actions = ["ssm:GetParameter*"]
  
    resources = ["arn:aws:ssm:us-east-1:*:parameter/NOTION/*"]
  }

  statement {
    actions = [
      "dynamodb:BatchGetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem"
    ]

    resources = [aws_dynamodb_table.birthdays-table.arn]
  }

  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = ["arn:aws:logs:*:*:*"]// ["*"]
  }
}

resource "aws_iam_policy" "additional-policy" {
  name   = "lambda-birthdays-fetcher-policy"
  path   = "/"
  policy = data.aws_iam_policy_document.additional-policy.json
}

resource "aws_iam_role_policy_attachment" "test-attach" {
  role       = aws_iam_role.lambda-role.name
  policy_arn = aws_iam_policy.additional-policy.arn
}


resource "aws_cloudwatch_event_rule" "lambda-invocation" {
  name        = "capture-aws-sign-in"
  description = "Capture each AWS Console Sign In"

  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "lambda-function" {
  rule      = aws_cloudwatch_event_rule.lambda-invocation.name
  arn       = aws_lambda_function.birthdays-fetcher.arn
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.birthdays-fetcher.arn
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lambda-invocation.arn
}
