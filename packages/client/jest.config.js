// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "node_modules/nanoid/.+\\.(j|t)sx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!nanoid/.*)"],
  setupFilesAfterEnv: ["./setupTests.js"],
};
