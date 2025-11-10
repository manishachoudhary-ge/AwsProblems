import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "eu-north-1" });
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  console.log("Received Event:", JSON.stringify(event, null, 2));


  const detail = event.detail;
  const bucket = detail.bucket.name;
  const key = decodeURIComponent(detail.object.key.replace(/\+/g, " "));

  const metadata = {
    id: key,
    bucket,
    fileName: key.split("/").pop(),
    processed: true,
    timestamp: new Date().toISOString(),
  };

  await ddbClient.send(new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      id: { S: metadata.id },
      fileName: { S: metadata.fileName },
      bucket: { S: metadata.bucket },
      processed: { BOOL: true },
      timestamp: { S: metadata.timestamp },
    },
  }));

  console.log(` File ${key} processed and saved to DynamoDB`);
  return { statusCode: 200 };
};
