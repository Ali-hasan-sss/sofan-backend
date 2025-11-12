export declare const adminService: {
    getOverview: () => Promise<{
        totals: {
            users: number;
            usersPending: number;
            usersApproved: number;
            businessUsers: number;
            shipments: number;
        };
        newUsersLast7Days: number;
    }>;
};
//# sourceMappingURL=adminService.d.ts.map