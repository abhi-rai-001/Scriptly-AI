"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileVideo,
  FolderOpen,
  Settings,
  Zap,
  Sparkles,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Scripts", href: "/scripts", icon: FileVideo },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-white/5">
      {/* Brand Header */}
      <div className="p-6 h-20 flex items-center">
        <Link href="/dashboard" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Scriptly
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="px-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3">
            Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Projects Preview */}
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
              Recent Projects
            </p>
          </div>
          <nav className="space-y-1">
            {["Tech Reviews", "Vlogs", "Shorts"].map((project) => (
              <Link
                key={project}
                href={`/projects/${project.toLowerCase().replace(" ", "-")}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-200"
              >
                <div className="w-2 h-2 rounded-full bg-primary/40" />
                <span className="truncate">{project}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Action (e.g. Upgrade / Credits) */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className="glass rounded-xl p-4 relative overflow-hidden border border-white/10 group">
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">Pro Plan</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            12 / 100 scripts generated this month.
          </p>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-4">
            <div className="h-full bg-primary w-[12%]" />
          </div>
          <Button variant="outline" size="sm" className="w-full border-white/10 bg-background/50 hover:bg-background hover:text-foreground text-xs h-8">
            <CreditCard className="w-3 h-3 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
