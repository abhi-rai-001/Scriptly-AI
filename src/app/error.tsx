"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="lux-card max-w-md w-full p-8 text-center space-y-6 border border-white/5 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-destructive/20">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          
          <h2 className="text-2xl font-black tracking-tight text-foreground mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>
            Something went wrong
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            An unexpected error occurred. Our team has been notified.
            {error.digest && <code className="block mt-2 text-[10px] opacity-50 uppercase tracking-widest">Error ID: {error.digest}</code>}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => reset()}
              className="btn-primary h-11 px-6 rounded-xl font-bold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try again
            </Button>
            <Button 
              variant="outline" 
              render={<Link href="/" />}
              className="h-11 px-6 rounded-xl font-bold border-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
