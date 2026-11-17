
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Cashfree } from "cashfree-pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the environment file from the server folder.
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({
    path: envPath,
    override: true
});

const appId = process.env.CASHFREE_APP_ID?.trim();
const secretKey = process.env.CASHFREE_SECRET_KEY?.trim();

const environment = process.env.CASHFREE_ENV
    ?.trim()
    .toUpperCase();

if (!appId || !secretKey) {
    throw new Error(
        "Cashfree credentials missing. Check server/.env"
    );
}

if (!["SANDBOX", "PRODUCTION"].includes(environment)) {
    throw new Error(
        "CASHFREE_ENV must be SANDBOX or PRODUCTION in server/.env"
    );
}

const cashfreeEnvironment =
    environment === "PRODUCTION"
        ? Cashfree.PRODUCTION
        : Cashfree.SANDBOX;

const cashfree = new Cashfree(
    cashfreeEnvironment,
    appId,
    secretKey
);

console.log("Cashfree SDK initialized successfully.");
console.log("Cashfree environment:", environment);

export default cashfree;
