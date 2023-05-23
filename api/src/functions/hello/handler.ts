import { init } from "src/models";
import type { ValidatedEventAPIGatewayProxyEvent } from "../../libs/api-gateway";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

import schema from "./schema";

// Init models & MongoDb connection outside to avoid problems with connection pool
const connection = init();

export const controller: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  await connection;

  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
  });
};

export const main = middyfy(controller);
