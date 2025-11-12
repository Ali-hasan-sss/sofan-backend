import { MongoMemoryServer } from "mongodb-memory-server";

declare global {
  // eslint-disable-next-line no-var
  var __MONGOD__: MongoMemoryServer | undefined;
}

export {};
