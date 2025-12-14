"use client";

import { useEffect, useState } from "react";
import { Quote as QuoteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Quote, motivationalQuotes } from "@/lib/quotes";

interface QuoteBannerProps {
  className?: string;
  interval?: number; // ms
  quotes?: Quote[];
}

/**
 * Otomatik değişen motivasyonel alıntı banner'ı
 */
export function QuoteBanner({
  className,
  interval = 6000,
  quotes = motivationalQuotes,
}: QuoteBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // Change quote after fade out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, quotes.length]);

  const currentQuote = quotes[currentIndex];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

      <div className="relative">
        {/* Quote icon */}
        <QuoteIcon className="w-8 h-8 text-primary/40 mb-4" />

        {/* Quote text */}
        <blockquote
          className={cn(
            "text-lg md:text-xl lg:text-2xl font-medium text-foreground leading-relaxed transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          &ldquo;{currentQuote.text}&rdquo;
        </blockquote>

        {/* Author */}
        <cite
          className={cn(
            "block mt-4 text-sm md:text-base text-muted-foreground not-italic transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          — {currentQuote.author}
        </cite>

        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-6">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsVisible(true);
                }, 300);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-primary/30 hover:bg-primary/50"
              )}
              aria-label={`Alıntı ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
