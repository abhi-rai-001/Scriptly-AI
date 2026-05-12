"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Timer, Rocket, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[oklch(0.62_0.24_285_/_5%)] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[oklch(0.72_0.16_160_/_5%)] rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.62_0.24_285_/_10%)] border border-[oklch(0.62_0.24_285_/_20%)] text-[oklch(0.72_0.20_285)] text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Coming Soon
          </div>

          <h1 
            className="text-6xl md:text-8xl font-black tracking-[-0.05em] text-foreground mb-6"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            404 <span className="gradient-text-amber">&</span> <br />
            Discovery.
          </h1>

          <p className="text-lg text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
            The page you're looking for doesn't exist yet, but something incredible is being built right here. Stay tuned for new AI features.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-16">
            <div className="lux-card p-6 rounded-2xl text-left border border-white/5 bg-white/[0.02]">
              <Timer className="w-6 h-6 text-[oklch(0.72_0.20_285)] mb-3" />
              <h3 className="font-bold text-sm mb-1">In Development</h3>
              <p className="text-xs text-muted-foreground">Our engineers are shipping new modules every week.</p>
            </div>
            <div className="lux-card p-6 rounded-2xl text-left border border-white/5 bg-white/[0.02]">
              <Rocket className="w-6 h-6 text-amber-400 mb-3" />
              <h3 className="font-bold text-sm mb-1">Early Access</h3>
              <p className="text-xs text-muted-foreground">Pro members get first look at experimental tools.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              render={<Link href="/dashboard" />}
              className="h-12 px-8 btn-amber border-0 rounded-xl font-bold text-base min-w-[200px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="ghost" className="h-12 px-8 text-muted-foreground hover:text-foreground rounded-xl">
              <Mail className="w-4 h-4 mr-2" />
              Notify Me
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
          Scriptly AI Engine v2.5 · Obsidian Lux Design
        </p>
      </div>
    </div>
  );
}
