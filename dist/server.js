"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mongoose_1 = require("./loaders/mongoose");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const bootstrap_1 = require("./loaders/bootstrap");
const startServer = async () => {
    await (0, mongoose_1.connectMongoose)();
    await (0, bootstrap_1.ensureDefaultAdmin)();
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`Server listening on port ${env_1.env.PORT}`);
    });
};
startServer().catch((error) => {
    logger_1.logger.error("Failed to start server", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map