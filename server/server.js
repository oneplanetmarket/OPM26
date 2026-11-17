
import "dotenv/config";

import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

// Routes
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import productRouter from "./routes/productRoute.js";
import producerRouter from "./routes/producerRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import newsletterRouter from "./routes/newsletterRoute.js";

// Cashfree webhook
import { cashfreeWebhook } from "./controllers/orderController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// -----------------------------------------
// CORS CONFIGURATION
// -----------------------------------------

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://localhost:5000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5000",
    "https://oneplanetmarket.com",
    "https://www.oneplanetmarket.com",
    "http://oneplanetmarket.com",
    "http://www.oneplanetmarket.com",
]);

if (process.env.FRONTEND_URL) {
    allowedOrigins.add(
        process.env.FRONTEND_URL.trim().replace(/\/+$/, "")
    );
}

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.has(origin)) {
                return callback(null, true);
            }

            console.error("Blocked CORS origin:", origin);

            return callback(
                new Error("Origin not allowed by CORS")
            );
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

// -----------------------------------------
// CASHFREE WEBHOOK
// Must be before express.json()
// -----------------------------------------

app.post(
    "/api/order/cashfree/webhook",
    express.raw({ type: "application/json" }),
    cashfreeWebhook
);

// -----------------------------------------
// GENERAL MIDDLEWARE
// -----------------------------------------

app.use(express.json({ limit: "10mb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

app.use(cookieParser());

// -----------------------------------------
// FRONTEND STATIC FILES
// -----------------------------------------

const frontendPath = path.resolve(
    __dirname,
    "../client/dist"
);

app.use(express.static(frontendPath));

// -----------------------------------------
// API ROUTES
// -----------------------------------------

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/producer", producerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/newsletter", newsletterRouter);

// -----------------------------------------
// HEALTH CHECK
// -----------------------------------------

app.get("/api/health", (req, res) => {
    return res.status(200).json({
        success: true,
        status: "OK",
        message: "One Planet Market API is working",
        environment: process.env.NODE_ENV || "development",
    });
});

// -----------------------------------------
// API NOT FOUND
// -----------------------------------------

app.use("/api", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "API endpoint not found",
    });
});

// -----------------------------------------
// FRONTEND FALLBACK
// -----------------------------------------

app.get(/.*/, (req, res) => {
    res.sendFile(
        path.join(frontendPath, "index.html"),
        (error) => {
            if (error) {
                console.error(
                    "Frontend file error:",
                    error.message
                );

                if (!res.headersSent) {
                    res.status(500).send(
                        "Frontend build not found. Please build the client."
                    );
                }
            }
        }
    );
});

// -----------------------------------------
// GLOBAL ERROR HANDLER
// -----------------------------------------

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    if (res.headersSent) {
        return next(err);
    }

    if (err.message === "Origin not allowed by CORS") {
        return res.status(403).json({
            success: false,
            message: "Origin not allowed.",
        });
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (err.message?.includes("Only ")) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

// -----------------------------------------
// START SERVER
// -----------------------------------------

const startServer = async () => {
    try {
        await connectDB();
        await connectCloudinary();

        const server = app.listen(PORT, "0.0.0.0", () => {
            console.log("--------------------------------");
            console.log("ONE PLANET MARKET BACKEND");
            console.log("--------------------------------");
            console.log(`Server port: ${PORT}`);
            console.log(`Local: http://localhost:${PORT}`);
            console.log(`Health: http://localhost:${PORT}/api/health`);
            console.log("Database: Connected");
            console.log("Cloudinary: Configured");
            console.log("--------------------------------");
        });

        server.on("error", (error) => {
            console.error(
                "SERVER START ERROR:",
                error.message
            );

            process.exit(1);
        });

        const shutdown = (signal) => {
            console.log(
                `${signal} received. Closing server...`
            );

            server.close(() => {
                console.log("Server closed successfully.");
                process.exit(0);
            });

            setTimeout(() => {
                console.error("Forced shutdown.");
                process.exit(1);
            }, 10000).unref();
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));

    } catch (error) {
        console.error("BACKEND STARTUP FAILED:", error);
        process.exit(1);
    }
};

startServer();
