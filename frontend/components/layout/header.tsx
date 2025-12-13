"use client";

import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import logo from "@/assets/logo2.png";

/**
 * Liquid Glass Header
 * Floating topbar with glass morphism effect
 */

export function Header() {
  const today = new Date();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <header className="w-full max-w-5xl pointer-events-auto">
        {/* Liquid Glass Container */}
        <div className="relative group">
          {/* Ambient Shadow */}
          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 blur-2xl translate-y-2 rounded-[2rem]" />
          
          {/* Glass Surface */}
          <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl backdrop-saturate-150 rounded-[2rem] border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {/* Inner Highlight (top edge reflection) */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent rounded-t-[2rem]" />
            
            {/* Specular Streak (light reflection) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 rounded-[2rem] opacity-60" />
            
            {/* Content */}
            <div className="relative px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Left: Theme Toggle */}
                <div className="flex items-center">
                  <ThemeToggle />
                </div>

                {/* Center: Logo */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src={logo}
                    alt="Metrekare Logo"
                    width={64}
                    height={64}
                    className="rounded-2xl transition-transform duration-300 hover:scale-105"
                    priority
                  />
                </div>

                {/* Right: Date */}
                <div className="flex items-center">
                  <time className="text-sm font-medium text-foreground/80 tracking-tight whitespace-nowrap">
                    {formatDate(today)}
                  </time>
                </div>
              </div>
            </div>
            
            {/* Bottom Depth Line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent" />
          </div>
        </div>
      </header>
    </div>
  );
}

