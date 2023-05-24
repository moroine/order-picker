import type { APIGatewayProxyResult } from "aws-lambda";

export const formatJSONResponse = (
  response: unknown
): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
