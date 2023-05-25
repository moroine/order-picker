import { init } from "../../models";
import type { APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

import { getAvailableItems } from "../../services/items";

// Init models & MongoDb connection outside to avoid problems with connection pool
const connection = init();

export const controller = async (
  e: unknown,
  context: { callbackWaitsForEmptyEventLoop: boolean }
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connection;
  const packages = await getAvailableItems();

  return formatJSONResponse(packages);
};

export const main = middyfy(controller);
