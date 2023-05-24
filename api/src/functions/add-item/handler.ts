import { init } from "../../models";
import type { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";
import type { JSONSchemaType } from "ajv";
import Ajv from "ajv";
import { AddItemToOrderInput, addItemToOrder } from "../../services/orders";

// Init models & MongoDb connection outside to avoid problems with connection pool
const connection = init();

const schema: JSONSchemaType<AddItemToOrderInput> = {
  type: "object",
  properties: {
    packageId: { type: "string" },
    itemUid: { type: "string" },
  },
  required: ["packageId", "itemUid"],
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile(schema);

export const controller = async (
  event: Pick<APIGatewayEvent, "pathParameters" | "body">,
  context: { callbackWaitsForEmptyEventLoop: boolean }
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connection;

  const orderId = event.pathParameters?.orderId ?? null;
  const input = event.body ? JSON.parse(event.body) : null;

  if (!orderId) {
    throw new Error("Missing path param orderId");
  }

  if (!validate(input)) {
    throw new Error("Unable to parse body " + validate.errors?.[0].message);
  }

  return formatJSONResponse(await addItemToOrder(orderId, input));
};

export const main = middyfy(controller);
