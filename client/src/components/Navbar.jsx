
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const announcements = [
    "Wild-harvested in the Himalayas · Lab-tested purity",
    "Free shipping on orders above ₹999",
    "India's only Certified Organic Sea Buckthorn brand since 1993",
  ];

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const navTextStyle =
    "text-green-900 hover:text-orange-500 transition-colors duration-300 font-medium";

  const buttonStyle =
    "cursor-pointer px-8 py-2 bg-green-900 hover:bg-orange-500 transition-colors duration-300 text-white rounded-full";

  // Automatic announcement rotation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveAnnouncement((prev) =>
        (prev + 1) % announcements.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const previousAnnouncement = () => {
    setActiveAnnouncement((prev) =>
      (prev - 1 + announcements.length) % announcements.length
    );
  };

  const nextAnnouncement = () => {
    setActiveAnnouncement((prev) =>
      (prev + 1) % announcements.length
    );
  };

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");

      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <>
      {/* Announcement / Promotional Bar */}
      <div className="fixed top-0 left-0 w-full h-8 bg-orange-600 text-white z-[60] flex items-center justify-between px-3 md:px-5">

        {/* Previous */}
        <button
          onClick={previousAnnouncement}
          aria-label="Previous announcement"
          className="text-white hover:text-orange-100 transition text-xl leading-none"
        >
          ‹
        </button>

        {/* Announcement Text */}
        <div
          className="flex-1 text-center px-2 text-[10px] sm:text-xs md:text-sm font-bold tracking-tight"
          aria-live="polite"
        >
          {announcements[activeAnnouncement]}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={
              isPaused ? "Play announcements" : "Pause announcements"
            }
            className="text-white hover:text-orange-100 text-xs transition"
          >
            {isPaused ? "▶" : "Ⅱ"}
          </button>

          <button
            onClick={nextAnnouncement}
            aria-label="Next announcement"
            className="text-white hover:text-orange-100 transition text-xl leading-none"
          >
            ›
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-2 border-b border-gray-300 bg-white fixed top-8 left-0 w-full z-50 shadow-md transition-all">

        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center"
        >
          <img
            src={assets.logo1}
            alt="Seabuckthorn Bharat Logo"
            className="h-14 md:h-16 w-32 md:w-40 object-contain scale-125"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-8">

          {/* About Us - Opens Mission Page */}
          <NavLink to="/mission" className={navTextStyle}>
            About Us
          </NavLink>

          {/* Search */}
          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />

            <img
              src={assets.search_icon}
              alt="Search"
              className="w-4 h-4"
            />
          </div>

          {/* Cart */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="Cart"
              className="w-6 opacity-80"
            />

            <span className="absolute -top-2 -right-3 text-xs text-white bg-green-900 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </div>

          {/* All Products Button - Previously Join as Producer */}
          <NavLink to="/products">
            <button className={buttonStyle}>
              All Products
            </button>
          </NavLink>

          {/* Login / Profile */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className={buttonStyle}
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img
                src={assets.profile_icon}
                className="w-10"
                alt="Profile"
              />

              <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40">
                <li
                  onClick={() => navigate("/my-orders")}
                  className="p-1.5 pl-3 text-green-900 hover:text-orange-500 hover:bg-orange-50 cursor-pointer transition-colors"
                >
                  My Orders
                </li>

                <li
                  onClick={logout}
                  className="p-1.5 pl-3 text-green-900 hover:text-orange-500 hover:bg-orange-50 cursor-pointer transition-colors"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Navigation Icons */}
        <div className="flex items-center gap-6 sm:hidden">

          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="Cart"
              className="w-6 opacity-80"
            />

            <span className="absolute -top-2 -right-3 text-xs text-white bg-green-900 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </div>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <img src={assets.menu_icon} alt="Menu" />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-3 px-5 text-sm md:hidden">

            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={navTextStyle}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
              className={navTextStyle}
            >
              All Products
            </NavLink>

            {user && (
              <NavLink
                to="/producerform"
                onClick={() => setOpen(false)}
                className={navTextStyle}
              >
                Producer
              </NavLink>
            )}

            {/* About Us - Opens Mission Page */}
            <NavLink
              to="/mission"
              onClick={() => setOpen(false)}
              className={navTextStyle}
            >
              About Us
            </NavLink>

            {/* Mobile Search */}
            <div className="flex items-center gap-2 border border-gray-300 px-3 rounded-full w-full">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 w-full bg-transparent outline-none placeholder-gray-500"
                type="text"
                placeholder="Search products"
              />

              <img
                src={assets.search_icon}
                alt="Search"
                className="w-4 h-4"
              />
            </div>

            {/* All Products */}
            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
            >
              <button className={buttonStyle}>
                All Products
              </button>
            </NavLink>

            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowUserLogin(true);
                }}
                className={buttonStyle}
              >
                Login
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/my-orders");
                  }}
                  className={navTextStyle}
                >
                  My Orders
                </button>

                <button
                  onClick={logout}
                  className={buttonStyle}
                >
                  Logout
                </button>
              </>
            )}

          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
