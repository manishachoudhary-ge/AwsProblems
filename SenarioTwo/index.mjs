import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const uuidv4 = () => crypto.randomUUID();

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  const method = event.httpMethod;
  const id = event.pathParameters?.id ? decodeURIComponent(event.pathParameters.id) : null;

  try {
    switch (method) {
      case "POST": {
        
        const body = JSON.parse(event.body);
        const item = {
          id: uuidv4(),
          owner: body.owner,
          title: body.title,
          metadata: body.metadata,
        };

        await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
        return response(201, { message: "Item created", item });
      }

      case "GET": {
        if (id) {
          
          const result = await docClient.send(
            new GetCommand({ TableName: TABLE_NAME, Key: { id } })
          );
          return result.Item
            ? response(200, result.Item)
            : response(404, { message: "Item not found" });
        } else {
          
          const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
          return response(200, result.Items);
        }
      }

      case "PUT": {
        if (!id) return response(400, { message: "Missing id" });
        const body = JSON.parse(event.body);

        await docClient.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: "set #owner = :o, #title = :t, #metadata = :m",
            ExpressionAttributeNames: {
              "#owner": "owner",
              "#title": "title",
              "#metadata": "metadata",
            },
            ExpressionAttributeValues: {
              ":o": body.owner,
              ":t": body.title,
              ":m": body.metadata,
            },
            ReturnValues: "ALL_NEW",
          })
        );

        return response(200, { message: "Item updated" });
      }

      case "DELETE": {
        if (!id) return response(400, { message: "Missing id" });
        await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
        return response(200, { message: "Item deleted" });
      }

      default:
        return response(405, { message: "Method Not Allowed" });
    }
  } catch (err) {
    console.error(err);
    return response(500, { message: "Internal Server Error", error: err.message });
  }
};

const response = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
