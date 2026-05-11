"use client";

import { Search, Plus, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "./SidebarContent";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Topbar() {
  const pathname = usePathname();

  // Simple breadcrumb logic based on pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/scripts")) return "My Scripts";
    if (pathname.startsWith("/projects")) return "Projects";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/generate")) return "New Script";
    return "Dashboard";
  };

  return (
    <header className="h-20 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" />}
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 border-r border-white/10 bg-background">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Page Title */}
        <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-syne)" }}>
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search scripts..."
            className="w-full pl-9 bg-secondary/30 border-white/10 focus-visible:ring-primary/50 text-sm h-10"
          />
        </div>

        {/* New Script Button */}
        <Link
          href="/generate"
          className={cn(
            buttonVariants({ className: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary h-10 px-4" })
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">New Script</span>
          <span className="sm:hidden">New</span>
        </Link>

        {/* User Menu */}
        <Avatar className="w-10 h-10 border border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=8b5cf6" alt="User" />
          <AvatarFallback className="bg-primary/20 text-primary">AM</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
