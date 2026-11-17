
import React from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <section className="max-w-7xl mx-auto mt-16 px-4">

      {/* Heading */}
      <header className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-green-900">
          Shop by{" "}
          <span className="text-orange-500">
            Categories
          </span>
        </h2>

        <p className="mt-2 text-sm md:text-base text-green-900">
          Discover handcrafted, sustainable products from artisans around the
          world
        </p>
      </header>

      {/* Category Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map(({ text, subtitle, image, path }, i) => (
          <div
            key={i}
            onClick={() => {
              navigate(`/products/${path.toLowerCase()}`);
              scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="cursor-pointer group"
          >

            {/* Image */}
            <div className="h-56 w-full overflow-hidden rounded-2xl">
              <img
                src={image}
                alt={text}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Text */}
            <h3 className="mt-4 text-lg font-semibold text-green-900 group-hover:text-orange-500 transition-colors duration-300">
              {text}
            </h3>

            <p className="text-sm text-green-800">
              {subtitle}
            </p>

          </div>
        ))}
      </div>

    </section>
  );
};

export default Categories;
