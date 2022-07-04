// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

/*
  1. jest native [transformer](https://jestjs.io/docs/code-transformation) fails to transpile es6 exports
  2. we ask it ignore it
  3. we then explicitly ask ts-jest (which is a hook into our tsc process) to transform it instead since the `node_modules` folder is ignored by default. 
  4. ts-jest then emits a working export of nanoid.
*/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "node_modules/nanoid/.+\\.(j|t)sx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!nanoid/.*)"],
  setupFilesAfterEnv: ["./setupTests.js"],
};
