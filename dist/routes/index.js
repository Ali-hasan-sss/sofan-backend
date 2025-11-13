"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const branches_1 = __importDefault(require("./branches"));
const shipments_1 = __importDefault(require("./shipments"));
const pricing_1 = __importDefault(require("./pricing"));
const wallet_1 = __importDefault(require("./wallet"));
const invoices_1 = __importDefault(require("./invoices"));
const admin_1 = __importDefault(require("./admin"));
const locations_1 = __importDefault(require("./locations"));
const staff_1 = __importDefault(require("./staff"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/users", users_1.default);
router.use("/branches", branches_1.default);
router.use("/shipments", shipments_1.default);
router.use("/pricing", pricing_1.default);
router.use("/wallet", wallet_1.default);
router.use("/invoices", invoices_1.default);
router.use("/admin", admin_1.default);
router.use("/locations", locations_1.default);
router.use("/staff", staff_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map