"use client";

import { useEffect, useRef } from "react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { ValuationResult, InvestmentAdvice } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Banknote,
  ArrowRight,
  Target,
} from "lucide-react";

interface ResultCardsProps {
  result: ValuationResult;
}

/**
 * Animated Number Component
 */
function AnimatedNumber({ value, format = "currency", className }: { value: number; format?: "currency" | "percent"; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const duration = 2000;
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCounter = () => {
      const now = Date.now();

      if (now >= endTime) {
        element.textContent = format === "currency"
          ? formatCurrency(value)
          : formatPercent(value);
        return;
      }

      const progress = (now - startTime) / duration;
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const currentValue = Math.floor(value * easedProgress);

      element.textContent = format === "currency"
        ? formatCurrency(currentValue)
        : formatPercent(currentValue);

      requestAnimationFrame(updateCounter);
    };

    updateCounter();
  }, [value, format]);

  return <span ref={ref} className={cn("font-bold", className)}>0</span>;
}

/**
 * Sonuç kartları bileşeni
 * Değerleme sonuçlarını görsel olarak sunar
 */
export function ResultCards({ result }: ResultCardsProps) {
  const { fairValue, fairValueMin, fairValueMax, listingPrice, diffPercent, advice } = result;
  
  // Determine colors based on advice
  const isOpportunity = advice === "FIRSAT";
  const isExpensive = advice === "PAHALI";
  
  const accentColor = isOpportunity 
    ? "emerald" 
    : isExpensive 
      ? "red" 
      : "amber";
  
  const gradientClasses = isOpportunity
    ? "from-emerald-500 to-emerald-600"
    : isExpensive
      ? "from-red-500 to-red-600"
      : "from-amber-500 to-amber-600";

  return (
    <div className="space-y-6">
      {/* Ana Karşılaştırma Kartı */}
      <Card className="border-2 border-border overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-0">
          {/* Üst Bölüm - Fiyat Karşılaştırması */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Adil Değer */}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Adil Piyasa Değeri</span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  {formatCurrency(fairValue)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(fairValueMin)} - {formatCurrency(fairValueMax)} aralığında
                </p>
              </div>
            </div>
            
            {/* İlan Fiyatı */}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">İlan Fiyatı</span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  <AnimatedNumber value={listingPrice} format="currency" />
                </p>
                <p className="text-sm text-muted-foreground">Satıcının talep ettiği fiyat</p>
              </div>
            </div>
          </div>
          
          {/* Alt Bölüm - Fark Gösterimi */}
          <div className={cn(
            "p-6 bg-gradient-to-r",
            gradientClasses
          )}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {isOpportunity ? (
                    <TrendingDown className="w-6 h-6 text-white" />
                  ) : isExpensive ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <Minus className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">Fiyat Farkı</p>
                  <p className="text-white text-2xl md:text-3xl font-bold">
                    {diffPercent > 0 ? "+" : ""}{Math.abs(diffPercent).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 md:w-16 bg-white/30" />
                <Badge 
                  className={cn(
                    "text-base px-4 py-2 font-bold",
                    isOpportunity 
                      ? "bg-white text-emerald-600" 
                      : isExpensive 
                        ? "bg-white text-red-600"
                        : "bg-white text-amber-600"
                  )}
                >
                  {advice}
                </Badge>
              </div>
            </div>
            
            {/* Açıklama */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white/90 text-sm md:text-base">
                {isOpportunity 
                  ? `Bu konut, piyasa değerinin %${Math.abs(diffPercent).toFixed(1)} altında fiyatlanmış. Yatırım için değerlendirin!`
                  : isExpensive
                    ? `Bu konut, piyasa değerinin %${Math.abs(diffPercent).toFixed(1)} üzerinde fiyatlanmış. Pazarlık yapmanız önerilir.`
                    : "Bu konut, piyasa değerine yakın fiyatlanmış. Detaylı inceleme yapın."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Görsel Karşılaştırma Barı */}
      <Card className="border-2 border-border animate-in slide-in-from-bottom-4 duration-500 delay-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Görsel Karşılaştırma
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Adil Değer Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Adil Değer</span>
              <span className="font-semibold">{formatCurrency(fairValue)}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (fairValue / Math.max(fairValue, listingPrice)) * 100)}%` }}
              />
            </div>
          </div>
          
          {/* İlan Fiyatı Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">İlan Fiyatı</span>
              <span className="font-semibold">{formatCurrency(listingPrice)}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  isOpportunity 
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    : isExpensive
                      ? "bg-gradient-to-r from-red-400 to-red-500"
                      : "bg-gradient-to-r from-amber-400 to-amber-500"
                )}
                style={{ width: `${Math.min(100, (listingPrice / Math.max(fairValue, listingPrice)) * 100)}%` }}
              />
            </div>
          </div>
          
          {/* Fark Göstergesi */}
          <div className={cn(
            "flex items-center justify-center gap-2 py-3 rounded-xl",
            isOpportunity 
              ? "bg-emerald-50 dark:bg-emerald-950/30"
              : isExpensive
                ? "bg-red-50 dark:bg-red-950/30"
                : "bg-amber-50 dark:bg-amber-950/30"
          )}>
            <span className={cn(
              "text-sm font-medium",
              isOpportunity 
                ? "text-emerald-700 dark:text-emerald-300"
                : isExpensive
                  ? "text-red-700 dark:text-red-300"
                  : "text-amber-700 dark:text-amber-300"
            )}>
              {formatCurrency(Math.abs(listingPrice - fairValue))} fark
            </span>
            <ArrowRight className={cn(
              "w-4 h-4",
              isOpportunity 
                ? "text-emerald-500 rotate-[-45deg]"
                : isExpensive
                  ? "text-red-500 rotate-45"
                  : "text-amber-500"
            )} />
            <span className={cn(
              "text-sm font-bold",
              isOpportunity 
                ? "text-emerald-700 dark:text-emerald-300"
                : isExpensive
                  ? "text-red-700 dark:text-red-300"
                  : "text-amber-700 dark:text-amber-300"
            )}>
              {isOpportunity ? "Tasarruf" : isExpensive ? "Fazla Ödeme" : "Makul"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}