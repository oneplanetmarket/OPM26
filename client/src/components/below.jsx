
import React, { useState, useEffect } from "react";
import { Globe, Leaf, ShieldCheck } from "lucide-react";

const journeySteps = [
  {
    step: 1,
    title: "Harvest.",
    description:
      "Certified wild harvested organic Sea Buckthorn berries",
  },
  {
    step: 2,
    title: "Process.",
    description:
      "Initial processing within 6 hours — preserving natural omega oils & nutrition",
  },
  {
    step: 3,
    title: "Refine.",
    description:
      "Exclusive processing facility in Leh — pioneering since 2004",
  },
  {
    step: 4,
    title: "Innovate.",
    description:
      "India's first unique patent-pending processing technology",
  },
  {
    step: 5,
    title: "Preserve.",
    description:
      "Maximum natural nutrition preservation",
  },
  {
    step: 6,
    title: "Bottle.",
    description:
      "From berry to bottle — complete supply chain control",
  },
  {
    step: 7,
    title: "Trust.",
    description:
      "Trusted since 2004 — exporting to USA · UK · UAE",
  },
  {
    step: 8,
    title: "Verify.",
    description:
      "India's first pre-clinically tested Sea Buckthorn juices, verified free from heavy metals & impurities",
  },
];

// Desktop timeline coordinates
const desktopPoints = [
  { x: 5, y: 82 },
  { x: 17.85, y: 72 },
  { x: 30.7, y: 62 },
  { x: 43.55, y: 52 },
  { x: 56.4, y: 42 },
  { x: 69.25, y: 32 },
  { x: 82.1, y: 22 },
  { x: 95, y: 12 },
];

// Animated Sea Buckthorn Berry
const BerryIcon = () => {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-12 h-12 md:w-14 md:h-14 drop-shadow-lg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Leaves */}
      <path
        d="M29 14C20 4 9 7 7 12C16 18 23 19 29 14Z"
        fill="#24733C"
      />
      <path
        d="M31 14C35 3 47 2 52 7C47 16 39 19 31 14Z"
        fill="#398B45"
      />

      {/* Branch */}
      <path
        d="M30 15L34 25"
        stroke="#246B36"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Berries */}
      <circle cx="20" cy="28" r="9" fill="#FF7A00" />
      <circle cx="35" cy="29" r="10" fill="#FF6500" />
      <circle cx="48" cy="30" r="8" fill="#FF8A00" />
      <circle cx="27" cy="43" r="9" fill="#FF8A00" />
      <circle cx="42" cy="45" r="10" fill="#F65B00" />
      <circle cx="15" cy="44" r="7" fill="#FF7100" />

      {/* Berry highlights */}
      <circle cx="17" cy="25" r="2.5" fill="#FFD08A" />
      <circle cx="32" cy="25" r="2.5" fill="#FFD08A" />
      <circle cx="45" cy="27" r="2" fill="#FFD08A" />
      <circle cx="24" cy="40" r="2" fill="#FFD08A" />
      <circle cx="39" cy="41" r="2.5" fill="#FFD08A" />
    </svg>
  );
};

const MissionSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Highlight each journey step automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % journeySteps.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-white py-16 md:py-20 px-5 sm:px-8 lg:px-12 overflow-hidden">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADING ================= */}
        <div className="mb-12 md:mb-16">

          <p className="text-sm font-semibold tracking-wide text-orange-600 mb-3">
            From the Ladakh Himalayas for Your Health
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-950">
            The Biosash
            <br />
            <span className="text-orange-600">
              Seabuckthorn Journey
            </span>
          </h2>

          <p className="mt-4 text-sm md:text-base text-gray-600 max-w-xl">
            From wild Himalayan harvest to carefully verified products,
            discover the journey behind every Sea Buckthorn berry.
          </p>

        </div>

        {/* ================= DESKTOP TIMELINE ================= */}
        <div className="hidden lg:block relative w-full h-[510px]">

          {/* Connecting Green Path */}
          <svg
            viewBox="0 0 1000 420"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full overflow-visible"
          >
            <path
              d="
                M 50 345
                H 150 L 178 303
                H 278 L 306 261
                H 406 L 434 219
                H 534 L 562 177
                H 662 L 690 135
                H 790 L 818 93
                H 920
              "
              fill="none"
              stroke="#23743B"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Journey Milestones */}
          {journeySteps.map((item, index) => {
            const point = desktopPoints[index];
            const isActive = activeStep === index;
            const isAbove = index % 2 === 0;

            return (
              <div
                key={item.step}
                className="absolute z-10"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >

                {/* Step Description */}
                <div
                  className={`absolute left-1/2 w-[165px] text-center transition-all duration-700 ${
                    isAbove
                      ? "bottom-8"
                      : "top-8"
                  } ${
                    isActive
                      ? "opacity-100 scale-105"
                      : "opacity-80 scale-100"
                  }`}
                  style={{
                    transform: "translateX(-50%)",
                  }}
                >

                  <p className="text-[11px] font-bold tracking-wide text-orange-600 mb-1">
                    Step {item.step}
                  </p>

                  <h3 className="text-sm font-bold text-gray-800 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs leading-[1.55] text-gray-700">
                    {item.description}
                  </p>

                </div>

                {/* Milestone Dot */}
                <div
                  className={`relative z-20 rounded-full bg-orange-600 border-2 border-white transition-all duration-500 ${
                    isActive
                      ? "w-7 h-7 shadow-[0_0_0_7px_rgba(249,115,22,0.18)] scale-110"
                      : "w-5 h-5"
                  }`}
                />

                {/* Berry Animation on Active Step */}
                {isActive && (
                  <div
                    className="absolute left-1/2 -top-[64px] z-30 animate-berry-pop"
                    style={{
                      transform: "translateX(-50%)",
                    }}
                  >
                    <BerryIcon />
                  </div>
                )}

              </div>
            );
          })}

          {/* End Berry */}
          <div className="absolute right-0 top-[2%] animate-berry-float">
            <BerryIcon />
          </div>

        </div>

        {/* ================= MOBILE / TABLET TIMELINE ================= */}
        <div className="lg:hidden relative mt-12">

          {/* Vertical Green Line */}
          <div className="absolute left-[15px] top-3 bottom-5 w-[3px] bg-green-800 rounded-full" />

          <div className="space-y-9">

            {journeySteps.map((item, index) => {
              const isActive = activeStep === index;

              return (
                <div
                  key={item.step}
                  className="relative flex gap-5 items-start"
                >

                  {/* Timeline Marker */}
                  <div className="relative z-10 shrink-0 mt-1">

                    <div
                      className={`rounded-full bg-orange-600 border-[3px] border-white transition-all duration-500 ${
                        isActive
                          ? "w-8 h-8 shadow-[0_0_0_6px_rgba(249,115,22,0.15)]"
                          : "w-7 h-7"
                      }`}
                    />

                    {isActive && (
                      <div className="absolute -top-10 -left-2 animate-berry-pop">
                        <BerryIcon />
                      </div>
                    )}

                  </div>

                  {/* Step Content */}
                  <div
                    className={`flex-1 pb-5 border-b border-gray-100 transition-all duration-500 ${
                      isActive
                        ? "translate-x-1"
                        : ""
                    }`}
                  >

                    <p className="text-xs font-bold text-orange-600 mb-1">
                      Step {item.step}
                    </p>

                    <h3 className="text-base font-bold text-green-900 mb-1">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                      {item.description}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* ================= BOTTOM FEATURES ================= */}
        <div className="mt-14 md:mt-16 bg-green-900 rounded-2xl md:rounded-full px-6 py-6">

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">

            <div className="flex items-center gap-2 text-white">
              <Leaf size={18} className="text-orange-300" />
              <span className="text-xs sm:text-sm font-semibold">
                Natural Himalayan Berries
              </span>
            </div>

            <div className="hidden md:block h-6 w-px bg-white/25" />

            <div className="flex items-center gap-2 text-white">
              <ShieldCheck size={18} className="text-orange-300" />
              <span className="text-xs sm:text-sm font-semibold">
                Quality Focused Processing
              </span>
            </div>

            <div className="hidden md:block h-6 w-px bg-white/25" />

            <div className="flex items-center gap-2 text-white">
              <Globe size={18} className="text-orange-300" />
              <span className="text-xs sm:text-sm font-semibold">
                Global Reach
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ================= ANIMATION STYLES ================= */}
      <style>{`
        @keyframes berry-pop {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.5);
          }
          65% {
            opacity: 1;
            transform: translateY(-5px) scale(1.12);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes berry-float {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-9px) rotate(5deg);
          }
        }

        .animate-berry-pop {
          animation: berry-pop 0.65s ease-out both;
        }

        .animate-berry-float {
          animation: berry-float 2.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-berry-pop,
          .animate-berry-float {
            animation: none;
          }
        }
      `}</style>

    </section>
  );
};

export default MissionSection;
