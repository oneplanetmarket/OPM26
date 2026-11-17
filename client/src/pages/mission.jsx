
import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

import {
  Leaf,
  Mountain,
  Heart,
  ShieldCheck,
  FlaskConical,
  Sprout,
  ArrowRight,
  Globe2,
  Droplets,
  Sparkles,
  PackageCheck,
} from "lucide-react";

const values = [
  {
    icon: Mountain,
    title: "Himalayan Origins",
    description:
      "Inspired by the extraordinary landscapes of the Himalayas and the natural richness of Sea Buckthorn.",
  },
  {
    icon: Leaf,
    title: "Nature First",
    description:
      "Celebrating the natural character of Sea Buckthorn and its place in everyday wellness.",
  },
  {
    icon: FlaskConical,
    title: "Quality Focus",
    description:
      "A thoughtful approach to processing, product development and quality at every stage.",
  },
  {
    icon: Heart,
    title: "People & Communities",
    description:
      "Recognising the people, knowledge and communities connected to Himalayan harvests.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "Building confidence through clear product information and a commitment to responsible practices.",
  },
  {
    icon: Sprout,
    title: "Inspired by Nature",
    description:
      "Bringing the distinctive story of the Himalayan wonder berry into modern everyday living.",
  },
];

const productHighlights = [
  {
    icon: Droplets,
    title: "Natural Goodness",
    description:
      "Discover the distinctive character of Himalayan Sea Buckthorn.",
  },
  {
    icon: FlaskConical,
    title: "Thoughtful Processing",
    description:
      "A considered approach to transforming berries into everyday products.",
  },
  {
    icon: PackageCheck,
    title: "From Berry to Bottle",
    description:
      "A journey that connects sourcing, processing and finished products.",
  },
];

const Mission = () => {
  return (
    <main className="w-full bg-white text-gray-900 overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[85svh] md:min-h-[90svh] bg-[#092D20] overflow-hidden flex items-center">

        {/* Desktop Video */}
        <video
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
          src={assets.hero_video}
          poster={assets.banner22}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Mobile Video */}
        <video
          className="md:hidden absolute inset-0 w-full h-full object-cover"
          src={assets.mobile_video}
          poster={assets.mobile1}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 py-24">

          <div className="max-w-3xl">

            <div className="flex items-center gap-3 mb-7">
              <span className="w-10 h-[2px] bg-orange-500" />
              <p className="text-orange-300 uppercase tracking-[0.24em] text-xs sm:text-sm font-semibold">
                Inspired by the Himalayas
              </p>
            </div>

            <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-7xl leading-[1.08] tracking-tight">
              Rooted in Nature.
              <br />
              <span className="text-orange-400">
                Inspired by Sea Buckthorn.
              </span>
            </h1>

            <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-8 mt-7 max-w-2xl">
              Discover the story of the Himalayan wonder berry.
              From its remarkable natural origins to thoughtfully
              developed products, experience the goodness of Sea Buckthorn.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-9">

              <Link
                to="/products"
                className="inline-flex items-center gap-3 px-7 py-4 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-all duration-300"
              >
                Explore Products
                <ArrowRight size={18} />
              </Link>

              <a
                href="#our-story"
                className="inline-flex items-center gap-3 px-7 py-4 border border-white/60 text-white hover:bg-white hover:text-green-950 text-sm font-semibold transition-all duration-300"
              >
                Discover Our Story
                <ArrowRight size={18} />
              </a>

            </div>

          </div>
        </div>

        {/* Bottom Brand Label */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex flex-wrap justify-between items-center gap-3">
            <p className="text-white/80 text-xs tracking-widest uppercase">
              Himalayan Sea Buckthorn
            </p>
            <p className="text-orange-300 text-xs tracking-widest uppercase">
              Nature's Wonder Berry
            </p>
          </div>
        </div>

      </section>


      {/* ================= INTRODUCTION ================= */}
      <section className="py-20 md:py-28 px-6 sm:px-10 lg:px-16">

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <div>

            <p className="text-orange-600 uppercase text-xs font-bold tracking-[0.22em] mb-5">
              Our Purpose
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-green-950">
              Bringing the
              <br />
              <span className="text-orange-600">
                Himalayas Closer
              </span>
              <br />
              to Your Everyday Life.
            </h2>

            <div className="w-16 h-1 bg-orange-500 mt-7 mb-7" />

            <p className="text-gray-600 text-base leading-8 mb-5">
              Sea Buckthorn is a remarkable berry that grows in the
              challenging landscapes of the Himalayas. Its distinctive
              character, vibrant colour and natural richness make it
              an extraordinary gift of nature.
            </p>

            <p className="text-gray-600 text-base leading-8">
              Our purpose is to bring the story and goodness of this
              Himalayan berry to more people through thoughtfully
              developed products and a commitment to quality.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 mt-8 text-green-900 font-semibold text-sm hover:text-orange-600 transition-colors"
            >
              Explore our collection
              <ArrowRight size={18} />
            </Link>

          </div>

          {/* Image */}
          <div className="relative">

            <div className="absolute -top-4 -left-4 w-full h-full border border-orange-300" />

            <img
              src={assets.middle}
              alt="Sea Buckthorn heritage and story"
              className="relative w-full h-[320px] sm:h-[430px] object-contain bg-[#FFF7EF]"
              loading="lazy"
            />

            <div className="absolute bottom-5 left-5 bg-green-950 text-white px-5 py-4">
              <p className="text-xs uppercase tracking-widest text-orange-300">
                Inspired by
              </p>
              <p className="font-semibold text-lg">
                Himalayan Nature
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ================= BRAND VALUES ================= */}
      <section className="bg-[#FFF7EF] py-20 md:py-24 px-6 sm:px-10 lg:px-16">

        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="text-orange-600 uppercase text-xs font-bold tracking-[0.22em] mb-4">
              What Guides Us
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-950">
              Our Core{" "}
              <span className="text-orange-600">Values</span>
            </h2>

            <p className="text-gray-600 mt-5 leading-7 text-sm sm:text-base">
              The principles behind our approach to Himalayan Sea Buckthorn,
              product quality and the people connected to its journey.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">

            {values.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group border-t border-orange-200 pt-7 transition-all duration-300"
                >

                  <div className="w-14 h-14 rounded-full bg-green-950 flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-300">
                    <Icon
                      size={25}
                      strokeWidth={1.6}
                      className="text-orange-300 group-hover:text-white transition-colors"
                    />
                  </div>

                  <p className="text-orange-600 text-xs font-bold tracking-widest mb-2">
                    0{index + 1}
                  </p>

                  <h3 className="text-xl font-bold text-green-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600 max-w-sm">
                    {item.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* ================= HERITAGE / STORY ================= */}
      <section
        id="our-story"
        className="py-20 md:py-28 px-6 sm:px-10 lg:px-16"
      >

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Story Image */}
          <div className="relative order-2 lg:order-1">

            <img
              src={assets.mission}
              alt="Our Sea Buckthorn heritage"
              className="w-full h-[320px] sm:h-[440px] object-cover"
              loading="lazy"
            />

            <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-orange-600 text-white p-5 sm:p-7 max-w-[220px]">
              <Leaf size={27} className="mb-3" />
              <p className="text-lg font-bold leading-snug">
                A Story Inspired by Nature
              </p>
            </div>

          </div>

          {/* Story Text */}
          <div className="order-1 lg:order-2">

            <p className="text-orange-600 uppercase text-xs font-bold tracking-[0.22em] mb-5">
              Our Story & Heritage
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-950 leading-tight">
              More Than
              <br />
              <span className="text-orange-600">
                Just a Berry.
              </span>
            </h2>

            <div className="w-16 h-1 bg-orange-500 mt-7 mb-7" />

            <p className="text-gray-600 leading-8 mb-5">
              High in the Himalayan landscape, Sea Buckthorn grows in
              a remarkable natural environment. Its bright orange berries
              have attracted attention for their distinctive qualities
              and place in traditional regional life.
            </p>

            <p className="text-gray-600 leading-8 mb-5">
              The journey from berry to finished product requires care,
              knowledge and attention at every stage. We believe that
              the story behind a product matters just as much as
              the product itself.
            </p>

            <p className="text-gray-600 leading-8">
              We are inspired by the opportunity to share this
              Himalayan treasure with people looking for products
              connected to nature.
            </p>

          </div>

        </div>
      </section>


      {/* ================= PRODUCT APPROACH ================= */}
      <section className="bg-green-950 py-20 md:py-24 px-6 sm:px-10 lg:px-16">

        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-14">

            <p className="text-orange-300 uppercase text-xs font-bold tracking-[0.22em] mb-4">
              From Nature to You
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Our Approach to{" "}
              <span className="text-orange-400">
                Quality
              </span>
            </h2>

            <p className="mt-5 text-gray-300 leading-7 text-sm sm:text-base">
              Every stage matters when turning a natural ingredient
              into a product for everyday life.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {productHighlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="border border-white/15 p-8 hover:border-orange-400/70 transition-colors duration-300"
                >

                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                      <Icon
                        size={26}
                        className="text-orange-300"
                        strokeWidth={1.6}
                      />
                    </div>

                    <span className="text-orange-300/70 text-sm font-semibold">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm text-gray-300 leading-7">
                    {item.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>


      {/* ================= CLOSING BRAND SECTION ================= */}
      <section className="relative bg-[#FFF7EF] py-20 md:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden">

        <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-green-200/30 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">

          <div className="w-16 h-16 rounded-full bg-green-950 flex items-center justify-center mx-auto mb-7">
            <Sparkles size={28} className="text-orange-300" />
          </div>

          <p className="text-orange-600 uppercase text-xs font-bold tracking-[0.22em] mb-5">
            Discover the Himalayan Wonder
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-green-950 leading-tight">
            Bring Nature's{" "}
            <span className="text-orange-600">
              Goodness
            </span>
            <br />
            Into Your Everyday.
          </h2>

          <p className="mt-6 text-gray-600 text-sm sm:text-base leading-8 max-w-2xl mx-auto">
            Explore our Sea Buckthorn collection and discover products
            inspired by the remarkable natural heritage of the Himalayas.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-9">

            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-3 px-8 py-4 bg-green-950 hover:bg-orange-600 text-white text-sm font-semibold transition-all duration-300"
            >
              Shop Sea Buckthorn
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-3 px-8 py-4 border border-green-900 text-green-950 hover:bg-green-950 hover:text-white text-sm font-semibold transition-all duration-300"
            >
              Back to Home
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
};

export default Mission;
