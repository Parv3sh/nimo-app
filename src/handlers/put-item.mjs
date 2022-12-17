import axios from "axios";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.PRICE_TABLE;

export const putItemHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    );
  }
  console.info("received:", event);

  const id = event.pathParameters.id;
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=aud`;
  const res = await axios.get(url);
  const data = res.data;

  const sesClient = new SESClient({});
  const sesParams = {
    Destination: {
      ToAddresses: ["parveshk2+nimo@gmail.com"],
    },
    Message: {
      Body: {
        Text: { Data: `The price of ${id} is ${data[id].aud}` },
        Html: {
          Data: `<html><head><style>h1 {font-size: 100px;}</style></head><body><h1>The price of ${id} is ${data[id].aud} AUD</h1></body></html>`,
        },
      },
      Subject: { Data: "Price Alert" },
    },
    Source: "parveshk2+nimo@gmail.com",
  };
  const sesData = await sesClient.send(new SendEmailCommand(sesParams));
  console.log("Success - email sent", sesData);

  const params = {
    TableName: tableName,
    Item: { id: new Date().toISOString(), name: id, price: data[id].aud },
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(data),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
