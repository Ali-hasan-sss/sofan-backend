import { MongoMemoryServer } from "mongodb-memory-server";

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  (global as unknown as { __MONGOD__: MongoMemoryServer }).__MONGOD__ =
    instance;
  process.env.MONGO_URI = uri;
  process.env.JWT_ACCESS_SECRET = "test-access-secret";
  process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
}
