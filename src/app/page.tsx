"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import GlareHover from "@/components/GlareHover";
import { Marquee } from "@/components/ui/marquee";
import Navbar from "@/components/Navbar";

/* ─── Shared container width — matches navbar ─── */
const CW = "w-[85%] max-w-6xl mx-auto";

/* ─── Icons ─── */
const CheckIcon = () => (
  <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 text-[#d4a373] fill-current" viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg className={`w-5 h-5 text-[#4a6741] transition-transform duration-500 ease-out ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </svg>
);

/* ─── Data ─── */
const faqs = [
  { q: "How accurate is the estimate?", a: "Our calculator uses real data from government APIs and is typically within 5-10% of actual costs. Final quotes may vary based on specific roof conditions and local factors." },
  { q: "How long does installation take?", a: "Most roof replacements take 1-3 days. Solar installations typically add 1-2 additional days. Weather and permit requirements can affect timing." },
  { q: "What financing options are available?", a: "We offer multiple financing options including 0% down, low-interest loans, and PACE financing. Your specialist will review all available options." },
  { q: "Do I qualify for tax credits?", a: "Most homeowners qualify for the 30% federal tax credit. Additional state and local incentives may be available depending on your location." },
];

const testimonials = [
  { name: "Sarah Johnson", location: "Dallas, TX", quote: "Saved us over $20,000 in energy costs. The installation was smooth and professional.", initials: "SJ" },
  { name: "Mike Chen", location: "Phoenix, AZ", quote: "Best decision we ever made. Our electric bill went from $250 to $80 per month!", initials: "MC" },
  { name: "Lisa Martinez", location: "Austin, TX", quote: "The calculator was spot on. We got exactly what was promised and more.", initials: "LM" },
  { name: "David Park", location: "Denver, CO", quote: "Professional from start to finish. The savings report was incredibly detailed.", initials: "DP" },
  { name: "Rachel Kim", location: "San Diego, CA", quote: "We were skeptical at first, but the numbers were dead accurate. Couldn't be happier.", initials: "RK" },
];

const companies = [
  { name: "Smith Roofing", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", color: "#2d6a4f" },
  { name: "SunPower Homes", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z", color: "#d4a373" },
  { name: "Elite Solar TX", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "#e9c46a" },
  { name: "Peak Roofing", icon: "M3 21l6-6m0 0l4-8 4 8m-8 0h8m-4-8V3", color: "#40916c" },
  { name: "GreenTop Energy", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", color: "#2d6a4f" },
  { name: "Apex Home Services", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "#4a6741" },
  { name: "SolarEdge", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", color: "#d4a373" },
  { name: "Crown Roofing", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "#40916c" },
];

const steps = [
  { num: "01", title: "Tell us about your roof", desc: "Answer a few simple questions about your home and current roof condition", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { num: "02", title: "We calculate your savings", desc: "Our engine analyzes local rates, incentives, and your specific roof data", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { num: "03", title: "Get your personalized estimate", desc: "Receive a detailed breakdown of costs, savings, and payback timeline", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const benefits = [
  { title: "Lower energy bills", desc: "Reduce monthly electricity costs by up to 40%", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Increase home value", desc: "Boost your property value by $15k-$30k", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { title: "25-year warranty", desc: "Complete peace of mind with comprehensive coverage", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "Tax credits & rebates", desc: "Save up to 30% with federal and local incentives", icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" },
];

/* ─── Animated Counter Hook ─── */
const useCountUp = (target: number, duration: number = 2000) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
};

/* ─── Page ─── */
export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const savings = useCountUp(47832);
  const monthly = useCountUp(199);
  const payback = useCountUp(62);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ━━━━━━━━━━ HERO ━━━━━━━━━━ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-110 saturate-[1.15]"
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-mesh-hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f2ec]/40 via-transparent to-[#f5f2ec]/60" />

        {/* Hero text with very light localized blur */}
        <div className={`relative z-10 ${CW}`}>
          <div className="relative text-center max-w-3xl mx-auto">
            {/* Barely-there blur — just enough to lift text off the video */}
            <div className="absolute -inset-x-16 -inset-y-20 bg-white/5 backdrop-blur-[6px] rounded-[100px] mask-[radial-gradient(ellipse_at_center,black_25%,transparent_65%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_65%)]" />

            <div className="relative">
              <p
                className="text-sm sm:text-base tracking-[0.25em] uppercase text-[#2d6a4f] font-medium mb-6 animate-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                Pinnacle Partners
              </p>
              <h1
                className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#1a2e1a] mb-6 leading-[1.02] animate-fade-up"
                style={{ animationDelay: "0.35s" }}
              >
                See How Much
                <br />
                You Could{" "}
                <em className="font-display italic text-[#2d6a4f]">Save</em>
              </h1>
              <p
                className="text-lg sm:text-xl text-white mb-10 max-w-lg mx-auto font-light leading-relaxed animate-fade-up"
                style={{ animationDelay: "0.5s" }}
              >
                Get your free personalized estimate in 30 seconds
              </p>

              <div className="animate-fade-up" style={{ animationDelay: "0.65s" }}>
                <Link href="/calculator" className="group relative inline-block bg-[#2d6a4f] text-white px-7 py-3.5 rounded-[10px] text-base sm:text-lg font-semibold transition-colors duration-300 hover:bg-[#1a4031] cursor-pointer">
                  Get Your Free Estimate
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-5 text-white text-sm animate-fade-up" style={{ animationDelay: "0.8s" }}>
                {["No obligation", "Takes 30 seconds", "Instant results"].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5">
                    <CheckIcon />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1.4s" }}>
          <div className="w-6 h-10 rounded-full border-2 border-[#2d6a4f]/30 flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-[#2d6a4f]/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ SOCIAL PROOF MARQUEE ━━━━━━━━━━ */}
      <section className="py-6 bg-[#f5f2ec] border-y border-[#2d6a4f]/5">
        <div className={CW}>
          <p className="text-center text-xs tracking-[0.2em] uppercase text-[#6b8f63] mb-4 font-medium">
            Trusted by contractors nationwide
          </p>
        </div>
        <div className={CW}>
          <Marquee pauseOnHover className="[--duration:35s] [--gap:0.5rem]">
            {companies.map((co) => (
              <div key={co.name} className="flex items-center gap-2.5 px-6 shrink-0">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${co.color}15` }}
                >
                  <svg className="w-5 h-5" style={{ color: co.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={co.icon} />
                  </svg>
                </div>
                <span className="text-[15px] font-semibold text-[#1a2e1a]/60 whitespace-nowrap">{co.name}</span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ━━━━━━━━━━ ANIMATED STATS ━━━━━━━━━━ */}
      <section className="py-16 sm:py-20 bg-mesh-warm">
        <div className={CW}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { ref: savings.ref, value: savings.value, prefix: "$", suffix: "", label: "Average 20-Year Savings", format: (v: number) => v.toLocaleString() },
              { ref: monthly.ref, value: monthly.value, prefix: "$", suffix: "/mo", label: "Monthly Savings", format: (v: number) => v.toString() },
              { ref: payback.ref, value: payback.value, prefix: "", suffix: " years", label: "Average Payback Period", format: (v: number) => (v / 10).toFixed(1) },
            ].map((stat, i) => (
              <div key={i} ref={stat.ref} className="glass-card rounded-2xl p-6 sm:p-8 text-center noise-overlay relative overflow-hidden">
                <div className="flex items-baseline justify-center tabular-nums">
                  {stat.prefix && (
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#2d6a4f] mr-0.5">{stat.prefix}</span>
                  )}
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#2d6a4f] tracking-tight">
                    {stat.format(stat.value)}
                  </span>
                  {stat.suffix && (
                    <span className="text-sm text-[#4a6741] ml-1 font-medium">{stat.suffix}</span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#4a6741] mt-3 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ HOW IT WORKS ━━━━━━━━━━ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-mesh-green relative">
        <div className={CW}>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase text-[#d4a373] font-medium mb-3">
              Simple Process
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a2e1a]">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+48px)] right-[calc(16.67%+48px)] h-px bg-gradient-to-r from-transparent via-[#2d6a4f]/15 to-transparent" />

            {steps.map((step, i) => (
              <GlareHover
                key={i}
                width="100%"
                height="auto"
                background="rgba(255,255,255,0.5)"
                borderRadius="20px"
                borderColor="rgba(255,255,255,0.45)"
                glareColor="#2d6a4f"
                glareOpacity={0.12}
                glareSize={300}
                className="noise-overlay relative overflow-hidden backdrop-blur-lg"
              >
                <div className="p-8 text-center relative z-10 w-full">
                  <div className="w-14 h-14 rounded-2xl bg-[#2d6a4f]/10 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-6 h-6 text-[#2d6a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#d4a373] uppercase mb-2 block">
                    Step {step.num}
                  </span>
                  <h3 className="text-lg font-semibold mb-2 text-[#1a2e1a]">{step.title}</h3>
                  <p className="text-sm text-[#4a6741] leading-relaxed">{step.desc}</p>
                </div>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ WHY UPGRADE ━━━━━━━━━━ */}
      <section id="benefits" className="py-20 sm:py-28 bg-mesh-warm relative">
        <div className={CW}>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase text-[#d4a373] font-medium mb-3">
              Benefits
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a2e1a]">
              Why Upgrade Your Roof
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((card, i) => (
              <GlareHover
                key={i}
                width="100%"
                height="auto"
                background="rgba(255,255,255,0.5)"
                borderRadius="20px"
                borderColor="rgba(255,255,255,0.45)"
                glareColor="#d4a373"
                glareOpacity={0.15}
                glareSize={280}
                className="noise-overlay relative overflow-hidden backdrop-blur-lg"
              >
                <div className="p-7 relative z-10 w-full">
                  <div className="w-11 h-11 rounded-xl bg-[#2d6a4f]/10 flex items-center justify-center mb-5">
                    <svg className="w-5 h-5 text-[#2d6a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold mb-1.5 text-[#1a2e1a]">{card.title}</h3>
                  <p className="text-sm text-[#4a6741] leading-relaxed">{card.desc}</p>
                </div>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ TESTIMONIALS MARQUEE ━━━━━━━━━━ */}
      <section id="reviews" className="py-20 sm:py-28 bg-mesh-green relative overflow-hidden">
        <div className={CW}>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase text-[#d4a373] font-medium mb-3">
              Testimonials
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a2e1a]">
              What Homeowners Say
            </h2>
          </div>
        </div>

        <div className={CW}>
          <Marquee pauseOnHover className="[--duration:45s] [--gap:1.5rem] mb-4">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 w-[320px] sm:w-[360px] shrink-0 noise-overlay relative overflow-hidden flex flex-col"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
                </div>
                <p className="text-[#1a2e1a] mb-5 leading-relaxed text-[15px] flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center pt-3 border-t border-[#2d6a4f]/10">
                  <div className="w-8 h-8 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center mr-2.5 text-[10px] font-bold text-[#2d6a4f]">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1a2e1a]">{t.name}</p>
                    <p className="text-[11px] text-[#6b8f63]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
          <Marquee pauseOnHover reverse className="[--duration:50s] [--gap:1.5rem]">
            {[...testimonials].reverse().map((t, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 w-[320px] sm:w-[360px] shrink-0 noise-overlay relative overflow-hidden flex flex-col"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
                </div>
                <p className="text-[#1a2e1a] mb-5 leading-relaxed text-[15px] flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center pt-3 border-t border-[#2d6a4f]/10">
                  <div className="w-8 h-8 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center mr-2.5 text-[10px] font-bold text-[#2d6a4f]">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1a2e1a]">{t.name}</p>
                    <p className="text-[11px] text-[#6b8f63]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ━━━━━━━━━━ FAQ ━━━━━━━━━━ */}
      <section id="faq" className="py-20 sm:py-28 bg-mesh-warm relative">
        <div className={CW}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.25em] uppercase text-[#d4a373] font-medium mb-3">
                FAQ
              </p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a2e1a]">
                Common Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden noise-overlay relative">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors"
                  >
                    <h3 className="font-display text-lg text-[#1a2e1a] pr-4">{faq.q}</h3>
                    <ChevronIcon open={openFaq === i} />
                  </button>
                  <div className={`grid transition-all duration-500 ease-out ${openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm text-[#4a6741] leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ FINAL CTA ━━━━━━━━━━ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover brightness-110 saturate-[1.15]">
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f2ec]/50 via-transparent to-[#f5f2ec]/50" />
        <div className="absolute inset-0 bg-mesh-hero" />

        <div className={`relative z-10 ${CW}`}>
          <div className="relative text-center max-w-2xl mx-auto py-14 sm:py-16">
            <div className="absolute -inset-x-16 -inset-y-12 bg-white/5 backdrop-blur-[6px] rounded-[100px] mask-[radial-gradient(ellipse_at_center,black_25%,transparent_65%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_65%)]" />

            <div className="relative">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1a2e1a] mb-4">
                Ready to <em className="font-display italic text-[#2d6a4f]">save</em>?
              </h2>
              <p className="text-[#4a6741] mb-8 text-lg sm:text-xl font-light max-w-md mx-auto">
                Get your free estimate now and see how much you could save.
              </p>
              <Link href="/calculator" className="group inline-block bg-[#2d6a4f] text-white px-7 py-3.5 rounded-[10px] text-base sm:text-lg font-semibold transition-colors duration-300 hover:bg-[#1a4031] cursor-pointer">
                Get Your Free Estimate
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ FOOTER ━━━━━━━━━━ */}
      <footer className="glass-strong py-12 border-t border-[#2d6a4f]/8">
        <div className={CW}>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display text-lg text-[#1a2e1a] mb-3">Pinnacle Partners</h3>
              <p className="text-sm text-[#4a6741]">Premium roofing and solar solutions for homeowners.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#1a2e1a] mb-3">Services</h4>
              <ul className="space-y-1.5 text-sm text-[#4a6741]">
                <li>Roof Replacement</li>
                <li>Solar Installation</li>
                <li>Energy Audits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#1a2e1a] mb-3">Company</h4>
              <ul className="space-y-1.5 text-sm text-[#4a6741]">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#1a2e1a] mb-3">Legal</h4>
              <ul className="space-y-1.5 text-sm text-[#4a6741]">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-[#2d6a4f]/8 text-center text-xs text-[#6b8f63]">
            <p>&copy; 2024 Pinnacle Partners. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
