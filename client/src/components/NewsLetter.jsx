
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const { axios } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const response = await axios.post("/api/newsletter/subscribe", {
        email,
      });

      if (response.data.success) {
        toast.success("Successfully subscribed to newsletter!");
        setEmail("");
      } else {
        toast.error(response.data.message || "Subscription failed");
      }
    } catch (error) {
      toast.error("Newsletter subscription failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center space-y-3 mt-24 pb-16 px-5">

      {/* Heading */}
      <h1 className="text-2xl md:text-4xl font-bold font-sans text-green-900">
        Stay{" "}
        <span className="text-orange-500">
          Connected
        </span>
      </h1>

      {/* Description */}
      <p className="text-sm md:text-lg text-green-900/80 pb-6 max-w-2xl">
        Get updates on new products, producer stories, and sustainable living
        tips.
      </p>

      {/* Newsletter Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between max-w-2xl w-full h-12 md:h-14"
      >
        <input
          className="border border-gray-300 rounded-l-md h-full outline-none w-full px-4 text-gray-700 placeholder:text-gray-400 focus:border-green-800 transition-colors"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="px-6 md:px-12 h-full text-white bg-green-900 hover:bg-orange-500 transition-all duration-300 cursor-pointer rounded-r-md font-semibold text-sm md:text-base whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>

      {/* Small Note */}
      <p className="text-xs text-gray-500 pt-2">
        Stay connected with nature. Unsubscribe anytime.
      </p>

    </section>
  );
};

export default NewsLetter;
