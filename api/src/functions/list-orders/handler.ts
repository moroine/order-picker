import { init } from "../../models";
import type { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

import schema from "./schema";
import { listOrders } from "../../services/orders";

// Init models & MongoDb connection outside to avoid problems with connection pool
const connection = init();

export const controller: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async () => {
  await connection;

  const orders = await listOrders();

  return formatJSONResponse(orders);
};

export const main = middyfy(controller);
