import { createApp } from "./app";
import { connectMongoose } from "./loaders/mongoose";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { ensureDefaultAdmin } from "./loaders/bootstrap";

const startServer = async () => {
  await connectMongoose();
  await ensureDefaultAdmin();
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`);
  });
};

startServer().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
