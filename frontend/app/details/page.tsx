"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Info, BookOpen, Calculator, TrendingUp, ShieldCheck } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ValuationResult } from "@/lib/types";
import { formatCurrency, formatShortDate } from "@/lib/utils";

/**
 * Detaylı Analiz Sayfası
 * Akademik hissiyat: model varsayımları, değişkenler, güven aralığı
 */

export default function DetailsPage() {
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedResult = localStorage.getItem("valuationResult");

    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        parsed.timestamp = new Date(parsed.timestamp);
        setResult(parsed);
      } catch (error) {
        console.error("Sonuç parse hatası:", error);
      }
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <PageContainer className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </PageContainer>
    );
  }

  if (!result) {
    return (
      <PageContainer className="space-y-6">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Sonuç Bulunamadı</AlertTitle>
          <AlertDescription>
            Detaylı analiz için önce bir değerleme yapmanız gerekiyor.
          </AlertDescription>
        </Alert>
        <Link href="/analyze">
          <Button>Değerleme Yap</Button>
        </Link>
      </PageContainer>
    );
  }

  // Kullanılan değişkenler
  const variables = [
    { name: "Konum", value: `${result.formData.district}, ${result.formData.neighborhood}`, weight: "Yüksek" },
    { name: "Metrekare", value: `${result.formData.squareMeters} m²`, weight: "Yüksek" },
    { name: "Oda Sayısı", value: result.formData.rooms, weight: "Orta" },
    { name: "Bina Yaşı", value: `${result.formData.buildingAge} yıl`, weight: "Orta" },
    { name: "Kat", value: `${result.formData.floor} / ${result.formData.totalFloors}`, weight: "Düşük" },
    { name: "Durum", value: result.formData.status, weight: "Düşük" },
  ];

  return (
    <PageContainer className="space-y-16">
      {/* Üst Bar */}
      <div className="space-y-2">
        <Link href="/result">
          <Button variant="ghost" size="sm" className="gap-1 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Sonuçlara Dön
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
          Detaylı Analiz Raporu
        </h1>
        <p className="text-zinc-500">
          {formatShortDate(result.timestamp)} tarihli değerleme
        </p>
      </div>

      {/* Uyarı Banner */}
      <Alert variant="warning" className="border-2">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-base">Önemli Uyarı</AlertTitle>
        <AlertDescription className="text-sm">
          Bu rapordaki değerler, makine öğrenmesi modeli tarafından üretilen
          <strong> tahminlerdir</strong>. Kesin değerleme için bir emlak
          değerleme uzmanına danışmanız önerilir. Model çıktıları yatırım
          tavsiyesi niteliği taşımaz.
        </AlertDescription>
      </Alert>

      {/* Özet Kartı */}
      <Card className="border-2 border-zinc-200 mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-neon-blue" />
            Değerleme Özeti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-zinc-50 rounded-2xl">
              <p className="text-sm text-zinc-500 mb-1">Yatırım Değerlendirmesi</p>
              <p className="text-lg font-bold text-zinc-900">
                {formatCurrency(result.fairValueMin || result.confidence?.lower || result.fairValue * 0.95)}
                {" - "}
                {formatCurrency(result.fairValueMax || result.confidence?.upper || result.fairValue * 1.05)}
              </p>
              <p className="text-xs text-zinc-400 mt-1">±%5 aralık</p>
            </div>
            <div className="text-center p-4 bg-zinc-50 rounded-2xl">
              <p className="text-sm text-zinc-500 mb-1">İlan Fiyatı</p>
              <p className="text-2xl font-bold text-zinc-900">
                {formatCurrency(result.listingPrice)}
              </p>
            </div>
            <div className="text-center p-4 bg-zinc-50 rounded-2xl">
              <p className="text-sm text-zinc-500 mb-1">Sonuç</p>
              <Badge
                variant={
                  result.advice === "FIRSAT"
                    ? "success"
                    : result.advice === "PAHALI"
                      ? "danger"
                      : "warning"
                }
                className="text-lg px-4 py-1"
              >
                {result.advice}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Güven Aralığı */}
      {result.confidence && (() => {
        // Determine color based on advice
        const barColor = result.advice === "FIRSAT" 
          ? "from-emerald-500 to-emerald-400" 
          : result.advice === "PAHALI" 
            ? "from-red-500 to-red-400" 
            : "from-amber-500 to-amber-400";
        const dotColor = result.advice === "FIRSAT" 
          ? "bg-emerald-500" 
          : result.advice === "PAHALI" 
            ? "bg-red-500" 
            : "bg-amber-500";
        const textColor = result.advice === "FIRSAT" 
          ? "text-emerald-600 dark:text-emerald-400" 
          : result.advice === "PAHALI" 
            ? "text-red-600 dark:text-red-400" 
            : "text-amber-600 dark:text-amber-400";
        const badgeBg = result.advice === "FIRSAT" 
          ? "bg-emerald-500/10 dark:bg-emerald-500/20" 
          : result.advice === "PAHALI" 
            ? "bg-red-500/10 dark:bg-red-500/20" 
            : "bg-amber-500/10 dark:bg-amber-500/20";
        
        return (
        <Card className="border-2 border-zinc-200 overflow-hidden mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-neon-green" />
              Güven Aralığı
            </CardTitle>
            <CardDescription>
              Model tahmininin %90 olasılıkla bulunacağı aralık
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              {/* Gauge-style visualization */}
              <div className="relative">
                {/* Background arc representation */}
                <div className="flex items-end justify-center gap-1 h-24">
                  {/* Left bars - below estimate */}
                  <div className="flex items-end gap-0.5">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={`left-${i}`}
                        className="w-3 sm:w-4 rounded-t-sm bg-gradient-to-t from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600"
                        style={{ height: `${20 + i * 8}px` }}
                      />
                    ))}
                  </div>
                  
                  {/* Center bar - the estimate */}
                  <div className="relative">
                    <div
                      className={`w-4 sm:w-5 rounded-t-md bg-gradient-to-t ${barColor} shadow-lg`}
                      style={{ height: '96px' }}
                    />
                    <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 ${dotColor} rounded-full border-2 border-white dark:border-zinc-900 shadow-md`} />
                  </div>
                  
                  {/* Right bars - above estimate */}
                  <div className="flex items-end gap-0.5">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={`right-${i}`}
                        className="w-3 sm:w-4 rounded-t-sm bg-gradient-to-t from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600"
                        style={{ height: `${84 - i * 8}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Labels underneath the gauge */}
                <div className="flex justify-between items-start mt-4 px-2">
                  <div className="text-center flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Alt Sınır</p>
                    <p className="text-sm sm:text-base font-bold text-foreground mt-1">
                      {formatCurrency(result.confidence.lower)}
                    </p>
                  </div>
                  <div className="text-center flex-1 -mt-2">
                    <div className={`inline-flex items-center gap-1 ${badgeBg} px-3 py-1 rounded-full`}>
                      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span className={`text-xs font-semibold ${textColor}`}>TAHMİN</span>
                    </div>
                    <p className={`text-lg sm:text-xl font-bold ${textColor} mt-1`}>
                      {formatCurrency(result.fairValue)}
                    </p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Üst Sınır</p>
                    <p className="text-sm sm:text-base font-bold text-foreground mt-1">
                      {formatCurrency(result.confidence.upper)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Gerçek piyasa değerinin bu aralıkta olma olasılığı <span className="font-semibold text-foreground">%90</span>'dır. 
                  Aralık genişliği, tahmin belirsizliğini yansıtır.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        );
      })()}

      {/* Kullanılan Değişkenler */}
      <Card className="border-2 border-zinc-200 overflow-hidden mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon-yellow" />
            Kullanılan Değişkenler
          </CardTitle>
          <CardDescription>
            Model tahmininde kullanılan konut özellikleri ve etki düzeyleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {variables.map((variable) => {
              const impactPercent = variable.weight === "Yüksek" ? 90 : variable.weight === "Orta" ? 60 : 30;
              const impactColor = variable.weight === "Yüksek" 
                ? "bg-emerald-500" 
                : variable.weight === "Orta" 
                  ? "bg-amber-500" 
                  : "bg-zinc-400";
              const impactBgColor = variable.weight === "Yüksek" 
                ? "bg-emerald-500/10" 
                : variable.weight === "Orta" 
                  ? "bg-amber-500/10" 
                  : "bg-zinc-500/10";
              
              return (
                <div
                  key={variable.name}
                  className="group"
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{variable.name}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{variable.value}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${impactBgColor} ${
                      variable.weight === "Yüksek" 
                        ? "text-emerald-700 dark:text-emerald-400" 
                        : variable.weight === "Orta" 
                          ? "text-amber-700 dark:text-amber-400" 
                          : "text-zinc-600 dark:text-zinc-400"
                    }`}>
                      {variable.weight}
                    </span>
                  </div>
                  
                  {/* Impact bar */}
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`absolute inset-y-0 left-0 ${impactColor} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${impactPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Yüksek Etki</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">Orta Etki</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-400" />
              <span className="text-xs text-muted-foreground">Düşük Etki</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Varsayımları */}
      <Card className="border-2 border-zinc-200 mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neon-pink" />
            Neden Metrekare?
          </CardTitle>
          <CardDescription>
            Modelimizi güçlü kılan temel özellikler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "27.000+ Gerçek Veri",
                description:
                  "Modelimiz İstanbul'daki 27.000'den fazla gerçek emlak ilanı verisiyle eğitildi. Sahte veya tahmini veri yok, sadece piyasadan toplanan güncel veriler.",
              },
              {
                title: "LightGBM Makine Öğrenmesi",
                description:
                  "Gradient boosting tabanlı LightGBM algoritması kullanıyoruz. Bu model, karmaşık fiyat ilişkilerini yakalayarak %96 doğruluk oranı sağlıyor.",
              },
              {
                title: "Bölgesel Fiyat Analizi",
                description:
                  "Sadece genel tahmin değil, ilçe ve mahalle bazında ortalama fiyatları, m² değerlerini ve piyasa trendlerini de görüyorsunuz.",
              },
              {
                title: "Anlık Sonuç",
                description:
                  "Emlakçıya gitmenize gerek yok. 3 adımda, saniyeler içinde evinizin adil piyasa değerini öğrenin ve fırsat mı pahalı mı hemen görün.",
              },
            ].map((assumption, index) => (
              <div
                key={assumption.title}
                className="p-4 border border-zinc-200 rounded-xl space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-zinc-900">
                    {assumption.title}
                  </h4>
                </div>
                <p className="text-sm text-zinc-600 pl-8">
                  {assumption.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yasal Uyarı */}
      <Card className="border-2 border-zinc-300 bg-zinc-50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Info className="w-6 h-6 text-zinc-500 shrink-0 mt-1" />
            <div className="space-y-2">
              <h4 className="font-semibold text-zinc-900">Yasal Uyarı</h4>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Bu değerleme raporu, yalnızca bilgilendirme amaçlı hazırlanmıştır
                ve herhangi bir yatırım tavsiyesi niteliği taşımaz. Metrekare,
                bu raporda yer alan bilgilerin doğruluğu, eksiksizliği veya
                güncelliği konusunda herhangi bir garanti vermez. Emlak alım
                satım kararlarınızda profesyonel danışmanlık hizmeti almanız
                önerilir. Metrekare, bu rapora dayanılarak alınan kararlardan
                doğabilecek zararlardan sorumlu tutulamaz.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alt Aksiyon */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link href="/result" className="flex-1">
          <Button variant="outline" size="lg" className="w-full">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Sonuçlara Dön
          </Button>
        </Link>
        <Link href="/analyze" className="flex-1">
          <Button size="lg" className="w-full">
            Yeni Değerleme Yap
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}

