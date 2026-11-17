
import { useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
    const {
        products,
        currency,
        cartItems,
        removeFromCart,
        getCartCount,
        updateCartItem,
        navigate,
        getCartAmount,
        axios,
        user,
        setCartItems,
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    // -----------------------------------------
    // PREPARE CART ITEMS
    // -----------------------------------------

    useEffect(() => {
        if (!cartItems || !products.length) {
            setCartArray([]);
            return;
        }

        const updatedCart = [];

        Object.entries(cartItems).forEach(([id, quantity]) => {
            const product = products.find((item) => item._id === id);

            if (product && Number(quantity) > 0) {
                updatedCart.push({
                    ...product,
                    quantity: Number(quantity),
                });
            }
        });

        setCartArray(updatedCart);
    }, [products, cartItems]);

    // -----------------------------------------
    // LOAD SAVED ADDRESSES
    // -----------------------------------------

    const getUserAddress = async () => {
        try {
            setIsLoadingAddress(true);

            const { data } = await axios.get("/api/address/get", {
                withCredentials: true,
            });

            if (!data.success) {
                throw new Error(data.message || "Unable to load addresses");
            }

            const addressList = data.addresses || [];

            setAddresses(addressList);

            setSelectedAddress((current) => {
                if (
                    current &&
                    addressList.some((item) => item._id === current._id)
                ) {
                    return current;
                }

                return addressList[0] || null;
            });
        } catch (error) {
            console.error("ADDRESS ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Unable to load addresses"
            );
        } finally {
            setIsLoadingAddress(false);
        }
    };

    useEffect(() => {
        if (user) {
            getUserAddress();
        } else {
            setAddresses([]);
            setSelectedAddress(null);
        }
    }, [user]);

    // -----------------------------------------
    // NAVIGATION
    // -----------------------------------------

    const handleAddAddress = () => {
        setShowAddress(false);
        navigate("/add-address");
    };

    const openProduct = (product) => {
        navigate(
            `/products/${String(product.category || "").toLowerCase()}/${product._id}`
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // -----------------------------------------
    // CASHFREE PAYMENT
    // -----------------------------------------

    const handleCashfreePayment = async (orderItems) => {
        try {
            const { data } = await axios.post(
                "/api/order/cashfree/create",
                {
                    items: orderItems,
                    address: selectedAddress._id,
                },
                {
                    withCredentials: true,
                }
            );

            if (!data.success || !data.payment_session_id) {
                throw new Error(
                    data.message || "Unable to create payment session"
                );
            }

            const cashfreeMode = (
                import.meta.env.VITE_CASHFREE_ENV || "sandbox"
            )
                .trim()
                .toLowerCase();

            if (!["sandbox", "production"].includes(cashfreeMode)) {
                throw new Error(
                    "VITE_CASHFREE_ENV must be sandbox or production"
                );
            }

            const cashfree = await load({
                mode: cashfreeMode,
            });

            if (!cashfree) {
                throw new Error("Cashfree checkout could not be initialized");
            }

            await cashfree.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_self",
            });

            setIsPlacingOrder(false);
        } catch (error) {
            console.error("CASHFREE PAYMENT ERROR:", {
                message: error.message,
                status: error.response?.status,
                response: error.response?.data,
            });

            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Unable to start payment"
            );

            setIsPlacingOrder(false);
        }
    };

    // -----------------------------------------
    // PLACE ORDER
    // -----------------------------------------

    const placeOrder = async () => {
        if (isPlacingOrder) return;

        if (!user) {
            toast.error("Please login before placing your order");
            return;
        }

        if (!cartArray.length) {
            toast.error("Your cart is empty");
            return;
        }

        if (!selectedAddress?._id) {
            toast.error("Please select a delivery address");
            setShowAddress(true);
            return;
        }

        try {
            setIsPlacingOrder(true);

            const orderItems = cartArray.map((item) => ({
                product: item._id,
                quantity: Number(item.quantity),
            }));

            if (paymentOption === "COD") {
                const { data } = await axios.post(
                    "/api/order/cod",
                    {
                        items: orderItems,
                        address: selectedAddress._id,
                    },
                    {
                        withCredentials: true,
                    }
                );

                if (!data.success) {
                    throw new Error(
                        data.message || "Unable to place order"
                    );
                }

                toast.success(data.message || "Order placed successfully");

                setCartItems({});
                navigate("/my-orders");
                return;
            }

            await handleCashfreePayment(orderItems);
        } catch (error) {
            console.error("PLACE ORDER ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Unable to place your order"
            );

            setIsPlacingOrder(false);
        } finally {
            if (paymentOption === "COD") {
                setIsPlacingOrder(false);
            }
        }
    };

    // -----------------------------------------
    // PRICE CALCULATIONS
    // -----------------------------------------

    const subtotal = Number(getCartAmount()) || 0;
    const tax = Math.floor(subtotal * 0.02);
    const totalAmount = subtotal + tax;

    // -----------------------------------------
    // EMPTY CART
    // -----------------------------------------

    if (!products.length || !cartItems || cartArray.length === 0) {
        return (
            <div className="min-h-[75vh] bg-[#faf8f2] px-4 pt-32 pb-16 sm:pt-36">
                <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-[#e9e2d4] bg-white px-6 py-14 text-center shadow-sm sm:px-12">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#fff2df]">
                        <img
                            src={assets.cart_icon}
                            alt="Shopping cart"
                            className="h-12 w-12 object-contain opacity-75"
                        />
                    </div>

                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#b96b27]">
                        Your shopping bag
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight text-[#263b2d] sm:text-4xl">
                        Your cart is waiting
                    </h2>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-[#77766c]">
                        Discover something naturally wonderful. Explore our
                        collection and find your favourites.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="mt-8 rounded-full bg-[#294331] px-9 py-3.5 text-sm font-semibold tracking-wide text-white shadow-md transition hover:bg-[#1d3425] hover:shadow-lg"
                    >
                        Explore Collection
                    </button>
                </div>
            </div>
        );
    }

    // -----------------------------------------
    // MAIN CART PAGE
    // -----------------------------------------

    return (
        <main className="min-h-screen bg-[#faf8f2] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* PAGE INTRODUCTION */}

                <div className="mb-8 border-b border-[#e8e1d5] pb-7 sm:mb-10 sm:pb-9">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#d97732]" />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a56b39]">
                            A naturally better choice
                        </p>
                    </div>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-[#263b2d] sm:text-4xl lg:text-5xl">
                                Your Shopping Bag
                            </h1>

                            <p className="mt-3 max-w-lg text-sm leading-6 text-[#77766c] sm:text-base">
                                Your selected favourites, carefully brought
                                together in one place.
                            </p>
                        </div>

                        <div className="flex w-fit items-center gap-3 rounded-full border border-[#e9dfce] bg-white px-4 py-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0dc] text-sm text-[#bd702c]">
                                {getCartCount()}
                            </span>

                            <span className="text-xs font-medium text-[#536052]">
                                {getCartCount() === 1 ? "Item" : "Items"} in
                                your bag
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-10">

                    {/* LEFT: CART PRODUCTS */}

                    <section className="min-w-0">

                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#263b2d]">
                                Selected Products
                            </h2>

                            <span className="text-xs text-[#8a897e]">
                                {cartArray.length}{" "}
                                {cartArray.length === 1 ? "product" : "products"}
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[#e9e2d5] bg-white shadow-[0_5px_25px_rgba(56,49,32,0.035)]">

                            {/* TABLE HEADING */}

                            <div className="hidden grid-cols-[minmax(0,1fr)_110px_90px] items-center border-b border-[#eee9df] bg-[#fdfcf8] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#929084] sm:grid">
                                <span>Product details</span>
                                <span className="text-center">Amount</span>
                                <span className="text-center">Remove</span>
                            </div>

                            {/* PRODUCT ROWS */}

                            <div className="divide-y divide-[#eee9df]">
                                {cartArray.map((product) => (
                                    <article
                                        key={product._id}
                                        className="p-4 transition hover:bg-[#fdfcf9] sm:p-6"
                                    >
                                        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(0,1fr)_110px_90px]">

                                            {/* PRODUCT INFORMATION */}

                                            <div className="flex min-w-0 items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openProduct(product)
                                                    }
                                                    className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#eee7da] bg-[#f8f5ee] sm:h-28 sm:w-28"
                                                >
                                                    <img
                                                        src={product.image?.[0]}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition duration-500 hover:scale-110"
                                                    />
                                                </button>

                                                <div className="min-w-0 flex-1">
                                                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#bd702c]">
                                                        {product.category ||
                                                            "Selected product"}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openProduct(product)
                                                        }
                                                        className="line-clamp-2 text-left text-sm font-semibold leading-6 text-[#263b2d] transition hover:text-[#b76c2c] sm:text-base"
                                                    >
                                                        {product.name}
                                                    </button>

                                                    <p className="mt-1 text-xs text-[#89877c]">
                                                        Weight:{" "}
                                                        {product.weight || "N/A"}
                                                    </p>

                                                    <div className="mt-3 flex items-center gap-3">
                                                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#888579]">
                                                            Quantity
                                                        </span>

                                                        <select
                                                            aria-label={`Quantity for ${product.name}`}
                                                            value={
                                                                cartItems[
                                                                    product._id
                                                                ] || 1
                                                            }
                                                            onChange={(e) =>
                                                                updateCartItem(
                                                                    product._id,
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            className="rounded-lg border border-[#e5dece] bg-[#faf8f2] px-3 py-1.5 text-xs font-semibold text-[#354b38] outline-none transition focus:border-[#b96b2c]"
                                                        >
                                                            {Array.from(
                                                                { length: 20 },
                                                                (_, index) =>
                                                                    index + 1
                                                            ).map((quantity) => (
                                                                <option
                                                                    key={
                                                                        quantity
                                                                    }
                                                                    value={
                                                                        quantity
                                                                    }
                                                                >
                                                                    {quantity}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* PRODUCT PRICE */}

                                            <div className="flex items-center justify-between border-t border-dashed border-[#eee9df] pt-3 sm:block sm:border-0 sm:pt-0 sm:text-center">
                                                <span className="text-xs text-[#89877c] sm:hidden">
                                                    Item subtotal
                                                </span>

                                                <p className="text-sm font-semibold text-[#263b2d] sm:text-base">
                                                    {currency}
                                                    {(
                                                        Number(
                                                            product.offerPrice
                                                        ) * product.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* REMOVE PRODUCT */}

                                            <div className="absolute hidden sm:static sm:flex sm:justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        removeFromCart(
                                                            product._id
                                                        );
                                                        toast.success(
                                                            "Product removed from cart"
                                                        );
                                                    }}
                                                    aria-label={`Remove ${product.name}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f0e5dc] bg-white transition hover:border-red-200 hover:bg-red-50"
                                                >
                                                    <img
                                                        src={assets.remove_icon}
                                                        alt=""
                                                        className="h-4 w-4 opacity-70"
                                                    />
                                                </button>
                                            </div>

                                            {/* MOBILE REMOVE BUTTON */}

                                            <div className="flex justify-end sm:hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        removeFromCart(
                                                            product._id
                                                        );
                                                        toast.success(
                                                            "Product removed from cart"
                                                        );
                                                    }}
                                                    className="text-xs font-medium text-[#a35c3c] underline underline-offset-4"
                                                >
                                                    Remove item
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>

                        {/* CONTINUE SHOPPING */}

                        <button
                            type="button"
                            onClick={() => {
                                navigate("/products");
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });
                            }}
                            className="group mt-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#536b53] transition hover:text-[#b96b2c]"
                        >
                            <span className="transition group-hover:-translate-x-1">
                                ←
                            </span>
                            Continue Shopping
                        </button>

                        {/* TRUST MESSAGE */}

                        <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-[#e9e2d5] bg-white p-4">
                                <p className="text-xs font-semibold text-[#354b38]">
                                    Carefully selected
                                </p>
                                <p className="mt-1 text-[11px] leading-5 text-[#888579]">
                                    Quality-focused products for your everyday
                                    needs.
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#e9e2d5] bg-white p-4">
                                <p className="text-xs font-semibold text-[#354b38]">
                                    Secure checkout
                                </p>
                                <p className="mt-1 text-[11px] leading-5 text-[#888579]">
                                    Payments are securely processed.
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#e9e2d5] bg-white p-4">
                                <p className="text-xs font-semibold text-[#354b38]">
                                    Order assistance
                                </p>
                                <p className="mt-1 text-[11px] leading-5 text-[#888579]">
                                    Your order details stay accessible in your
                                    account.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT: ORDER SUMMARY */}

                    <aside className="w-full min-w-0 lg:sticky lg:top-28">

                        <div className="overflow-visible rounded-2xl border border-[#e5ddce] bg-white shadow-[0_10px_35px_rgba(56,49,32,0.06)]">

                            {/* SUMMARY HEADER */}

                            <div className="rounded-t-2xl bg-[#294331] px-6 py-6 text-white">
                                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#e8bd83]">
                                    Almost yours
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                                    Order Summary
                                </h2>

                                <p className="mt-1 text-xs text-[#d0d8ce]">
                                    Review your order before checkout.
                                </p>
                            </div>

                            <div className="p-5 sm:p-6">

                                {/* DELIVERY ADDRESS */}

                                <div className="relative z-30">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#8a897e]">
                                                Delivering to
                                            </p>
                                            <h3 className="mt-1 text-sm font-semibold text-[#263b2d]">
                                                Delivery Address
                                            </h3>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowAddress((previous) =>
                                                    !previous
                                                )
                                            }
                                            className="text-xs font-semibold text-[#b76c2c] transition hover:text-[#85471e]"
                                        >
                                            {showAddress ? "Close" : "Change"}
                                        </button>
                                    </div>

                                    <div className="mt-3 rounded-xl border border-[#e9e2d5] bg-[#faf8f2] p-4">
                                        {isLoadingAddress ? (
                                            <p className="text-xs text-[#888579]">
                                                Loading saved addresses...
                                            </p>
                                        ) : selectedAddress ? (
                                            <>
                                                <p className="text-sm font-semibold text-[#354b38]">
                                                    {selectedAddress.firstName ||
                                                        ""}{" "}
                                                    {selectedAddress.lastName ||
                                                        ""}
                                                </p>

                                                <p className="mt-1 text-xs leading-6 text-[#77766c]">
                                                    {selectedAddress.street},{" "}
                                                    {selectedAddress.city},{" "}
                                                    {selectedAddress.state},{" "}
                                                    {selectedAddress.country}
                                                </p>

                                                {selectedAddress.phone && (
                                                    <p className="mt-2 text-xs text-[#77766c]">
                                                        Phone:{" "}
                                                        {selectedAddress.phone}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-xs text-[#888579]">
                                                No delivery address selected.
                                            </p>
                                        )}
                                    </div>

                                    {/* ADDRESS SELECTOR */}

                                    {showAddress && (
                                        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-[#e9e2d5] bg-white shadow-xl">
                                            {addresses.length > 0 ? (
                                                addresses.map((address) => (
                                                    <button
                                                        type="button"
                                                        key={address._id}
                                                        onClick={() => {
                                                            setSelectedAddress(
                                                                address
                                                            );
                                                            setShowAddress(
                                                                false
                                                            );
                                                        }}
                                                        className={`w-full border-b border-[#f0ede5] p-4 text-left transition hover:bg-[#faf8f2] ${
                                                            selectedAddress?._id ===
                                                            address._id
                                                                ? "bg-[#f7f4eb]"
                                                                : ""
                                                        }`}
                                                    >
                                                        <p className="text-sm font-semibold text-[#354b38]">
                                                            {address.firstName}{" "}
                                                            {address.lastName}
                                                        </p>

                                                        <p className="mt-1 text-xs leading-5 text-[#888579]">
                                                            {address.street},{" "}
                                                            {address.city},{" "}
                                                            {address.state},{" "}
                                                            {address.country}
                                                        </p>
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="p-4 text-xs text-[#888579]">
                                                    No saved addresses found.
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleAddAddress}
                                                className="w-full p-4 text-xs font-semibold text-[#b76c2c] transition hover:bg-[#faf8f2]"
                                            >
                                                + Add New Address
                                            </button>
                                        </div>
                                    )}

                                    {!selectedAddress && !showAddress && (
                                        <button
                                            type="button"
                                            onClick={handleAddAddress}
                                            className="mt-3 w-full rounded-lg border border-[#c78b51] py-3 text-xs font-semibold text-[#a35c2b] transition hover:bg-[#fff8ed]"
                                        >
                                            + Add Delivery Address
                                        </button>
                                    )}
                                </div>

                                <div className="my-6 border-t border-dashed border-[#e7e0d4]" />

                                {/* PAYMENT METHOD */}

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#8a897e]">
                                        Payment
                                    </p>

                                    <h3 className="mb-3 mt-1 text-sm font-semibold text-[#263b2d]">
                                        Choose Payment Method
                                    </h3>

                                    <div className="space-y-3">

                                        <label
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                                                paymentOption === "COD"
                                                    ? "border-[#a9b99e] bg-[#f4f7f0]"
                                                    : "border-[#e9e2d5] hover:border-[#c8c0b0]"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="COD"
                                                checked={
                                                    paymentOption === "COD"
                                                }
                                                onChange={() =>
                                                    setPaymentOption("COD")
                                                }
                                                className="h-4 w-4 accent-[#38563d]"
                                            />

                                            <span className="flex-1">
                                                <span className="block text-xs font-semibold text-[#354b38]">
                                                    Cash on Delivery
                                                </span>
                                                <span className="mt-1 block text-[10px] text-[#888579]">
                                                    Pay when your order arrives
                                                </span>
                                            </span>
                                        </label>

                                        <label
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                                                paymentOption === "Online"
                                                    ? "border-[#a9b99e] bg-[#f4f7f0]"
                                                    : "border-[#e9e2d5] hover:border-[#c8c0b0]"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Online"
                                                checked={
                                                    paymentOption === "Online"
                                                }
                                                onChange={() =>
                                                    setPaymentOption("Online")
                                                }
                                                className="h-4 w-4 accent-[#38563d]"
                                            />

                                            <span className="flex-1">
                                                <span className="block text-xs font-semibold text-[#354b38]">
                                                    Online Payment
                                                </span>
                                                <span className="mt-1 block text-[10px] text-[#888579]">
                                                    Secure checkout with
                                                    Cashfree
                                                </span>
                                            </span>

                                            <span className="rounded-md bg-[#e9f0e6] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#46634a]">
                                                Secure
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="my-6 border-t border-dashed border-[#e7e0d4]" />

                                {/* PRICE BREAKDOWN */}

                                <div>
                                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#8a897e]">
                                        Price Details
                                    </p>

                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between text-[#77766c]">
                                            <span>Subtotal</span>
                                            <span className="font-medium text-[#354b38]">
                                                {currency}
                                                {subtotal.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-[#77766c]">
                                            <span>Shipping Fee</span>
                                            <span className="font-semibold text-[#56804e]">
                                                Free
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-[#77766c]">
                                            <span>Tax (2%)</span>
                                            <span className="font-medium text-[#354b38]">
                                                {currency}
                                                {tax.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="my-5 border-t border-[#e9e2d5]" />

                                    <div className="flex items-end justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a897e]">
                                                Total payable
                                            </p>
                                            <p className="mt-1 text-[10px] text-[#99968a]">
                                                Inclusive of displayed tax
                                            </p>
                                        </div>

                                        <p className="text-2xl font-bold tracking-tight text-[#294331]">
                                            {currency}
                                            {totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* CHECKOUT BUTTON */}

                                <button
                                    type="button"
                                    onClick={placeOrder}
                                    disabled={
                                        isPlacingOrder ||
                                        cartArray.length === 0 ||
                                        !selectedAddress?._id
                                    }
                                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#294331] px-5 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-white shadow-[0_5px_15px_rgba(41,67,49,0.17)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1e3525] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    {isPlacingOrder
                                        ? "Processing..."
                                        : paymentOption === "COD"
                                          ? "Place My Order"
                                          : "Pay Securely Now"}

                                    {!isPlacingOrder && <span>→</span>}
                                </button>

                                {/* SECURITY NOTE */}

                                <div className="mt-4 flex items-center justify-center gap-2 text-center">
                                    <span className="text-[11px] text-[#65805f]">
                                        ✓
                                    </span>
                                    <p className="text-[10px] leading-5 text-[#929084]">
                                        Secure order processing
                                        {paymentOption === "Online"
                                            ? " powered by Cashfree"
                                            : ""}
                                    </p>
                                </div>

                                <p className="mt-3 text-center text-[9px] leading-5 text-[#aaa699]">
                                    By placing your order, you agree to our
                                    applicable store policies.
                                </p>
                            </div>
                        </div>

                        {/* BRAND NOTE */}

                        <div className="mt-4 rounded-xl border border-[#e9e2d5] bg-[#f3f0e7] p-4 text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b663e]">
                                Naturally thoughtful
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#77766c]">
                                Thank you for choosing our collection.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default Cart;
