"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
beforeAll(async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is not defined for tests");
    }
    await mongoose_1.default.connect(uri, { dbName: "test" });
});
afterEach(async () => {
    await mongoose_1.default.connection.db.dropDatabase();
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
});
//# sourceMappingURL=setupTests.js.map