"use client";

import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { testimonials } from "@/lib/quotes";
import { TestimonialCard } from "./testimonial-card";

interface TestimonialsSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

/**
 * Kullanıcı yorumları bölümü
 */
export function TestimonialsSection({
  className,
  title = "Kullanıcılarımız Ne Diyor?",
  subtitle = "Binlerce kullanıcı Metrekare ile doğru fiyatı buldu",
  maxItems = 3,
}: TestimonialsSectionProps) {
  const displayTestimonials = testimonials.slice(0, maxItems);

  return (
    <section className={cn("py-8 md:py-12", className)}>
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Users className="w-4 h-4" />
          <span>Gerçek Kullanıcı Deneyimleri</span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
          {title}
        </h2>

        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            testimonial={testimonial}
            className="animate-in fade-in slide-in-from-bottom-4"
          />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 md:mt-12 pt-8 border-t">
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-primary">10K+</p>
          <p className="text-xs md:text-sm text-muted-foreground">Analiz Yapıldı</p>
        </div>
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-primary">₺2M+</p>
          <p className="text-xs md:text-sm text-muted-foreground">Tasarruf Sağlandı</p>
        </div>
        <div className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-primary">4.9/5</p>
          <p className="text-xs md:text-sm text-muted-foreground">Kullanıcı Puanı</p>
        </div>
      </div>
    </section>
  );
}
