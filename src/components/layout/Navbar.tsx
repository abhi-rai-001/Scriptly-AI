"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Brand logo SVG
export function ScriptlyLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Scriptly AI logo"
    >
      <rect width="32" height="32" rx="9" fill="url(#logo-grad)" />
      <path
        d="M9 11.5C9 10.672 9.672 10 10.5 10H18c.276 0 .5.224.5.5s-.224.5-.5.5h-7.5c-.276 0-.5.224-.5.5v8c0 .276.224.5.5.5H15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13 15h5M13 18h3"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M19 17.5l2.5-2.5 2.5 2.5M21.5 15v7"
        stroke="url(#arrow-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="arrow-grad" x1="19" y1="15" x2="24" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
];

interface NavbarProps {
  isAuthenticated: boolean;
}

export default function Navbar({ isAuthenticated }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[oklch(0.13_0.006_285/85%)] backdrop-blur-xl border-b border-white/6 py-3"
          : "py-5"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center group">
          <span
            className="text-xl font-black tracking-[-0.03em] text-foreground"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Scriptly<span className="gradient-text-violet">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={isAuthenticated ? "/generate" : "/login"}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 px-3 py-2"
          >
            {isAuthenticated ? "Generate" : "Sign In"}
          </Link>
          <Link
            href={isAuthenticated ? "/dashboard" : "/signup"}
            className="btn-amber text-sm px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5"
          >
            {isAuthenticated ? "Dashboard" : "Get Started"}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={cn("block w-5 h-px bg-foreground transition-all duration-300", menuOpen && "rotate-45 translate-y-2")} />
          <span className={cn("block w-5 h-px bg-foreground transition-all duration-300", menuOpen && "opacity-0")} />
          <span className={cn("block w-5 h-px bg-foreground transition-all duration-300", menuOpen && "-rotate-45 -translate-y-2")} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-400",
        menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-6 py-4 flex flex-col gap-4 border-t border-white/6 bg-[oklch(0.13_0.006_285/95%)] backdrop-blur-xl">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-white/6">
            <Link href={isAuthenticated ? "/generate" : "/login"} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
              {isAuthenticated ? "Generate" : "Sign In"}
            </Link>
            <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="btn-amber text-sm px-5 py-3 rounded-xl text-center">
              {isAuthenticated ? "Go to Dashboard" : "Get Started — Free"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
