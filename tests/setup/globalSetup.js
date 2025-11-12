"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = globalSetup;
const mongodb_memory_server_1 = require("mongodb-memory-server");
async function globalSetup() {
    const instance = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = instance.getUri();
    global.__MONGOD__ =
        instance;
    process.env.MONGO_URI = uri;
    process.env.JWT_ACCESS_SECRET = "test-access-secret";
    process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
}
//# sourceMappingURL=globalSetup.js.map