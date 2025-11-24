import { Request, Response } from "express";
export declare const ShipmentWorkflowController: {
    getBranchCouriers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getBranchEmployees: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getBranchTasks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getPendingShipments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    approveShipment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    assignCourier: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    createTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    startTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scanPickup: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scanArrival: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scanDeparture: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    scanDelivery: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getTracking: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=shipmentWorkflowController.d.ts.map