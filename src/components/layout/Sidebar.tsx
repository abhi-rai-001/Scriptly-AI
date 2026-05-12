"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileVideo,
  FolderOpen,
  Settings,
  Sparkles,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Scripts", href: "/scripts", icon: FileVideo },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

const recentProjects = [
  { name: "Tech Reviews", color: "bg-[oklch(0.62_0.24_285)]" },
  { name: "Fitness Vlogs", color: "bg-[oklch(0.72_0.16_160)]" },
  { name: "Finance Shorts", color: "bg-[oklch(0.80_0.18_85)]" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r border-white/5" style={{ background: "oklch(0.14 0.007 285)" }}>
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center border-b border-white/5">
        <Link href="/dashboard" className="inline-flex items-center group">
          <span
            className="text-base font-black tracking-[-0.02em] text-foreground"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Scriptly<span className="gradient-text-violet">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
        {/* Main nav */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-2">
            Menu
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-[oklch(0.62_0.24_285_/_10%)] text-[oklch(0.72_0.20_285)] border border-[oklch(0.62_0.24_285_/_20%)]"
                      : "text-muted-foreground hover:bg-white/4 hover:text-foreground border border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    isActive
                      ? "bg-[oklch(0.62_0.24_285_/_15%)]"
                      : "bg-white/4 group-hover:bg-white/8"
                  )}>
                    <item.icon className={cn(
                      "w-3.5 h-3.5",
                      isActive ? "text-[oklch(0.72_0.20_285)]" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[oklch(0.62_0.24_285)]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
              Recent Projects
            </p>
            <Link href="/projects" className="text-[10px] font-semibold text-[oklch(0.62_0.24_285)] hover:text-[oklch(0.72_0.20_285)] transition-colors">
              All
            </Link>
          </div>
          <nav className="space-y-0.5">
            {recentProjects.map((project) => (
              <Link
                key={project.name}
                href={`/projects/${project.name.toLowerCase().replace(" ", "-")}`}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-white/4 hover:text-foreground transition-all duration-200 group"
              >
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", project.color)} />
                <span className="truncate">{project.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Upgrade card */}
      <div className="p-3 border-t border-white/5">
        <div className="rounded-2xl p-4 relative overflow-hidden border border-[oklch(0.62_0.24_285_/_20%)] group cursor-pointer"
          style={{ background: "oklch(0.62 0.24 285 / 6%)" }}>
          {/* Hover glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.62_0.24_285_/_10%),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[oklch(0.72_0.20_285)]" />
              <span className="text-sm font-bold text-foreground">Pro Plan</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              12 / 100 scripts used this month.
            </p>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full"
                style={{
                  width: "12%",
                  background: "linear-gradient(90deg, oklch(0.62 0.24 285), oklch(0.72 0.20 285))",
                }}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-[oklch(0.62_0.24_285_/_25%)] bg-transparent hover:bg-[oklch(0.62_0.24_285_/_8%)] text-[oklch(0.72_0.20_285)] hover:text-[oklch(0.72_0.20_285)] text-xs h-8 font-semibold"
            >
              <CreditCard className="w-3 h-3 mr-1.5" />
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
