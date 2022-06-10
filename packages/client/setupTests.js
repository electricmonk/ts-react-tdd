//setupTests.tsx
const nodeCrypto = require("crypto");

globalThis.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer);
  },
};
