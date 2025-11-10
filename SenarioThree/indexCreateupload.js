
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";


const s3Client = new S3Client({ region: "eu-north-1" });
const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const BUCKET_NAME = process.env.BUCKET_NAME;
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const fileName = body.fileName;

  const id = crypto.randomUUID();

  const key = `${id}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); 

 
  const metadata = {
    id,
    fileName,
    s3Key: key,
    timestamp: new Date().toISOString(),
  };

  await ddbClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: metadata,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Upload URL generated",
      uploadUrl,
      id,
    }),
  };
};
