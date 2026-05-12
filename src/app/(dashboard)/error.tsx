"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="h-[calc(100vh-2rem)] flex items-center justify-center p-6">
      <div className="lux-card max-w-lg w-full p-10 text-center border border-white/5 bg-gradient-to-br from-secondary/30 to-background/30">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        
        <h2 className="text-2xl font-black tracking-tight text-foreground mb-3" style={{ fontFamily: "var(--font-cabinet)" }}>
          Dashboard glitch detected
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          We encountered an issue loading your workspace. This might be a temporary connection problem.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => reset()}
            className="btn-amber h-11 px-8 rounded-xl font-bold border-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Workspace
          </Button>
          <Button 
            variant="outline" 
            render={<Link href="/dashboard" />}
            className="h-11 px-8 rounded-xl font-bold border-white/10"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
        
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 rounded-lg bg-black/40 border border-white/5 text-left overflow-auto max-h-40">
            <p className="text-[10px] font-mono text-destructive uppercase tracking-widest mb-2 font-bold">Debug Info:</p>
            <p className="text-xs font-mono text-muted-foreground break-all">{error.message}</p>
            {error.stack && <pre className="mt-2 text-[10px] text-muted-foreground/50 font-mono leading-tight">{error.stack}</pre>}
          </div>
        )}
      </div>
    </div>
  );
}
