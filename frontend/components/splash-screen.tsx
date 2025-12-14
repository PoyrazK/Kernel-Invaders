"use client";

import { useState, useEffect } from "react";

/**
 * Splash Screen
 * "m²" animates into "metre²"
 * Montserrat for "m" and "metre"
 * Instrument Serif for "²"
 */

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start expansion animation after a short delay
    const expandTimer = setTimeout(() => {
      setIsExpanded(true);
    }, 400);

    // Start fade out after animation completes
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Complete and unmount
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative inline-block overflow-visible">
        {/* "metre" text */}
        <span
          className="text-6xl md:text-8xl font-semibold text-foreground inline-flex items-baseline leading-none"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          m
          <span
            className={`inline-block overflow-hidden transition-all duration-1000 ease-out whitespace-nowrap ${
              isExpanded ? "max-w-[3em]" : "max-w-0"
            }`}
          >
            <span className={`transition-opacity duration-700 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
              etre
            </span>
          </span>
        </span>
        {/* Superscript "2" with Gloock */}
        <span
          className="text-3xl md:text-5xl absolute -top-1 md:-top-2 overflow-visible"
          style={{ 
            fontFamily: "var(--font-gloock)",
            background: "linear-gradient(90deg, #a1a1aa, #52525b)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            lineHeight: 1
          }}
        >
          2
        </span>
      </div>
    </div>
  );
}
