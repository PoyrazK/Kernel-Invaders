"use client";

import { Star, MapPin, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Testimonial } from "@/lib/quotes";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

/**
 * Kullanıcı yorumu kartı
 */
export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      <CardContent className="p-6">
        {/* Rating */}
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < testimonial.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              )}
            />
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm md:text-base text-foreground leading-relaxed mb-6">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Author info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {testimonial.avatar}
            </div>

            <div>
              <p className="font-medium text-foreground text-sm">
                {testimonial.author}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {testimonial.location}
              </p>
            </div>
          </div>

          {/* Savings badge */}
          {testimonial.savings && (
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-medium">
              <Wallet className="w-3.5 h-3.5" />
              {testimonial.savings}
            </div>
          )}
        </div>
      </CardContent>

      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  );
}
