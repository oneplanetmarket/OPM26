
import "dotenv/config";
import { Cashfree } from "cashfree-pg";

const appId = process.env.CASHFREE_APP_ID?.trim();
const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();
const environment = process.env.CASHFREE_ENV?.trim().toUpperCase();

console.log("========== CASHFREE DIAGNOSTICS ==========");

console.log("Environment:", environment);
console.log("App ID exists:", Boolean(appId));
console.log("Secret exists:", Boolean(secretKey));
console.log("App ID length:", appId?.length);
console.log("Secret length:", secretKey?.length);

console.log(
    "App ID format:",
    appId ? /^[A-Za-z0-9]+$/.test(appId) : false
);

console.log(
    "Secret has surrounding whitespace:",
    secretKey !== process.env.CASHFREE_SECRET_KEY
);

if (environment !== "PRODUCTION") {
    throw new Error("Backend is not configured for Production");
}

if (!appId || !secretKey) {
    throw new Error("Cashfree credentials missing");
}

const cashfree = new Cashfree(
    Cashfree.PRODUCTION,
    appId,
    secretKey
);

console.log("Production SDK initialized successfully");

try {
    const response = await cashfree.PGFetchOrder(
        "replace_with_an_existing_production_order_id"
    );

    console.log("Cashfree API authentication successful");
    console.log("Response:", response.data);

} catch (error) {
    console.log("Cashfree API diagnostic:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        code: error.response?.data?.code
    });
}
