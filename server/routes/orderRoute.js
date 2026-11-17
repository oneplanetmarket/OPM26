
import express from "express";
import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";

import {
    getAllOrders,
    getUserOrders,
    placeOrderCOD,
    createCashfreeOrder,
    verifyCashfreePayment,
    updateOrderStatus
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Cash on Delivery
orderRouter.post("/cod", authUser, placeOrderCOD);

// Create Cashfree payment order
orderRouter.post(
    "/cashfree/create",
    authUser,
    createCashfreeOrder
);

// Verify Cashfree payment
orderRouter.get(
    "/cashfree/verify/:orderId",
    authUser,
    verifyCashfreePayment
);

// User orders
orderRouter.get("/user", authUser, getUserOrders);

// Seller orders
orderRouter.get("/seller", authSeller, getAllOrders);

// Update seller order status
orderRouter.patch("/status", authSeller, updateOrderStatus);

export default orderRouter;
