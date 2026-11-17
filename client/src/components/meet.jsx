
import React from "react";
import { assets } from "../assets/assets";
import { CircleX, CheckCircle2 } from "lucide-react";

const comparisonData = [
  {
    others: "Generic herbal products",
    seabuckthorn: "Specialised Sea Buckthorn expertise",
  },
  {
    others: "Basic formulations",
    seabuckthorn: "Research based formulations",
  },
  {
    others: "Ordinary sourcing",
    seabuckthorn: "Himalayan sourced ingredients",
  },
  {
    others: "No scientific backing",
    seabuckthorn: "Science backed & clinically inspired",
  },
  {
    others: "No clinical testing",
    seabuckthorn: "Pre-clinically tested products",
  },
  {
    others: "Average quality control",
    seabuckthorn: "GMP certified & lab tested",
  },
];

const Producers = () => {
  return (
    <section className="w-full bg-white py-12 md:py-16 px-5 sm:px-8 lg:px-12">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">

        {/* LEFT SIDE - COMPARISON */}
        <div className="w-full">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-8">
            Why Biosash Seabuckthorn Is{" "}
            <span className="font-bold text-orange-500">
              Different?
            </span>
          </h2>

          {/* Table Header */}
          <div className="grid grid-cols-2 border-b border-gray-200 pb-4 mb-1">

            <div className="text-xs font-semibold text-gray-600">
              Others
            </div>

            <div className="text-xs font-bold text-green-800">
              Seabuckthorn
            </div>

          </div>

          {/* Comparison Rows */}
          <div>
            {comparisonData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 items-center gap-3 sm:gap-5 py-4 border-b border-gray-200"
              >

                {/* Others */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <CircleX
                    size={16}
                    className="shrink-0 text-gray-500"
                    strokeWidth={1.6}
                  />

                  <span className="text-xs sm:text-sm text-gray-600 leading-5">
                    {item.others}
                  </span>
                </div>

                {/* Seabuckthorn */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-green-700"
                    strokeWidth={1.8}
                  />

                  <span className="text-xs sm:text-sm font-semibold text-gray-900 leading-5">
                    {item.seabuckthorn}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE - FULL IMAGE */}
        <div className="w-full flex items-center justify-center">

          <div className="w-full max-w-[480px] mx-auto">

            <img
              src={assets.middle}
              alt="Sea Buckthorn Company History and Achievements"
              className="w-full h-auto max-h-[380px] object-contain object-center"
              loading="lazy"
            />

          </div>

        </div>

      </div>

    </section>
  );
};

export default Producers;
