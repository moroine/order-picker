import { init } from "../../models";
import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "../../libs/lambda";

import { initMainFixture } from "src/fixtures/main";

// Init models & MongoDb connection outside to avoid problems with connection pool
const connection = init();

export const controller = async () => {
  await connection;

  await initMainFixture();

  return formatJSONResponse({ success: true });
};

export const main = middyfy(controller);
