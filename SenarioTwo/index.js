export const handler = async (event) => {
  try {
    const method = event.httpMethod;
    const path = event.resource || event.path; 
    const id = event.pathParameters?.id;
    const body = event.body ? JSON.parse(event.body) : {};

    console.log("Path:", path);
    console.log("Method:", method);
    console.log("Body:", body);

    
    if (method === "POST" && path === "/itemsadd") {
      if (!body.id || !body.name || !body.city) {
        return { statusCode: 400, body: JSON.stringify({ error: "id, name, and city are required" }) };
      }

      const item = { id: body.id.toString(), name: body.name, city: body.city };
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return { statusCode: 201, body: JSON.stringify({ message: "Item created", item }) };
    }

    
    else if (method === "GET" && path === "/itemsget/{id}" && id) {
      const result = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
      return result.Item
        ? { statusCode: 200, body: JSON.stringify(result.Item) }
        : { statusCode: 404, body: JSON.stringify({ error: "Item not found" }) };
    }

   
    else if (method === "PUT" && path === "/itemsput/{id}" && id) {
      const { name, city } = body;
      await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: "set #n = :n, #c = :c",
        ExpressionAttributeNames: { "#n": "name", "#c": "city" },
        ExpressionAttributeValues: { ":n": name, ":c": city },
      }));
      return { statusCode: 200, body: JSON.stringify({ message: "Item updated" }) };
    }

   
    else if (method === "DELETE" && path === "/itemsdelete/{id}" && id) {
      await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
      return { statusCode: 200, body: JSON.stringify({ message: "Item deleted" }) };
    }

    
    else {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
    }
  } catch (err) {
    console.error("Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
