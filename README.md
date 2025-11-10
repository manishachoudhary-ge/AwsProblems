# AwsProblems
1.Scenario: Create a simple API using AWS Lambda and API Gateway that returns service info (like name, version, and uptime).

GitHub repo link: https://github.com/manishachoudhary-ge/AwsProblems/tree/main/SenarioOne

Deployed endpoint URL : https://uwq0rvk6ra.execute-api.eu-north-1.amazonaws.com/dev/health

Test results: {"service":"hadow-service","version":"0.1.0","time":"2025-11-07T10:29:29.719Z"}

Explaining setup: At First created a Lamda Function with corresponding result, and configured environment variables for Service_name and Service_version and than deploy and Test the the Function. After this is Created a API for the Api gateway with Http API to get Result  through the API response, created API with GET Method and /health endpoint and deployed the API, Correctly showing the result.                                                                                                              2. Build a simple CRUD service using Lambda, DynamoDB, and API Gateway.

GitHub repo link:

Explaining setup: First created a lamda Function for performing the crud operations then created a database table and configure the table name in environment variables and and then created a API through API gatewat with endpoints and requeired methods and the checked the result.


3.Scenario: Allow users to upload and download files using presigned URLs.

GitHub repo link: 

Deployed endpoint URL : https://s12saqkxfc.execute-api.eu-north-1.amazonaws.com/prod/files

Explaining setup: Created a Function for Upload a file to s3 and Store metadata (file name, id, and timestamp) in DynamoDB.and created a function for getting the presigned url from s3 and than Test this using postman and used environment variables for Table_name and Bucket_name and added required permissions.