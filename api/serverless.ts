import type { AWS } from "@serverless/typescript";

import listOrders from "./src/functions/list-orders";
import viewOrder from "./src/functions/view-order";
import createPackage from "./src/functions/create-package";
import availableItems from "./src/functions/available-items";
import loadFixtures from "./src/functions/load-fixtures";
import addItem from "./src/functions/add-item";

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: "order-picker",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      MONGO_URL: "${env:MONGO_URL}",
    },
  },
  functions: {
    listOrders,
    loadFixtures,
    viewOrder,
    createPackage,
    availableItems,
    addItem,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
