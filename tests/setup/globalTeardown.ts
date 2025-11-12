import { MongoMemoryServer } from "mongodb-memory-server";

export default async function globalTeardown() {
  const instance = (global as unknown as { __MONGOD__?: MongoMemoryServer })
    .__MONGOD__;
  if (instance) {
    await instance.stop();
  }
}
