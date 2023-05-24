import { init } from "../../models";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

import { listOrders } from "../../services/orders";
import { APIGatewayProxyResult } from "aws-lambda";

// Init models & MongoDb connection outside to avoid problems with connection pool
const connection = init();

export const controller = async (): Promise<APIGatewayProxyResult> => {
  await connection;

  const orders = await listOrders();

  return formatJSONResponse(orders);
};

export const main = middyfy(controller);
