"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, RefreshCw, MapPin, Ruler, DoorOpen, Calendar } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { ResultCards } from "@/components/result-cards";
import { PriceComparisonChart } from "@/components/charts/price-comparison-chart";
import { RegionStatsChart } from "@/components/charts/region-stats-chart";
import { ShareDialog } from "@/components/share-dialog";
import { IstanbulMap } from "@/components/map/istanbul-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValuationResult } from "@/lib/types";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { getDistrictCenter } from "@/lib/istanbul-district-centers";

/**
 * Sonuç Sayfası
 * Değerleme sonuçlarını gösterir
 */

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage'dan sonucu al
    const storedResult = localStorage.getItem("valuationResult");
    
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        // timestamp'i Date objesine çevir
        parsed.timestamp = new Date(parsed.timestamp);
        setResult(parsed);
      } catch (error) {
        console.error("Sonuç parse hatası:", error);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <PageContainer className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </PageContainer>
    );
  }

  // Sonuç yoksa
  if (!result) {
    return (
      <PageContainer className="space-y-6">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Sonuç Bulunamadı</AlertTitle>
          <AlertDescription>
            Henüz bir değerleme yapmadınız veya sonuç süresi doldu.
            Yeni bir analiz yapın.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Link href="/analyze">
            <Button size="lg">
              <RefreshCw className="mr-2 w-4 h-4" />
              Yeni Değerleme Yap
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      {/* Üst Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/analyze">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Geri
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
            Değerleme Sonucu
          </h1>
          <p className="text-zinc-500 text-sm">
            {formatShortDate(result.timestamp)}
          </p>
        </div>

        <div className="flex gap-2">
          <ShareDialog
            fairValue={result.fairValue}
            listingPrice={result.listingPrice}
            diffPercent={result.diffPercent}
            district={result.formData.district}
            neighborhood={result.formData.neighborhood}
          />
          <Link href="/details">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 w-4 h-4" />
              Detaylı Rapor
            </Button>
          </Link>
        </div>
      </div>

      {/* Konut Özeti */}
      <Card className="border-2 border-zinc-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-500">
            Analiz Edilen Konut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="text-sm py-1">
              <MapPin className="w-3 h-3 mr-1" />
              {result.formData.district}, {result.formData.neighborhood}
            </Badge>
            <Badge variant="outline" className="text-sm py-1">
              <Ruler className="w-3 h-3 mr-1" />
              {result.formData.squareMeters} m²
            </Badge>
            <Badge variant="outline" className="text-sm py-1">
              <DoorOpen className="w-3 h-3 mr-1" />
              {result.formData.rooms}
            </Badge>
            <Badge variant="outline" className="text-sm py-1">
              <Calendar className="w-3 h-3 mr-1" />
              {result.formData.buildingAge} yaşında
            </Badge>
            <Badge variant="outline" className="text-sm py-1">
              {result.formData.floor}. kat / {result.formData.totalFloors} kat
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          <TabsTrigger value="summary" className="py-3">
            Özet
          </TabsTrigger>
          <TabsTrigger value="fairvalue" className="py-3">
            Adil Değer
          </TabsTrigger>
          <TabsTrigger value="comparison" className="py-3">
            Karşılaştırma
          </TabsTrigger>
          <TabsTrigger value="region" className="py-3">
            Bölge
          </TabsTrigger>
          <TabsTrigger value="map" className="py-3">
            Harita
          </TabsTrigger>
        </TabsList>

        {/* Özet Tab */}
        <TabsContent value="summary" className="space-y-6">
          <ResultCards result={result} />
        </TabsContent>

        {/* Adil Değer Tab */}
        <TabsContent value="fairvalue" className="space-y-6">
          <Card className="border-2 border-neon-blue/30 bg-neon-blue/5">
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">
                Model Tahmini Adil Değer
              </p>
              <p className="text-5xl md:text-6xl font-bold text-zinc-900">
                {formatCurrency(result.fairValue)}
              </p>
              {result.confidence && (
                <p className="text-sm text-zinc-500">
                  %90 Güven Aralığı: {formatCurrency(result.confidence.lower)} -{" "}
                  {formatCurrency(result.confidence.upper)}
                </p>
              )}
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Önemli Not</AlertTitle>
            <AlertDescription>
              Bu değer, makine öğrenmesi modeli tarafından benzer konutların
              verilerine dayanarak hesaplanmıştır. Kesin bir değerleme değildir
              ve yatırım kararınızı buna dayanarak vermeden önce uzman görüşü
              almanız önerilir.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Karşılaştırma Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <PriceComparisonChart
            fairValue={result.fairValue}
            listingPrice={result.listingPrice}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 border-zinc-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-zinc-500">İlan Fiyatı</p>
                    <p className="text-2xl font-bold text-zinc-900">
                      {formatCurrency(result.listingPrice)}
                    </p>
                  </div>
                  <Badge variant="warning">Talep</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-zinc-100">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-zinc-500">Fark</p>
                    <p className="text-2xl font-bold text-zinc-900">
                      {formatCurrency(Math.abs(result.listingPrice - result.fairValue))}
                    </p>
                  </div>
                  <Badge
                    variant={
                      result.diffPercent < 0
                        ? "success"
                        : result.diffPercent > 10
                        ? "danger"
                        : "warning"
                    }
                  >
                    {result.diffPercent < 0 ? "Ucuz" : result.diffPercent > 10 ? "Pahalı" : "Normal"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bölge Tab */}
        <TabsContent value="region" className="space-y-6">
          <RegionStatsChart
            stats={result.regionStats}
            currentPrice={result.listingPrice}
            fairValue={result.fairValue}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="border-2 border-zinc-100">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-zinc-500">Bölge Minimumu</p>
                <p className="text-xl font-bold text-zinc-900">
                  {formatCurrency(result.regionStats.min)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-zinc-100">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-zinc-500">Bölge Ortalaması</p>
                <p className="text-xl font-bold text-zinc-900">
                  {formatCurrency(result.regionStats.avg)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-zinc-100">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-zinc-500">Bölge Maksimumu</p>
                <p className="text-xl font-bold text-zinc-900">
                  {formatCurrency(result.regionStats.max)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Harita Tab */}
        <TabsContent value="map" className="space-y-6">
          <Card className="border-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Konum (yaklaşık ilçe merkezi)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <IstanbulMap
                markers={[
                  {
                    position: getDistrictCenter(result.formData.district),
                    title: result.formData.district,
                    subtitle: result.formData.neighborhood,
                  },
                ]}
              />
              <p className="text-xs text-muted-foreground">
                Not: Mahalle bazlı koordinat olmadığından, harita işareti ilçe merkezini gösterir.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Aksiyon Butonları */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link href="/analyze" className="flex-1">
          <Button variant="outline" size="lg" className="w-full">
            <RefreshCw className="mr-2 w-4 h-4" />
            Yeni Değerleme
          </Button>
        </Link>
        <Link href="/details" className="flex-1">
          <Button size="lg" className="w-full">
            <FileText className="mr-2 w-4 h-4" />
            Detaylı Analiz
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}

