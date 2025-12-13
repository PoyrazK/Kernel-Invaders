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
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Banknote,
  Scale,
  Percent,
} from "lucide-react";

interface ResultCardsProps {
  result: ValuationResult;
}

/**
 * Animated Number Component
 */
function AnimatedNumber({ value, format = "currency" }: { value: number; format?: "currency" | "percent" }) {
  const ref = useRef<HTMLParagraphElement>(null);

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

  return <p ref={ref} className="text-3xl font-bold text-foreground">0</p>;
}

/**
 * Sonuç kartları bileşeni
 * Değerleme sonuçlarını görsel olarak sunar
 */
export function ResultCards({ result }: ResultCardsProps) {
  const { fairValue, fairValueMin, fairValueMax, listingPrice, diffPercent, advice } = result;

  return (
    <div className="space-y-6">
      {/* Üst Kartlar - 3'lü Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Adil Değer Kartı - Aralık gösterimi */}
        <Card className="border-2 border-neon-blue/30 bg-neon-blue/5 dark:bg-neon-blue/10 animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Scale className="w-4 h-4 text-neon-blue" />
              Model Tahmini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(fairValueMin)}
                </p>
                <span className="text-muted-foreground">-</span>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(fairValueMax)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Adil Piyasa Değeri (±%5 aralık)</p>
            </div>
          </CardContent>
        </Card>

        {/* İlan Fiyatı Kartı */}
        <Card className="border-2 border-neon-yellow/30 bg-neon-yellow/5 dark:bg-neon-yellow/10 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Banknote className="w-4 h-4 text-neon-yellow" />
              İlan Fiyatı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <AnimatedNumber value={listingPrice} format="currency" />
              <p className="text-sm text-muted-foreground">Satıcı Talebi</p>
            </div>
          </CardContent>
        </Card>

        {/* Fark Kartı */}
        <Card
          className={cn(
            "border-2 animate-in slide-in-from-bottom-4 duration-500 delay-200",
            diffPercent < 0
              ? "border-neon-green/30 bg-neon-green/5 dark:bg-neon-green/10"
              : diffPercent > 10
                ? "border-neon-red/30 bg-neon-red/5 dark:bg-neon-red/10"
                : "border-border bg-secondary"
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Fark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {diffPercent < 0 ? (
                  <TrendingDown className="w-6 h-6 text-neon-green" />
                ) : diffPercent > 0 ? (
                  <TrendingUp className="w-6 h-6 text-neon-red" />
                ) : (
                  <Minus className="w-6 h-6 text-muted-foreground" />
                )}
                <AnimatedNumber value={diffPercent} format="percent" />
              </div>
              <p className="text-sm text-muted-foreground">
                {diffPercent < 0 ? "Değerin altında" : diffPercent > 0 ? "Değerin üstünde" : "Değere eşit"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yatırım Tavsiyesi Kartı */}
      <AdviceCard advice={advice} diffPercent={diffPercent} />
    </div>
  );
}

/**
 * Yatırım tavsiyesi kartı
 */
interface AdviceCardProps {
  advice: InvestmentAdvice;
  diffPercent: number;
}

function AdviceCard({ advice, diffPercent }: AdviceCardProps) {
  const config = getAdviceConfig(advice);

  return (
    <Card
      className={cn(
        "border-4 overflow-hidden transition-all animate-in slide-in-from-bottom-8 duration-700 delay-300",
        config.borderColor,
        config.bgColor
      )}
    >
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* İkon */}
          <div
            className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 animate-in zoom-in-50 duration-500 delay-500",
              config.iconBg,
              config.glowClass
            )}
          >
            <config.icon className={cn("w-10 h-10", config.iconColor)} />
          </div>

          {/* İçerik */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <Badge
                variant={config.badgeVariant}
                className="text-lg px-4 py-1"
              >
                {advice}
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {config.title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {getAdviceDescription(advice, diffPercent)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Tavsiye tipine göre konfigürasyon
 */
function getAdviceConfig(advice: InvestmentAdvice) {
  switch (advice) {
    case "FIRSAT":
      return {
        icon: CheckCircle2,
        borderColor: "border-neon-green",
        bgColor: "bg-neon-green/10",
        iconBg: "bg-neon-green",
        iconColor: "text-zinc-900",
        glowClass: "neon-green-glow",
        badgeVariant: "success" as const,
        title: "Bu Konut Değerli Bir Fırsat!",
      };
    case "NORMAL":
      return {
        icon: AlertTriangle,
        borderColor: "border-neon-yellow",
        bgColor: "bg-neon-yellow/10",
        iconBg: "bg-neon-yellow",
        iconColor: "text-zinc-900",
        glowClass: "neon-yellow-glow",
        badgeVariant: "warning" as const,
        title: "Fiyat Piyasa Değerine Yakın",
      };
    case "PAHALI":
      return {
        icon: XCircle,
        borderColor: "border-neon-red",
        bgColor: "bg-neon-red/10",
        iconBg: "bg-neon-red",
        iconColor: "text-white",
        glowClass: "neon-red-glow",
        badgeVariant: "danger" as const,
        title: "Bu Fiyat Piyasa Değerinin Üstünde",
      };
  }
}

/**
 * Tavsiye açıklama metni
 */
function getAdviceDescription(advice: InvestmentAdvice, diffPercent: number): string {
  const absDiff = Math.abs(diffPercent).toFixed(1);

  switch (advice) {
    case "FIRSAT":
      return `Bu konut, benzer özelliklerdeki emsallere göre %${absDiff} daha düşük fiyatlanmış. Yatırım için uygun görünüyor.`;
    case "NORMAL":
      return `Bu konut, piyasa değerine yakın fiyatlanmış. Detaylı inceleme ve pazarlık ile makul bir alım yapılabilir.`;
    case "PAHALI":
      return `Bu konut, benzer özelliklerdeki emsallere göre %${absDiff} daha pahalı. Satıcıyla pazarlık yapmanız önerilir.`;
  }
}

