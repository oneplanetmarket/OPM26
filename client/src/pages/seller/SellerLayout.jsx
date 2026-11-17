
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    PackagePlus,
    Package,
    ShoppingBag,
    LogOut,
    Leaf,
    ChevronRight,
} from "lucide-react";

import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
    const { axios, navigate } = useAppContext();

    // -----------------------------------------
    // SIDEBAR NAVIGATION
    // -----------------------------------------

    const sidebarLinks = [
        {
            name: "Add Product",
            path: "/seller",
            icon: PackagePlus,
            end: true,
        },
        {
            name: "Product List",
            path: "/seller/product-list",
            icon: Package,
        },
        {
            name: "Orders",
            path: "/seller/orders",
            icon: ShoppingBag,
        },
    ];

    // -----------------------------------------
    // LOGOUT
    // -----------------------------------------

    const logout = async () => {
        try {
            const { data } = await axios.get("/api/seller/logout");

            if (data.success) {
                toast.success(data.message || "Logged out successfully");
                navigate("/");
            } else {
                toast.error(data.message || "Unable to logout");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    // -----------------------------------------
    // LAYOUT
    // -----------------------------------------

    return (
        <div className="min-h-screen bg-[#faf8f2] text-[#294331]">

            {/* =====================================
                PREMIUM SELLER HEADER
            ===================================== */}

            <header className="sticky top-0 z-40 w-full bg-[#fffefa] border-b border-[#e9e5d9]">

                <div className="h-[76px] px-4 sm:px-6 lg:px-10 flex items-center justify-between">

                    {/* LOGO */}

                    <NavLink
                        to="/"
                        className="flex items-center gap-3 min-w-0"
                    >
                        <img
                            src={assets.logo1}
                            alt="One Planet Market"
                            className="w-36 sm:w-44 md:w-48 h-auto max-h-12 object-contain object-left"
                        />
                    </NavLink>

                    {/* RIGHT HEADER */}

                    <div className="flex items-center gap-3 sm:gap-6">

                        <div className="hidden sm:flex items-center gap-2 text-sm text-[#718071]">
                            <span className="w-2 h-2 rounded-full bg-[#6b9b57]" />
                            Seller Dashboard
                        </div>

                        <div className="hidden sm:block h-8 w-px bg-[#e8e4d9]" />

                        <div className="flex items-center gap-2 sm:gap-3">

                            <div className="w-9 h-9 rounded-full bg-[#e9eee7] flex items-center justify-center">
                                <Leaf
                                    size={17}
                                    className="text-[#294331]"
                                />
                            </div>

                            <div className="hidden sm:block">
                                <p className="text-xs text-[#899187]">
                                    Welcome back
                                </p>

                                <p className="text-sm font-semibold text-[#294331]">
                                    Admin
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full border border-[#e6e2d8] text-[#294331] text-sm font-medium hover:bg-[#294331] hover:text-white hover:border-[#294331] transition-all duration-300"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">
                                Logout
                            </span>
                        </button>

                    </div>

                </div>

            </header>

            {/* =====================================
                DASHBOARD BODY
            ===================================== */}

            <div className="flex items-stretch min-h-[calc(100vh-76px)]">

                {/* SIDEBAR */}

                <aside className="w-[68px] sm:w-[76px] md:w-64 shrink-0 bg-[#fffefa] border-r border-[#e9e5d9]">

                    <div className="sticky top-[76px] py-6">

                        {/* SIDEBAR HEADING */}

                        <div className="hidden md:block px-6 mb-6">

                            <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#bd7540]">
                                Management
                            </p>

                            <p className="text-xs text-[#9b9c8e] mt-1">
                                Manage your marketplace
                            </p>

                        </div>

                        {/* NAVIGATION */}

                        <nav className="flex flex-col gap-2 px-2 md:px-3">

                            {sidebarLinks.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        end={item.end}
                                        title={item.name}
                                        className={({ isActive }) =>
                                            `group relative flex items-center justify-center md:justify-start gap-3 px-2 md:px-4 py-3.5 rounded-xl transition-all duration-300 ${
                                                isActive
                                                    ? "bg-[#294331] text-white shadow-md shadow-[#294331]/15"
                                                    : "text-[#718071] hover:bg-[#edf1e9] hover:text-[#294331]"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon
                                                    size={20}
                                                    strokeWidth={1.8}
                                                    className="shrink-0"
                                                />

                                                <span className="hidden md:block text-sm font-medium flex-1">
                                                    {item.name}
                                                </span>

                                                {isActive && (
                                                    <ChevronRight
                                                        size={16}
                                                        className="hidden md:block"
                                                    />
                                                )}

                                                {/* MOBILE TOOLTIP */}

                                                <span className="md:hidden absolute left-[62px] z-50 whitespace-nowrap rounded-md bg-[#294331] px-3 py-2 text-xs text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg pointer-events-none">
                                                    {item.name}
                                                </span>
                                            </>
                                        )}
                                    </NavLink>
                                );
                            })}

                        </nav>

                        {/* SIDEBAR BOTTOM BRANDING */}

                        <div className="hidden md:block mx-4 mt-12 p-4 rounded-xl bg-[#f5f3e9] border border-[#ebe6d8]">

                            <div className="flex items-center gap-2 text-[#294331]">
                                <Leaf size={17} />

                                <span className="text-xs font-semibold">
                                    Sea Buckthorn Bharat
                                </span>
                            </div>

                            <p className="text-[11px] text-[#8c9384] mt-2 leading-5">
                                Thoughtfully sourced. Naturally yours.
                            </p>

                            <div className="w-8 h-0.5 bg-[#d97732] mt-3 rounded-full" />

                        </div>

                    </div>

                </aside>

                {/* MAIN CONTENT */}

                <main className="flex-1 min-w-0 bg-[#faf8f2]">

                    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8">

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>
    );
};

export default SellerLayout;
