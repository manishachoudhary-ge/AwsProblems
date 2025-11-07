# AwsProblems
1.Scenario: Create a simple API using AWS Lambda and API Gateway that returns service info (like name, version, and uptime).

GitHub repo link: https://github.com/manishachoudhary-ge/AwsProblems/tree/main/SenarioOne

Deployed endpoint URL : https://uwq0rvk6ra.execute-api.eu-north-1.amazonaws.com/dev/health

Test results: {"service":"hadow-service","version":"0.1.0","time":"2025-11-07T10:29:29.719Z"}

Explaining setup: At First created a Lamda Function with corresponding result, and configured environment variables for Service_name and Service_version and than deploy and Test the the Function. After this is Created a API for the Api gateway with Http API to get Result  through the API response, created API with GET Method and /health endpoint and deployed the API, Correctly showing the result.                                                                                                              

