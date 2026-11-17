
import React from "react";
import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-[#073B2A]">

      {/* Footer Main Content */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-12 border-b border-white/20 text-gray-300">

        {/* Brand Section */}
        <div className="max-w-md">

          {/* Logo */}
          <div className="mb-5">
            <img
              src={assets.logo1}
              alt="One Planet Market"
              className="w-52 md:w-60 h-auto object-contain"
            />
          </div>

          {/* Brand Description */}
          <p className="mt-5 text-sm font-semibold tracking-wide text-white">
            Nature's Wonder. Himalayan Goodness.
          </p>

        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-8">

          {footerLinks.map((section, index) => (
            <div key={index}>

              <h3 className="font-semibold text-base text-white mb-4">
                {section.title}
              </h3>

              <ul className="text-sm space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      target={
                        link.type === "whatsapp" ||
                        link.url.startsWith("https://")
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        link.type === "whatsapp" ||
                        link.url.startsWith("https://")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors duration-300"
                    >

                      {link.type === "whatsapp" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 32 32"
                          className="w-5 h-5 shrink-0 text-[#25D366]"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M16.04 2.004C8.32 2.004 2.04 8.284 2.04 16.004c0 2.47.65 4.89 1.89 7.01L2 30l7.16-1.88a13.94 13.94 0 0 0 6.88 1.81h.01c7.72 0 14-6.28 14-14s-6.28-13.926-14-13.926Zm0 25.57h-.01a11.6 11.6 0 0 1-5.91-1.62l-.42-.25-4.25 1.12 1.13-4.14-.27-.43a11.6 11.6 0 1 1 9.73 5.32Zm6.36-8.69c-.35-.17-2.08-1.03-2.4-1.15-.32-.12-.55-.17-.78.17-.23.35-.9 1.15-1.1 1.39-.2.23-.4.26-.75.09-.35-.17-1.47-.54-2.8-1.73-1.03-.92-1.73-2.06-1.94-2.41-.2-.35-.02-.54.15-.71.15-.15.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.43-.03-.6-.09-.17-.78-1.87-1.07-2.56-.28-.67-.56-.58-.78-.59h-.66c-.23 0-.6.09-.92.43-.32.35-1.21 1.18-1.21 2.88s1.24 3.34 1.41 3.57c.17.23 2.44 3.73 5.91 5.23.83.36 1.48.58 1.98.74.83.26 1.59.22 2.19.13.67-.1 2.08-.85 2.37-1.67.29-.82.29-1.52.2-1.67-.09-.15-.32-.23-.67-.4Z" />
                        </svg>
                      )}

                      <span>{link.text}</span>

                    </a>
                  </li>
                ))}
              </ul>

            </div>
          ))}

        </div>
      </div>

      {/* Copyright */}
      <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

        <p className="text-center text-sm text-gray-300">
          © {new Date().getFullYear()} Seabuckthorn. All Rights Reserved.
        </p>

        <p className="text-sm text-gray-400">
          Rooted in Nature. Inspired by the Himalayas.
        </p>

      </div>

    </footer>
  );
};

export default Footer;
