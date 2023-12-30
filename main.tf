provider "aws" {
  region = "us-west-2"
}

# Define the AWS Lambda function
resource "aws_lambda_function" "MyDemoLambda" {
  function_name = "my_demo_lambda_function"
  handler       = "index.handler" # Replace with your actual handler
  role          = aws_iam_role.lambda_exec_role.arn # IAM role ARN with Lambda execution policy
  runtime       = "nodejs12.x" # Specify the runtime of your Lambda function

  filename         = "path_to_your_lambda_deployment_package.zip" # Replace with the actual path
  source_code_hash = filebase64sha256("path_to_your_lambda_deployment_package.zip") # Replace with the actual path
}

# IAM role for the Lambda function
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

# Attach the basic Lambda execution policy to the role
resource "aws_iam_policy_attachment" "lambda_exec_policy_attachment" {
  name       = "lambda_exec_policy_attachment"
  roles      = [aws_iam_role.lambda_exec_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Define the REST API
resource "aws_api_gateway_rest_api" "MyDemoAPI" {
  name        = "MyDemoAPI"
  description = "This is my API for demonstration purposes"
}

# Define a resource within the API
resource "aws_api_gateway_resource" "MyDemoResource" {
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  parent_id   = aws_api_gateway_rest_api.MyDemoAPI.root_resource_id
  path_part   = "mydemoresource"
}

# Define a method for the resource
resource "aws_api_gateway_method" "MyDemoMethod" {
  rest_api_id   = aws_api_gateway_rest_api.MyDemoAPI.id
  resource_id   = aws_api_gateway_resource.MyDemoResource.id
  http_method   = "GET"
  authorization = "NONE"
}

# Define the integration of the method with the Lambda function
resource "aws_api_gateway_integration" "MyDemoIntegration" {
  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id
  resource_id = aws_api_gateway_resource.MyDemoResource.id
  http_method = aws_api_gateway_method.MyDemoMethod.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.MyDemoLambda.invoke_arn
}

# Grant API Gateway permissions to invoke the Lambda function
resource "aws_lambda_permission" "api_gw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.MyDemoLambda.function_name
  principal     = "apigateway.amazonaws.com"

  # The source ARN is constructed from the API Gateway ARN and the specific method ARN
  source_arn = "${aws_api_gateway_rest_api.MyDemoAPI.execution_arn}/*/*/${aws_api_gateway_resource.MyDemoResource.path_part}"
}

# Deploy the API to a stage
resource "aws_api_gateway_deployment" "MyDemoAPIDeployment" {
  depends_on = [aws_api_gateway_integration.MyDemoIntegration]

  rest_api_id = aws_api_gateway_rest_api.MyDemoAPI.id

  # Use a unique identifier for each deployment to trigger a new deployment on changes
  stage_name = "v1"
}

# Output the invoke URL for the deployed API
output "invoke_url" {
  value = "${aws_api_gateway_deployment.MyDemoAPIDeployment.invoke_url}/v1"
}
