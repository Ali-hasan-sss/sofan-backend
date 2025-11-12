"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const User_1 = require("../models/User");
const Shipment_1 = require("../models/Shipment");
exports.adminService = {
    getOverview: async () => {
        const [totalUsers, pendingUsers, approvedUsers, businessUsers, totalShipments,] = await Promise.all([
            User_1.UserModel.countDocuments(),
            User_1.UserModel.countDocuments({ status: "pending" }),
            User_1.UserModel.countDocuments({ status: "approved" }),
            User_1.UserModel.countDocuments({ role: "USER_BUSINESS" }),
            Shipment_1.ShipmentModel.countDocuments(),
        ]);
        const now = new Date();
        const since = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        const newUsersLast7Days = await User_1.UserModel.countDocuments({
            createdAt: { $gte: since },
        });
        return {
            totals: {
                users: totalUsers,
                usersPending: pendingUsers,
                usersApproved: approvedUsers,
                businessUsers,
                shipments: totalShipments,
            },
            newUsersLast7Days,
        };
    },
};
//# sourceMappingURL=adminService.js.map