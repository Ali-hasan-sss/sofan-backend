import { UserModel } from "../models/User";
import { ShipmentModel } from "../models/Shipment";

export const adminService = {
  getOverview: async () => {
    const [
      totalUsers,
      pendingUsers,
      approvedUsers,
      businessUsers,
      totalShipments,
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ status: "pending" }),
      UserModel.countDocuments({ status: "approved" }),
      UserModel.countDocuments({ role: "USER_BUSINESS" }),
      ShipmentModel.countDocuments(),
    ]);

    const now = new Date();
    const since = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
    const newUsersLast7Days = await UserModel.countDocuments({
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
