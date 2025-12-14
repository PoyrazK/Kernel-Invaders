"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SplashScreen } from "@/components/splash-screen";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * App Shell - Client wrapper for layout
 * Handles splash screen and main app structure
 */

export function AppShell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem("splashShown");
    
    if (!splashShown) {
      setShowSplash(true);
    } else {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem("splashShown", "true");
  }, []);

  // Fallback: If splash doesn't complete in 5 seconds, force hide it
  useEffect(() => {
    if (showSplash === true) {
      const fallbackTimer = setTimeout(() => {
        console.warn("Splash screen fallback triggered");
        handleSplashComplete();
      }, 5000);
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [showSplash, handleSplashComplete]);

  // Show a minimal loading state while checking sessionStorage
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
