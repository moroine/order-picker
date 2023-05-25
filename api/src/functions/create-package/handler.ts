import { init } from "../../models";
import type { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

import { createPackage } from "../../services/packages";

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
  const packages = await createPackage(orderId);

  return formatJSONResponse(packages);
};

export const main = middyfy(controller);
