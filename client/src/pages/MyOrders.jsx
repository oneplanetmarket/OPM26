
import React, { useCallback, useEffect, useState } from "react";
import {
    Package,
    Truck,
    CalendarDays,
    CreditCard,
    RefreshCw,
    ShoppingBag,
    ArrowRight,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { currency, axios, user } = useAppContext();

    // -----------------------------------------
    // FETCH ORDERS
    // -----------------------------------------

    const fetchMyOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const { data } = await axios.get("/api/order/user");

            if (data.success) {
                setMyOrders(data.orders || []);
            } else {
                setError(data.message || "Unable to fetch orders.");
            }
        } catch (err) {
            console.error("MY ORDERS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Something went wrong while loading your orders."
            );
        } finally {
            setLoading(false);
        }
    }, [axios]);

    useEffect(() => {
        if (user) {
            fetchMyOrders();
        } else {
            setMyOrders([]);
            setLoading(false);
        }
    }, [user, fetchMyOrders]);

    // -----------------------------------------
    // STATUS STYLING
    // -----------------------------------------

    const getStatusStyle = (status = "") => {
        const value = status.toLowerCase();

        if (
            value.includes("delivered") ||
            value.includes("completed")
        ) {
            return {
                className: "bg-green-50 text-green-700",
                icon: CheckCircle2,
            };
        }

        if (
            value.includes("cancelled") ||
            value.includes("failed")
        ) {
            return {
                className: "bg-red-50 text-red-600",
                icon: XCircle,
            };
        }

        if (
            value.includes("shipped") ||
            value.includes("out for delivery")
        ) {
            return {
                className: "bg-blue-50 text-blue-700",
                icon: Truck,
            };
        }

        return {
            className: "bg-amber-50 text-amber-700",
            icon: Clock3,
        };
    };

    // -----------------------------------------
    // FORMAT DATE
    // -----------------------------------------

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // -----------------------------------------
    // LOADING STATE
    // -----------------------------------------

    if (loading) {
        return (
            <main className="relative w-full min-h-[70vh] bg-[#faf8f2] pt-28 md:pt-32 pb-20 px-4">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 rounded-full border-4 border-[#dfe7df] border-t-[#294331] animate-spin" />

                    <p className="mt-5 text-[#294331] font-medium">
                        Loading your orders...
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                        Please wait a moment
                    </p>
                </div>
            </main>
        );
    }

    // -----------------------------------------
    // LOGIN STATE
    // -----------------------------------------

    if (!user) {
        return (
            <main className="relative w-full min-h-[70vh] bg-[#faf8f2] pt-28 md:pt-32 pb-20 px-4">
                <div className="flex items-center justify-center py-16">
                    <div className="text-center max-w-md">

                        <div className="w-20 h-20 rounded-full bg-[#e9eee7] flex items-center justify-center mx-auto">
                            <ShoppingBag
                                size={34}
                                className="text-[#294331]"
                            />
                        </div>

                        <h2 className="text-2xl font-semibold text-[#294331] mt-6">
                            Login to view your orders
                        </h2>

                        <p className="text-gray-500 mt-3">
                            Sign in to view your purchases and track deliveries.
                        </p>

                    </div>
                </div>
            </main>
        );
    }

    // -----------------------------------------
    // ORDER SUMMARY
    // -----------------------------------------

    const totalItems = myOrders.reduce(
        (total, order) =>
            total +
            (order.items || []).reduce(
                (sum, item) => sum + Number(item.quantity || 1),
                0
            ),
        0
    );

    // -----------------------------------------
    // MAIN PAGE
    // -----------------------------------------

    return (
        <main className="relative w-full min-h-screen bg-[#faf8f2] scroll-mt-32">

            {/* EXTRA TOP SPACE FOR FIXED NAVBAR */}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-20">

                {/* PAGE HEADER */}

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-px bg-[#d97732]" />

                            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#d97732]">
                                Your Account
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-semibold text-[#294331] tracking-tight">
                            My Orders
                        </h1>

                        <p className="text-gray-500 mt-3 text-sm md:text-base">
                            Your purchases, all in one place.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchMyOrders}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#dce3d9] text-[#294331] hover:bg-[#e9eee7] transition-all duration-300 text-sm font-medium"
                    >
                        <RefreshCw size={16} />
                        Refresh Orders
                    </button>

                </div>

                {/* SUMMARY CARDS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

                    <div className="bg-white border border-[#e9e7de] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-[#e9eee7] flex items-center justify-center">
                            <Package
                                size={23}
                                className="text-[#294331]"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Orders
                            </p>

                            <h3 className="text-2xl font-semibold text-[#294331]">
                                {myOrders.length}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white border border-[#e9e7de] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-[#fff1e5] flex items-center justify-center">
                            <ShoppingBag
                                size={23}
                                className="text-[#d97732]"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Items Purchased
                            </p>

                            <h3 className="text-2xl font-semibold text-[#294331]">
                                {totalItems}
                            </h3>
                        </div>
                    </div>

                </div>

                {/* ERROR MESSAGE */}

                {error && (
                    <div className="mb-7 p-5 rounded-xl bg-red-50 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={fetchMyOrders}
                            className="text-sm font-semibold text-red-700 underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* EMPTY STATE */}

                {myOrders.length === 0 && !error && (
                    <div className="bg-white border border-[#e9e7de] rounded-2xl py-16 px-5 text-center shadow-sm">

                        <div className="w-20 h-20 mx-auto rounded-full bg-[#e9eee7] flex items-center justify-center">
                            <Package
                                size={36}
                                className="text-[#294331]"
                            />
                        </div>

                        <p className="text-xs uppercase tracking-[0.25em] text-[#d97732] font-semibold mt-7">
                            Your Shopping Journey
                        </p>

                        <h2 className="text-2xl md:text-3xl font-semibold text-[#294331] mt-3">
                            No orders yet
                        </h2>

                        <p className="text-gray-500 mt-3 max-w-md mx-auto leading-7">
                            Your next favourite find is waiting for you.
                            Explore our collection and discover something special.
                        </p>

                        <a
                            href="/"
                            className="inline-flex items-center gap-3 mt-8 px-8 py-4 bg-[#294331] text-white rounded-full font-medium hover:bg-[#1d3023] transition-all duration-300"
                        >
                            Explore Collection
                            <ArrowRight size={18} />
                        </a>

                    </div>
                )}

                {/* ORDER CARDS */}

                <div className="space-y-7">

                    {myOrders.map((order) => {
                        const statusStyle = getStatusStyle(order.status);
                        const StatusIcon = statusStyle.icon;

                        return (
                            <section
                                key={order._id}
                                className="bg-white border border-[#e8e6dd] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                            >

                                {/* ORDER HEADER */}

                                <div className="px-5 md:px-7 py-6 bg-[#f5f5ee] border-b border-[#e8e6dd]">

                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">

                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                                                    Order ID
                                                </p>

                                                <p className="text-sm font-semibold text-[#294331] mt-2 break-all">
                                                    #{order._id?.slice(-10).toUpperCase()}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                                                    Order Date
                                                </p>

                                                <p className="text-sm text-gray-700 mt-2 flex items-center gap-1.5">
                                                    <CalendarDays size={14} />
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                                                    Payment
                                                </p>

                                                <p className="text-sm text-gray-700 mt-2 flex items-center gap-1.5">
                                                    <CreditCard size={14} />
                                                    {order.paymentType || "N/A"}
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4">

                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                                                    Order Total
                                                </p>

                                                <p className="text-xl font-semibold text-[#294331] mt-1">
                                                    {currency}{Number(order.amount || 0).toLocaleString("en-IN")}
                                                </p>
                                            </div>

                                            <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold ${statusStyle.className}`}>
                                                <StatusIcon size={15} />
                                                {order.status || "Pending"}
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                {/* ORDER PRODUCTS */}

                                <div className="p-5 md:p-7">

                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#294331]">
                                            Order Items
                                        </h3>

                                        <span className="text-xs text-gray-400">
                                            {order.items?.length || 0} Products
                                        </span>
                                    </div>

                                    <div className="space-y-6">

                                        {(order.items || []).map((item, index) => {
                                            const product = item.product;

                                            if (!product) {
                                                return (
                                                    <div
                                                        key={item._id || index}
                                                        className="text-sm text-gray-500 py-3"
                                                    >
                                                        Product information is unavailable.
                                                    </div>
                                                );
                                            }

                                            const quantity = Number(item.quantity || 1);

                                            const price = Number(
                                                product.offerPrice ?? product.price ?? 0
                                            );

                                            return (
                                                <div
                                                    key={item._id || index}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 last:pb-0 border-b last:border-0 border-[#eeece5]"
                                                >

                                                    {/* PRODUCT */}

                                                    <div className="flex items-center gap-4 min-w-0">

                                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-[#f5f5ee] flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={product.image?.[0] || "/placeholder.png"}
                                                                alt={product.name || "Product"}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src = "/placeholder.png";
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h4 className="text-base md:text-lg font-semibold text-[#294331]">
                                                                {product.name || "Product"}
                                                            </h4>

                                                            <p className="text-sm text-gray-400 mt-1">
                                                                {product.category || "General"}
                                                            </p>

                                                            <p className="text-sm text-gray-500 mt-2">
                                                                Quantity:{" "}
                                                                <span className="font-semibold text-[#294331]">
                                                                    {quantity}
                                                                </span>
                                                            </p>
                                                        </div>

                                                    </div>

                                                    {/* PRICE */}

                                                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">

                                                        <p className="text-xs text-gray-400">
                                                            {currency}{price.toLocaleString("en-IN")} × {quantity}
                                                        </p>

                                                        <p className="text-lg font-semibold text-[#294331]">
                                                            {currency}{(price * quantity).toLocaleString("en-IN")}
                                                        </p>

                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>

                                    {/* ORDER FOOTER */}

                                    <div className="mt-7 pt-6 border-t border-[#eeece5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Truck
                                                size={18}
                                                className="text-[#294331]"
                                            />

                                            <span>
                                                Thank you for shopping with One Planet Market.
                                            </span>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="text-xs uppercase tracking-wider text-gray-400">
                                                Total Amount
                                            </p>

                                            <p className="text-xl font-bold text-[#294331] mt-1">
                                                {currency}{Number(order.amount || 0).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </section>
                        );
                    })}

                </div>

                {/* BRAND FOOTER */}

                <div className="mt-16 text-center">
                    <div className="w-12 h-px bg-[#d97732] mx-auto mb-5" />

                    <p className="text-xs uppercase tracking-[0.25em] text-[#294331] font-semibold">
                        One Planet Market
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                        Thoughtfully sourced. Naturally yours.
                    </p>
                </div>

            </div>
        </main>
    );
};

export default MyOrders;
