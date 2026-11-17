
import { load } from "@cashfreepayments/cashfree-js";

let cashfreeInstance = null;

export const getCashfree = async () => {
    if (!cashfreeInstance) {
        cashfreeInstance = await load({
            mode: "production"
        });
    }

    if (!cashfreeInstance) {
        throw new Error("Unable to load Cashfree Production SDK");
    }

    return cashfreeInstance;
};

export const openCashfreeCheckout = async (paymentSessionId) => {
    if (!paymentSessionId) {
        throw new Error("Payment session ID is missing");
    }

    const cashfree = await getCashfree();

    return cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self"
    });
};
