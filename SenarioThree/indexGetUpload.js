
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const s3Client = new S3Client({ region: "eu-north-1" });
const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const BUCKET_NAME = process.env.BUCKET_NAME;
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  const id = event.pathParameters.id;

  const { Item } = await ddbClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  }));

  if (!Item) {
    return { statusCode: 404, body: JSON.stringify({ message: "File not found" }) };
  }

 
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: Item.s3Key,
  });
  const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); 

  return {
    statusCode: 200,
    body: JSON.stringify({
      metadata: Item,
      downloadUrl,
    }),
  };
};
