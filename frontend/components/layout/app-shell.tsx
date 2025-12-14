"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SplashScreen } from "@/components/splash-screen";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * App Shell - Client wrapper for layout
 * Handles splash screen and main app structure
 */

export function AppShell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("splashShown", "true");
  };

  // Show a minimal loading state instead of null to prevent blank screen
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <span className="text-4xl font-semibold text-foreground">m</span>
          <span className="text-2xl text-muted-foreground align-super">²</span>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div
        className={`transition-opacity duration-300 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
        <Header />
        {children}
        <BottomNav />
      </div>
    </TooltipProvider>
  );
}
