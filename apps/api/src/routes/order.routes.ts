import { Router } from "express";
import { orderController } from "@/controllers/order.controller";
import { asyncHandler } from "@/middleware/asyncHandler";
import { requireAuth } from "@/middleware/auth";

export const orderRouter = Router();

orderRouter.post("/", requireAuth, asyncHandler(orderController.create));
orderRouter.get("/track", asyncHandler(orderController.track));
orderRouter.get("/:orderId", asyncHandler(orderController.getConfirmation));
