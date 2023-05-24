import { init } from "../../models";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

import { initMainFixture } from "../../fixtures/main";
import { APIGatewayProxyResult } from "aws-lambda";

// Init models & MongoDb connection outside to avoid problems with connection pool
const connection = init();

export const controller = async (): Promise<APIGatewayProxyResult> => {
  await connection;

  await initMainFixture();

  return formatJSONResponse({ success: true });
};

export const main = middyfy(controller);
