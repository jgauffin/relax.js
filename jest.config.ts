import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  // transform: {
  //   "^.+\\.(ts|tsx)$": [
  //     "ts-jest",
  //     {
  //       tsconfig: "tsconfig.json",
  //       babelConfig: false,
  //     },
  //   ],
  // },
  //roots: ["./tests/"],
  testMatch: [
    //"<rootDir>./"
    "<rootDir>/tests/**"
  ],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "https://jestjs.io/",
  },
};
export default config;
