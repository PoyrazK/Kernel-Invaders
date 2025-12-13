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
    <PageContainer className="space-y-8">
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
      <Card className="border-2 border-zinc-200">
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
      {result.confidence && (
        <Card className="border-2 border-zinc-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-neon-green" />
              Güven Aralığı
            </CardTitle>
            <CardDescription>
              Model tahmininin %90 olasılıkla bulunacağı aralık
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Görsel güven aralığı */}
              <div className="relative h-16 bg-zinc-100 rounded-2xl overflow-hidden">
                {/* Alt ve üst sınır çizgileri */}
                <div className="absolute inset-y-0 left-0 w-1 bg-zinc-400" />
                <div className="absolute inset-y-0 right-0 w-1 bg-zinc-400" />

                {/* Güven bandı */}
                <div
                  className="absolute inset-y-2 bg-neon-blue/30 rounded-xl"
                  style={{
                    left: "10%",
                    right: "10%",
                  }}
                />

                {/* Nokta tahmin */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-neon-blue rounded-full border-2 border-white shadow-lg"
                  style={{
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              {/* Değerler */}
              <div className="flex justify-between text-sm">
                <div className="text-left">
                  <p className="text-zinc-500">Alt Sınır</p>
                  <p className="font-bold text-zinc-900">
                    {formatCurrency(result.confidence.lower)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-zinc-500">Tahmin</p>
                  <p className="font-bold text-neon-blue">
                    {formatCurrency(result.fairValue)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500">Üst Sınır</p>
                  <p className="font-bold text-zinc-900">
                    {formatCurrency(result.confidence.upper)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kullanılan Değişkenler */}
      <Card className="border-2 border-zinc-200">
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
          <div className="space-y-3">
            {variables.map((variable, index) => (
              <div
                key={variable.name}
                className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-200 rounded-lg flex items-center justify-center text-sm font-bold text-zinc-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">{variable.name}</p>
                    <p className="text-sm text-zinc-500">{variable.value}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    variable.weight === "Yüksek"
                      ? "success"
                      : variable.weight === "Orta"
                        ? "warning"
                        : "secondary"
                  }
                >
                  {variable.weight} Etki
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Varsayımları */}
      <Card className="border-2 border-zinc-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neon-pink" />
            Model Varsayımları
          </CardTitle>
          <CardDescription>
            Değerleme modelinin dayandığı temel varsayımlar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Piyasa Etkinliği",
                description:
                  "Model, İstanbul emlak piyasasının yarı-etkin olduğunu ve fiyatların genel olarak mevcut bilgiyi yansıttığını varsayar.",
              },
              {
                title: "Karşılaştırılabilir Satışlar",
                description:
                  "Değerleme, benzer özelliklere sahip konutların yakın zamandaki satış verilerine dayanır. Özel durumlar (acil satış, tapu sorunları vb.) dikkate alınmamıştır.",
              },
              {
                title: "Makroekonomik Sabitlik",
                description:
                  "Model, değerleme tarihindeki ekonomik koşulların kısa vadede önemli ölçüde değişmeyeceğini varsayar.",
              },
              {
                title: "Veri Kalitesi",
                description:
                  "Tahminler, kullanıcının girdiği verilerin doğruluğuna bağlıdır. Hatalı veri girişi yanıltıcı sonuçlara yol açabilir.",
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

