import type { JestConfigWithTsJest } from "ts-jest";
import { defaults as tsjPreset } from "ts-jest/presets";

const config: JestConfigWithTsJest = {
  preset: "@shelf/jest-mongodb",
  ...tsjPreset,
  testEnvironment: "node",
  watchPathIgnorePatterns: ["globalConfig"],
};

export default config;
