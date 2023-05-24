import { init } from "../../models";
import type {
  APIGatewayEvent,
  APIGatewayProxyEventBase,
  APIGatewayProxyResult,
} from "aws-lambda";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

import { getOrder } from "../../services/orders";

// Init models & MongoDb connection outside to avoid problems with connection pool
const connection = init();

export const controller = async (
  event: Pick<APIGatewayEvent, "pathParameters">,
  context: { callbackWaitsForEmptyEventLoop: boolean }
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connection;

  const orderId = event.pathParameters?.orderId ?? null;

  if (!orderId) {
    throw new Error("Missing path param orderId");
  }
  const order = await getOrder(orderId);

  return formatJSONResponse(order);
};

export const main = middyfy(controller);
