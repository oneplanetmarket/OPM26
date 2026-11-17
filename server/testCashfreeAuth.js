
import cashfree from "./configs/cashfree.js";

async function testCashfreeAuth() {
  try {
    // This is deliberately a non-existent order ID.
    // It tests whether Cashfree accepts the credentials.
    await cashfree.PGFetchOrder(
      "2022-09-01",
      "opm_auth_test_123456"
    );

    console.log("Cashfree authentication successful.");
  } catch (error) {
    console.log("HTTP STATUS:", error.response?.status);
    console.log("CASHFREE RESPONSE:", error.response?.data);
    console.log("ERROR MESSAGE:", error.message);

    if (error.response?.status === 404) {
      console.log(
        "Authentication appears successful; test order was not found."
      );
    } else if (error.response?.status === 401) {
      console.log(
        "Cashfree rejected the credentials. Check the Production key pair."
      );
    }
  }
}

testCashfreeAuth();
