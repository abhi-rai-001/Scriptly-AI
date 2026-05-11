import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "/changelog" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Creator Guides", href: "/guides" },
    { label: "API Reference", href: "/api-docs" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Press Kit", href: "/press" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Scriptly<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered script and thumbnail generation for creators who
              publish without limits.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {/* Social links */}
              {["𝕏", "in", "▶"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 glass rounded-lg flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/8">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Scriptly AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40">
            Built for creators. Powered by Gemini AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
