"use client";

import { Search, Plus, Menu, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useGenerationStore } from "@/store/generationStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings as SettingsIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const breadcrumbLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/scripts": "My Scripts",
  "/projects": "Projects",
  "/settings": "Settings",
  "/generate": "New Script",
};

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const resetAll = useGenerationStore((state) => state.resetAll);

  const handleNewScript = (e: React.MouseEvent) => {
    e.preventDefault();
    resetAll();
    router.push("/generate");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const getPageLabel = () => {
    for (const [prefix, label] of Object.entries(breadcrumbLabels)) {
      if (pathname === prefix || pathname.startsWith(prefix + "/")) return label;
    }
    return "Dashboard";
  };

  const pageLabel = getPageLabel();

  return (
    <header className="h-20 border-b border-white/5 sticky top-0 z-30 flex items-center justify-between px-6 backdrop-blur-xl"
      style={{ background: "oklch(0.13 0.006 285 / 90%)" }}>

      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger render={
              <button type="button" className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-colors outline-none">
                <Menu className="w-5 h-5" />
              </button>
            } />
            <SheetContent side="left" className="p-0 w-72 border-r border-white/8 bg-background">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground hidden sm:block">Scriptly</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 hidden sm:block" />
          <h1
            className="text-sm font-bold text-foreground"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            {pageLabel}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex relative w-56 lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search scripts..."
            className="w-full pl-9 bg-secondary/40 border-white/8 focus-visible:ring-[oklch(0.62_0.24_285_/_40%)] text-sm h-9 rounded-xl"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-[10px] text-muted-foreground/50 font-mono bg-white/5 px-1.5 py-0.5 rounded-md border border-white/8">
            ⌘K
          </kbd>
        </div>

        {/* New Script CTA */}
        <button
          onClick={handleNewScript}
          aria-label="Create new script"
          className={cn(
            "btn-amber h-9 px-4 rounded-xl text-sm font-bold inline-flex items-center gap-1.5"
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Script</span>
          <span className="sm:hidden">New</span>
        </button>


        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button type="button" className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.62_0.24_285_/_40%)]">
              <Avatar className="w-9 h-9 border border-white/10 cursor-pointer hover:ring-2 hover:ring-[oklch(0.62_0.24_285_/_30%)] transition-all duration-200 rounded-xl">
                <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=8b5cf6" alt="User" />
                <AvatarFallback className="bg-[oklch(0.62_0.24_285_/_15%)] text-[oklch(0.72_0.20_285)] text-xs font-bold rounded-xl">AM</AvatarFallback>
              </Avatar>
            </button>
          } />
          <DropdownMenuContent align="end" className="w-56 bg-[oklch(0.13_0.006_285)] border-white/10 text-foreground rounded-2xl p-2 mt-1">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-bold text-sm px-3 py-2">My Account</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5 mx-1" />
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 rounded-xl focus:bg-white/5 cursor-pointer">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.push("/settings")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl focus:bg-white/5 cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 text-muted-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5 mx-1" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl focus:bg-red-400/10 text-red-400 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-semibold">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
