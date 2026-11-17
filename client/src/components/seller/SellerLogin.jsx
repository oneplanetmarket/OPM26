
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLogin = () => {
    const { isSeller, setIsSeller, navigate, axios } = useAppContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const { data } = await axios.post("/api/seller/login", {
                email,
                password,
            });

            if (data.success) {
                setIsSeller(true);
                navigate("/seller");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message
            );
        }
    };

    useEffect(() => {
        if (isSeller) {
            navigate("/seller");
        }
    }, [isSeller]);

    return (
        !isSeller && (
            <main className="relative min-h-screen overflow-hidden bg-[#faf8f2] px-4 pb-12 pt-28 sm:px-6 sm:pt-32">

                {/* BACKGROUND DECORATION */}

                <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#e9a34e]/10 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#294331]/10 blur-3xl" />

                {/* MAIN CONTAINER */}

                <div className="relative mx-auto grid min-h-[620px] max-w-6xl overflow-hidden rounded-[28px] border border-[#e8e1d5] bg-white shadow-[0_20px_70px_rgba(42,57,39,0.09)] lg:grid-cols-2">

                    {/* LEFT BRAND PANEL */}

                    <section className="relative flex min-h-[270px] flex-col justify-between overflow-hidden bg-[#173e2b] p-7 text-white sm:p-10 lg:min-h-[620px] lg:p-12">

                        {/* Decorative circles */}

                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />

                        <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full border border-white/10" />

                        <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-white/10" />

                        <div className="absolute right-12 top-1/2 h-3 w-3 rounded-full bg-[#e6a34d]" />

                        <div className="absolute bottom-32 right-20 h-2 w-2 rounded-full bg-[#e6a34d]/70" />

                        {/* Brand */}

                        <div className="relative z-10">

                            <div className="mb-12 inline-flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9a34e] text-xl font-bold text-[#173e2b]">
                                    S
                                </div>

                                <div>
                                    <p className="text-sm font-bold tracking-[0.16em]">
                                        SEABUCKTHORN
                                    </p>
                                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.25em] text-white/60">
                                        Himalayan Goodness
                                    </p>
                                </div>
                            </div>

                            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e9ae65]">
                                Seller Portal
                            </p>

                            <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                Good products.
                                <br />
                                Great partnerships.
                            </h1>

                            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                                Welcome to your dedicated seller space.
                                Manage your products, grow your business
                                and bring the goodness of nature to more
                                customers.
                            </p>

                            <div className="mt-8 flex items-center gap-3">
                                <span className="h-px w-10 bg-[#e9a34e]" />
                                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                                    Nature's Wonder. Himalayan Goodness.
                                </span>
                            </div>
                        </div>

                        {/* Bottom branding */}

                        <div className="relative z-10 mt-12 hidden border-t border-white/15 pt-6 sm:block">
                            <p className="text-xs text-white/50">
                                A thoughtfully curated marketplace.
                            </p>
                        </div>

                    </section>

                    {/* RIGHT LOGIN PANEL */}

                    <section className="flex items-center justify-center bg-[#fffefa] px-6 py-12 sm:px-12 lg:px-14">

                        <div className="w-full max-w-md">

                            {/* Heading */}

                            <div className="mb-9">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#eee1cd] bg-[#fff7eb] px-3 py-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#d97732]" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a56b39]">
                                        Seller Access
                                    </span>
                                </div>

                                <h2 className="text-3xl font-semibold tracking-tight text-[#294331] sm:text-4xl">
                                    Welcome back
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-[#898679]">
                                    Sign in to continue managing your
                                    seller account.
                                </p>
                            </div>

                            {/* LOGIN FORM */}

                            <form
                                onSubmit={onSubmitHandler}
                                className="space-y-6"
                            >

                                {/* EMAIL */}

                                <div>
                                    <label
                                        htmlFor="seller-email"
                                        className="mb-2 block text-xs font-semibold text-[#354b38]"
                                    >
                                        Email Address
                                    </label>

                                    <div className="flex items-center rounded-xl border border-[#e7e1d5] bg-[#faf9f5] px-4 transition focus-within:border-[#8da18a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#294331]/5">

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="h-5 w-5 shrink-0 text-[#a39d8d]"
                                        >
                                            <rect
                                                x="3"
                                                y="5"
                                                width="18"
                                                height="14"
                                                rx="2"
                                            />
                                            <path d="m3 7 9 6 9-6" />
                                        </svg>

                                        <input
                                            id="seller-email"
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            value={email}
                                            type="email"
                                            placeholder="Enter your email"
                                            autoComplete="username"
                                            className="w-full bg-transparent px-3 py-4 text-sm text-[#294331] outline-none placeholder:text-[#aaa699]"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}

                                <div>
                                    <label
                                        htmlFor="seller-password"
                                        className="mb-2 block text-xs font-semibold text-[#354b38]"
                                    >
                                        Password
                                    </label>

                                    <div className="flex items-center rounded-xl border border-[#e7e1d5] bg-[#faf9f5] px-4 transition focus-within:border-[#8da18a] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#294331]/5">

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            className="h-5 w-5 shrink-0 text-[#a39d8d]"
                                        >
                                            <rect
                                                x="4"
                                                y="10"
                                                width="16"
                                                height="11"
                                                rx="2"
                                            />
                                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                        </svg>

                                        <input
                                            id="seller-password"
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            value={password}
                                            type="password"
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
                                            className="w-full bg-transparent px-3 py-4 text-sm text-[#294331] outline-none placeholder:text-[#aaa699]"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* LOGIN BUTTON */}

                                <button
                                    type="submit"
                                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#294331] py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_6px_18px_rgba(41,67,49,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1c3525] hover:shadow-lg"
                                >
                                    Sign In

                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </button>

                            </form>

                            {/* SECURITY NOTE */}

                            <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#eee9df] pt-6">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-4 w-4 text-[#66815d]"
                                >
                                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>

                                <p className="text-[10px] text-[#969183]">
                                    Secure Seller Authentication
                                </p>
                            </div>

                            <p className="mt-7 text-center text-[10px] leading-5 text-[#aaa699]">
                                © {new Date().getFullYear()} Seabuckthorn.
                                All rights reserved.
                            </p>

                        </div>
                    </section>

                </div>
            </main>
        )
    );
};

export default SellerLogin;
