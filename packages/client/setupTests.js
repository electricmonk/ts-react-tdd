const nodeCrypto = require("crypto");
globalThis.crypto = { // see https://stackoverflow.com/a/62601487/1194694
  getRandomValues: (buffer) => nodeCrypto.randomFillSync(buffer),
};
