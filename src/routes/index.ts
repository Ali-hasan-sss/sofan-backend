import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./users";
import branchRouter from "./branches";
import shipmentRouter from "./shipments";
import pricingRouter from "./pricing";
import walletRouter from "./wallet";
import invoiceRouter from "./invoices";
import adminRouter from "./admin";
import locationsRouter from "./locations";
import staffRouter from "./staff";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/branches", branchRouter);
router.use("/shipments", shipmentRouter);
router.use("/pricing", pricingRouter);
router.use("/wallet", walletRouter);
router.use("/invoices", invoiceRouter);
router.use("/admin", adminRouter);
router.use("/locations", locationsRouter);
router.use("/staff", staffRouter);

export default router;
