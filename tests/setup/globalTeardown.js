"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = globalTeardown;
async function globalTeardown() {
    const instance = global
        .__MONGOD__;
    if (instance) {
        await instance.stop();
    }
}
//# sourceMappingURL=globalTeardown.js.map