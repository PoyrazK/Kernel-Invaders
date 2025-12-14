"use client";

import { useEffect, useState } from "react";
import {
  Lightbulb,
  Ruler,
  Calendar,
  Building,
  AlertTriangle,
  BarChart3,
  MapPin,
  Home,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tip, getRandomTip } from "@/lib/quotes";

const iconMap = {
  lightbulb: Lightbulb,
  ruler: Ruler,
  calendar: Calendar,
  building: Building,
  alert: AlertTriangle,
  chart: BarChart3,
  map: MapPin,
  home: Home,
};

interface TipCardProps {
  className?: string;
  tip?: Tip;
  autoRotate?: boolean;
  rotateInterval?: number;
}

/**
 * Eğitici ipucu kartı
 */
export function TipCard({
  className,
  tip: initialTip,
  autoRotate = false,
  rotateInterval = 10000,
}: TipCardProps) {
  const [tip, setTip] = useState<Tip>(initialTip || getRandomTip());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoRotate) return;

    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setTip(getRandomTip());
        setIsVisible(true);
      }, 300);
    }, rotateInterval);

    return () => clearInterval(timer);
  }, [autoRotate, rotateInterval]);

  const Icon = iconMap[tip.icon];

  return (
    <Card
      className={cn(
        "overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent",
        className
      )}
    >
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>

          {/* Content */}
          <div
            className={cn(
              "transition-opacity duration-300",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <p className="text-xs font-medium text-primary mb-1">
              💡 Biliyor muydunuz?
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {tip.text}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
