
import crypto from "crypto";
import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import cashfree from "../configs/cashfree.js";

// ==========================================
// CONFIGURATION
// ==========================================

const CASHFREE_API_VERSION = "2023-08-01";

const FRONTEND_URL = process.env.FRONTEND_URL
    ?.trim()
    .replace(/\/+$/, "");

const BACKEND_URL = process.env.BACKEND_URL
    ?.trim()
    .replace(/\/+$/, "");

const CASHFREE_ENV = process.env.CASHFREE_ENV
    ?.trim()
    .toUpperCase();

const ALLOWED_ORDER_STATUSES = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
];

const getAuthenticatedUserId = (req) => {
    return (
        req.user?.id ||
        req.user?._id ||
        req.userId ||
        req.body?.userId
    );
};

const getCashfreeEnvironment = () => {
    if (!["SANDBOX", "PRODUCTION"].includes(CASHFREE_ENV)) {
        throw new Error(
            "CASHFREE_ENV must be SANDBOX or PRODUCTION"
        );
    }

    if (
        !process.env.CASHFREE_APP_ID?.trim() ||
        !process.env.CASHFREE_SECRET_KEY?.trim()
    ) {
        throw new Error(
            "Cashfree API credentials are missing"
        );
    }

    return CASHFREE_ENV;
};

// ==========================================
// CALCULATE ORDER TOTAL
// ==========================================

const calculateOrder = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Your cart is empty");
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error("Invalid product quantity");
        }

        const product = await Product.findById(item.product);

        if (!product) {
            throw new Error(
                "A product in your cart is unavailable"
            );
        }

        const price = Number(product.offerPrice);

        if (!Number.isFinite(price) || price <= 0) {
            throw new Error("Invalid product price");
        }

        subtotal += price * quantity;

        validatedItems.push({
            product: product._id.toString(),
            quantity
        });
    }

    const tax = Math.floor(subtotal * 0.02);
    const total = Number((subtotal + tax).toFixed(2));

    if (!Number.isFinite(total) || total <= 0) {
        throw new Error("Invalid order amount");
    }

    return {
        items: validatedItems,
        amount: total
    };
};

// ==========================================
// VALIDATE CUSTOMER AND ADDRESS
// ==========================================

const getCustomerDetails = async (userId, addressId) => {
    const [user, address] = await Promise.all([
        User.findById(userId),
        Address.findOne({
            _id: addressId,
            userId
        })
    ]);

    if (!user || !address) {
        throw new Error(
            "Invalid customer or delivery address"
        );
    }

    const phone = String(address.phone || "")
        .replace(/\D/g, "");

    if (!/^\d{10}$/.test(phone)) {
        throw new Error(
            "Please provide a valid 10-digit phone number in your address"
        );
    }

    const email = String(
        address.email || user.email || ""
    ).trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error(
            "Please provide a valid customer email"
        );
    }

    return {
        user,
        address,
        phone,
        email
    };
};

// ==========================================
// CASH ON DELIVERY
// POST /api/order/cod
// ==========================================

export const placeOrderCOD = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const { items, address } = req.body || {};

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Please select a delivery address"
            });
        }

        await getCustomerDetails(userId, address);

        const orderData = await calculateOrder(items);

        const order = await Order.create({
            userId,
            items: orderData.items,
            amount: orderData.amount,
            address,
            paymentType: "COD",
            isPaid: false
        });

        await User.findByIdAndUpdate(userId, {
            cartItems: {}
        });

        return res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
            orderId: order._id
        });

    } catch (error) {
        console.error("COD ORDER ERROR:", error.message);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// CREATE CASHFREE ORDER
// POST /api/order/cashfree/create
// ==========================================

export const createCashfreeOrder = async (req, res) => {
    let localOrder = null;

    try {
        const userId = getAuthenticatedUserId(req);
        const { items, address } = req.body || {};

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Please select a delivery address"
            });
        }

        if (!FRONTEND_URL) {
            throw new Error(
                "FRONTEND_URL is missing from server/.env"
            );
        }

        const environment = getCashfreeEnvironment();

        const {
            user,
            address: deliveryAddress,
            phone,
            email
        } = await getCustomerDetails(userId, address);

        const orderData = await calculateOrder(items);

        // Create local pending order.
        localOrder = await Order.create({
            userId,
            items: orderData.items,
            amount: orderData.amount,
            address,
            paymentType: "Online",
            isPaid: false
        });

        const cashfreeOrderId =
            `OPM_${localOrder._id}_${Date.now()}`;

        const customerName =
            `${deliveryAddress.firstName || ""} ${deliveryAddress.lastName || ""}`
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .trim()
                .slice(0, 100) || "Customer";

        const orderMeta = {
            return_url:
                `${FRONTEND_URL}/payment-status?order_id={order_id}`
        };

        if (BACKEND_URL) {
            orderMeta.notify_url =
                `${BACKEND_URL}/api/order/cashfree/webhook`;
        }

        const request = {
            order_id: cashfreeOrderId,
            order_amount: Number(orderData.amount.toFixed(2)),
            order_currency: "INR",

            customer_details: {
                customer_id: user._id.toString(),
                customer_name: customerName,
                customer_email: email,
                customer_phone: phone
            },

            order_meta: orderMeta,

            order_note:
                `One Planet Market order ${localOrder._id}`
        };

        console.log("Creating Cashfree order:", {
            environment,
            sdkVersion: "6.0.6",
            apiVersion: CASHFREE_API_VERSION,
            orderId: cashfreeOrderId,
            amount: request.order_amount
        });

        // cashfree-pg v6 uses PGCreateOrder(request).
        const response = await cashfree.PGCreateOrder(request);

        const paymentSessionId =
            response?.data?.payment_session_id;

        if (!paymentSessionId) {
            throw new Error(
                "Cashfree did not return a payment session ID"
            );
        }

        localOrder.cashfreeOrderId = cashfreeOrderId;
        await localOrder.save();

        console.log("Cashfree order created successfully:", {
            orderId: cashfreeOrderId,
            status: response.data.order_status,
            environment
        });

        return res.status(201).json({
            success: true,
            message: "Cashfree order created successfully",
            order_id: cashfreeOrderId,
            payment_session_id: paymentSessionId,
            amount: orderData.amount
        });

    } catch (error) {
        if (localOrder) {
            try {
                await Order.findByIdAndDelete(localOrder._id);
            } catch (deleteError) {
                console.error(
                    "Failed to remove pending order:",
                    deleteError.message
                );
            }
        }

        console.error("CASHFREE ORDER CREATION ERROR:", {
            message: error.message,
            status: error.response?.status,
            response: error.response?.data,
            code: error.code,
            requestId: error.response?.headers?.["x-request-id"]
        });

        const statusCode = error.response?.status || 500;

        return res.status(
            statusCode >= 400 && statusCode < 500
                ? statusCode
                : 500
        ).json({
            success: false,
            message:
                error.response?.data?.message ||
                error.message ||
                "Unable to create Cashfree payment"
        });
    }
};

// ==========================================
// VERIFY CASHFREE PAYMENT
// GET /api/order/cashfree/verify/:orderId
// ==========================================

export const verifyCashfreePayment = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const { orderId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Cashfree order ID is required"
            });
        }

        const order = await Order.findOne({
            cashfreeOrderId: orderId,
            userId,
            paymentType: "Online"
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.isPaid) {
            return res.json({
                success: true,
                isPaid: true,
                message: "Payment already verified"
            });
        }

        const response = await cashfree.PGOrderFetchPayments(
            CASHFREE_API_VERSION,
            orderId
        );

        const payments = Array.isArray(response?.data)
            ? response.data
            : [];

        const successfulPayment = payments.find(
            payment => payment.payment_status === "SUCCESS"
        );

        if (successfulPayment) {
            const paidAmount = Number(
                successfulPayment.payment_amount
            );

            if (
                !Number.isFinite(paidAmount) ||
                paidAmount !== Number(order.amount)
            ) {
                console.error("PAYMENT AMOUNT MISMATCH:", {
                    orderId,
                    localAmount: order.amount,
                    cashfreeAmount:
                        successfulPayment.payment_amount
                });

                return res.status(400).json({
                    success: false,
                    isPaid: false,
                    message:
                        "Payment amount mismatch. Contact support."
                });
            }

            order.isPaid = true;
            await order.save();

            await User.findByIdAndUpdate(userId, {
                cartItems: {}
            });

            return res.json({
                success: true,
                isPaid: true,
                message: "Payment successful"
            });
        }

        const hasPendingPayment = payments.some(
            payment => payment.payment_status === "PENDING"
        );

        return res.json({
            success: true,
            isPaid: false,
            paymentStatus: hasPendingPayment
                ? "PENDING"
                : "FAILED",
            message: hasPendingPayment
                ? "Payment is pending. Please check again shortly."
                : "No successful payment was found."
        });

    } catch (error) {
        console.error("CASHFREE VERIFICATION ERROR:", {
            message: error.message,
            status: error.response?.status,
            response: error.response?.data,
            code: error.code,
            requestId: error.response?.headers?.["x-request-id"]
        });

        return res.status(500).json({
            success: false,
            message:
                error.response?.data?.message ||
                "Unable to verify payment"
        });
    }
};

// ==========================================
// CASHFREE WEBHOOK
// POST /api/order/cashfree/webhook
// ==========================================

export const cashfreeWebhook = async (req, res) => {
    try {
        const signature =
            req.headers["x-webhook-signature"];

        const timestamp =
            req.headers["x-webhook-timestamp"];

        if (
            !signature ||
            !timestamp ||
            !Buffer.isBuffer(req.body)
        ) {
            return res.status(400).send(
                "Invalid webhook request"
            );
        }

        const secretKey =
            process.env.CASHFREE_SECRET_KEY?.trim();

        if (!secretKey) {
            return res.status(500).send(
                "Webhook configuration error"
            );
        }

        const rawBody = req.body.toString("utf8");

        const expectedSignature = crypto
            .createHmac("sha256", secretKey)
            .update(timestamp + rawBody)
            .digest("base64");

        const received = Buffer.from(signature, "utf8");
        const expected = Buffer.from(expectedSignature, "utf8");

        if (
            received.length !== expected.length ||
            !crypto.timingSafeEqual(received, expected)
        ) {
            console.error(
                "Invalid Cashfree webhook signature"
            );

            return res.status(401).send(
                "Invalid webhook signature"
            );
        }

        const event = JSON.parse(rawBody);

        if (event.type === "PAYMENT_SUCCESS_WEBHOOK") {
            const cashfreeOrderId =
                event.data?.order?.order_id;

            const payment = event.data?.payment;

            if (
                !cashfreeOrderId ||
                payment?.payment_status !== "SUCCESS"
            ) {
                return res.status(200).json({
                    received: true
                });
            }

            const order = await Order.findOne({
                cashfreeOrderId,
                paymentType: "Online"
            });

            if (order && !order.isPaid) {
                const webhookAmount =
                    Number(payment.payment_amount);

                if (
                    !Number.isFinite(webhookAmount) ||
                    webhookAmount !== Number(order.amount)
                ) {
                    console.error(
                        "Webhook payment amount mismatch:",
                        cashfreeOrderId
                    );

                    return res.status(400).send(
                        "Payment amount mismatch"
                    );
                }

                order.isPaid = true;
                await order.save();

                await User.findByIdAndUpdate(order.userId, {
                    cartItems: {}
                });

                console.log(
                    "Cashfree payment confirmed:",
                    cashfreeOrderId
                );
            }
        }

        return res.status(200).json({
            received: true
        });

    } catch (error) {
        console.error(
            "CASHFREE WEBHOOK ERROR:",
            error.message
        );

        return res.status(500).send(
            "Webhook processing failed"
        );
    }
};

// ==========================================
// GET USER ORDERS
// GET /api/order/user
// ==========================================

export const getUserOrders = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required"
            });
        }

        const orders = await Order.find({
            userId,
            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ]
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.error(
            "GET USER ORDERS ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// GET ALL SELLER ORDERS
// GET /api/order/seller
// ==========================================

export const getAllOrders = async (req, res) => {
    try {
        // Include COD, paid online and unpaid online orders.
        const orders = await Order.find({})
            .populate("items.product address")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.error(
            "GET ALL ORDERS ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// UPDATE SELLER ORDER STATUS
// PATCH /api/order/status
// ==========================================

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body || {};

        if (
            !orderId ||
            !mongoose.Types.ObjectId.isValid(orderId)
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid order ID is required"
            });
        }

        if (!ALLOWED_ORDER_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Prevent fulfilment of unpaid online orders.
        if (
            order.paymentType === "Online" &&
            !order.isPaid &&
            ["Processing", "Shipped", "Delivered"].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Online payment is pending. This order cannot be processed until payment is confirmed."
            });
        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
