provider "aws" {
  region = "us-east-1"
}
resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
      },
    ],
  })
}
resource "aws_iam_policy_attachment" "lambda_exec_policy_attachment" {
  name       = "lambda_exec_policy_attachment"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_lambda_function" "MyDemoLambda" {
  function_name    = "my_demo_lambda_function"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs18.x"
  filename         = "server/lambda_deployment_package.zip"
  source_code_hash = filebase64sha256("server/lambda_deployment_package.zip")
}
resource "aws_api_gateway_rest_api" "MyDemoAPI" {
  name        = "MyDemoAPI"
  description = "This is my API for demonstration purposes"
}
resource "aws_api_gateway_resource" "MyDemoResource" {
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  parent_id   = aws_api_gateway_rest_api.MyDemoAPI.root_resource_id
  path_part   = "mydemoresource"
}
resource "aws_api_gateway_method" "MyDemoMethod" {
  rest_api_id   = aws_api_gateway_rest_api.MyDemoAPI.id
  resource_id   = aws_api_gateway_resource.MyDemoResource.id
  http_method   = "GET"
  authorization = "NONE"
}
resource "aws_api_gateway_integration" "MyDemoIntegration" {
  rest_api_id             = aws_api_gateway_rest_api.MyDemoAPI.id
  resource_id             = aws_api_gateway_resource.MyDemoResource.id
  http_method             = aws_api_gateway_method.MyDemoMethod.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.MyDemoLambda.invoke_arn
}
resource "aws_lambda_permission" "api_gw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.MyDemoLambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.MyDemoAPI.execution_arn}/*/*/${aws_api_gateway_resource.MyDemoResource.path_part}"
}
resource "aws_iam_role" "lambda" {
  name = "lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}
resource "aws_lambda_function" "send_welcome_email" {
  function_name = "send_welcome_email"
  handler       = "send_welcome_email.handler"
  runtime       = "nodejs20.x"

  role          = aws_iam_role.lambda.arn
  filename      = "server/lambda_functions/send_welcome_email.zip"

source_code_hash = filebase64sha256("server/lambda_functions/send_welcome_email.zip")

  environment {
    variables = {
      EXTRA_VAR = "some_value"
    }
  }
}
git commit -m "Track large file with Git LFS"resource "aws_cognito_user_pool" "FlightBookingsUserPool" {
  name = "FlightBookingsUserPool" 

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  auto_verified_attributes = ["email"]
  
  email_verification_subject = "Verify your email for FlightBookings"
  email_verification_message = "Please click the link below to verify your email. {####}"
  lambda_config {
    post_confirmation = aws_lambda_function.send_welcome_email.arn
    // Add more lambda triggers as needed
  }

  // Additional user pool settings
  mfa_configuration = "OFF"
  admin_create_user_config {
    allow_admin_create_user_only = false
    invite_message_template {
      email_subject = "Welcome to FlightBookings!"
      email_message = "Welcome to FlightBookings! Your username is {username} and temporary password is {####}."
      sms_message = "Welcome to FlightBookings! Your username is {username} and your verification code is {####}."
    }
  }
  // Device tracking
  device_configuration {
    challenge_required_on_new_device     = true
    device_only_remembered_on_user_prompt = true
  }

  // Define account recovery settings
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }

  // Define advanced security settings
  user_pool_add_ons {
    advanced_security_mode = "AUDIT"
  }

  // Define attributes to capture additional user information
  schema {
    attribute_data_type      = "String"
    name                     = "birthdate"
    required                 = false
    mutable                  = true
  }
  schema {
    attribute_data_type      = "String"
    name                     = "preferred_airline"
    required                 = false
    mutable                  = true
  }

  // Define custom domain for your user pool - for local testing

}
resource "aws_cognito_user_pool_client" "FlightBookingsUserPoolClient" {
  name                           = "FlightBookingsUserPoolClient"
  user_pool_id                   = aws_cognito_user_pool.FlightBookingsUserPool.id
  generate_secret                = false
  explicit_auth_flows            = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  allowed_oauth_flows            = ["code", "implicit"]
  allowed_oauth_scopes           = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
  callback_urls                  = ["http://localhost:4000/callback"]
  logout_urls                    = ["http://localhost:4000/logout"]
  default_redirect_uri           = "http://localhost:4000/callback"
  allowed_oauth_flows_user_pool_client = true
}
resource "aws_api_gateway_authorizer" "my_api_authorizer" {
  name            = "my-api-authorizer"
  rest_api_id     = aws_api_gateway_rest_api.MyDemoAPI.id
  type            = "COGNITO_USER_POOLS"
  provider_arns   = [aws_cognito_user_pool.FlightBookingsUserPool.arn]
  identity_source = "method.request.header.Authorization"
}
resource "aws_api_gateway_deployment" "MyDemoAPIDeployment" {
  depends_on  = [aws_api_gateway_integration.MyDemoIntegration]
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  stage_name  = "v2"
}
output "invoke_url" {
  value = "${aws_api_gateway_deployment.MyDemoAPIDeployment.invoke_url}/mydemoresource"
}