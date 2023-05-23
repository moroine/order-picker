import type {APIGatewayProxyResult } from "aws-lambda";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";

interface ValidatedAPIGatewayProxyEvent<S extends JSONSchema> {
  body: FromSchema<S>
}

export type ValidatedEventAPIGatewayProxyEvent<S extends JSONSchema> = (event: ValidatedAPIGatewayProxyEvent<S>) => Promise<APIGatewayProxyResult>;

export const formatJSONResponse = (response: Record<string, unknown>): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
