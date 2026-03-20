"use client";

import { useState, useEffect } from "react";

const navItems = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      {/* nav padding = 10px, button corner radius = 10px, nav bottom corners = 16px */}
      <nav
        className={`relative flex items-center justify-between w-[92%] sm:w-[85%] max-w-6xl p-2 sm:p-2.5 rounded-b-[12px] sm:rounded-b-[16px] transition-all duration-500 ease-out ${
          scrolled
            ? "bg-white/30 backdrop-blur-xl shadow-[0_4px_24px_rgba(31,38,31,0.06),inset_0_1px_0_rgba(255,255,255,0.3)] border-b border-x border-white/35"
            : "bg-white/15 backdrop-blur-lg border-b border-x border-white/20"
        }`}
      >
        {/* Brand — left */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-display text-[#1a2e1a] text-sm sm:text-base lg:text-lg pl-2 sm:pl-2.5 shrink-0 cursor-pointer select-none"
        >
          Pinnacle
        </a>

        {/* Links — center */}
        <ul className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`relative block px-3 sm:px-4 py-2 text-[11px] sm:text-[13px] font-medium rounded-[8px] sm:rounded-[10px] transition-all duration-300 cursor-pointer select-none ${
                    isActive
                      ? "text-[#1a2e1a]"
                      : "text-[#4a6741] hover:text-[#1a2e1a]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-[8px] sm:rounded-[10px] bg-[#2d6a4f]/8 animate-[pill-in_0.3s_ease_both]" />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA — right, squarish with rounded-[10px] matching nav padding */}
        <a
          href="#estimate"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="block bg-[#2d6a4f] text-white text-[11px] sm:text-[13px] font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-[8px] sm:rounded-[10px] transition-colors duration-300 hover:bg-[#1a4031] cursor-pointer select-none whitespace-nowrap"
        >
          Free Estimate
        </a>
      </nav>

      <style>{`
        @keyframes pill-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
