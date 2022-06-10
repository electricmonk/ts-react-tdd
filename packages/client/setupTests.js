const nodeCrypto = require("crypto");
globalThis.crypto = {
  getRandomValues: (buffer) => nodeCrypto.randomFillSync(buffer),
};
