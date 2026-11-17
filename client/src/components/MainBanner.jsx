
import React, { useState, useEffect, useRef } from "react";
import { assets, certificationLogos } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [videoKey, setVideoKey] = useState(0);

  const timerRef = useRef(null);

  // Show desktop banner image when video finishes
  const handleVideoEnd = () => {
    setShowBanner(true);

    timerRef.current = setTimeout(() => {
      setShowBanner(false);
      setVideoKey((prev) => prev + 1);
    }, 5000);
  };

  // Clear timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Duplicate logos for seamless infinite scrolling
  const repeatedLogos = [
    ...certificationLogos,
    ...certificationLogos,
  ];

  return (
    <>
      {/* ================= HERO BANNER ================= */}
      <section className="relative isolate w-full min-h-[calc(100svh-96px)] overflow-hidden bg-black">

        {/* Desktop Video */}
        <video
          key={`desktop-${videoKey}`}
          className={`hidden md:block absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            showBanner ? "opacity-0" : "opacity-100"
          }`}
          src={assets.hero_video}
          poster={assets.banner22}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
        />

        {/* Mobile Video - Plays Continuously */}
        <video
          className="md:hidden absolute inset-0 w-full h-full object-cover"
          src={assets.mobile_video}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
        />

        {/* Desktop Banner Image - No Text */}
        <img
          src={assets.banner22}
          alt="One Planet Market"
          className={`hidden md:block absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            showBanner ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Desktop Video Overlay */}
        <div
          className={`hidden md:block absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none transition-opacity duration-1000 ${
            showBanner ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Mobile Video Overlay */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div
          className={`relative z-10 flex items-center min-h-[calc(100svh-96px)] transition-opacity duration-700 ${
            showBanner ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-8 xl:px-14 py-16">

            <p className="font-poppins text-sm sm:text-base md:text-lg font-semibold tracking-wide text-white mb-4">
              Wild Himalayan · Certified Organic
            </p>

            <h1 className="font-poppins text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.08] tracking-tight max-w-3xl">
              The Wonder Berry,
              <br />
              Perfected.
            </h1>

            <div className="mt-8 md:mt-10">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-3 px-8 md:px-10 py-3.5 md:py-4 bg-green-900 hover:bg-orange-500 text-white text-sm md:text-base font-semibold rounded-sm transition-all duration-300 shadow-lg"
              >
                Shop Now

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CERTIFICATION LOGO SLIDER ================= */}
      <section className="w-full bg-white overflow-hidden border-b border-gray-200 py-6 md:py-8">

        <div className="relative w-full overflow-hidden">
          <div className="certification-track flex w-max items-center">
            {repeatedLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex shrink-0 items-center justify-center px-5 sm:px-7 md:px-9"
              >
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="h-14 w-20 sm:h-16 sm:w-24 md:h-20 md:w-28 object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .certification-track {
            animation: certification-scroll 35s linear infinite;
            will-change: transform;
          }

          .certification-track:hover {
            animation-play-state: paused;
          }

          @keyframes certification-scroll {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .certification-track {
              animation: none;
            }
          }
        `}</style>

      </section>
    </>
  );
};

export default MainBanner;
