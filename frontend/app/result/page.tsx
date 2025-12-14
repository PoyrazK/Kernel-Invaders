"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  FileText, 
  RefreshCw, 
  MapPin, 
  Ruler, 
  DoorOpen, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Pencil,
  Loader2,
  Building2,
  Layers,
  Home,
  Banknote
} from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { OpportunitiesSection } from "@/components/opportunities-section";
import { ValuationResult, ValuationFormData, PropertyStatus, OpportunityItem } from "@/lib/types";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { getDistrictCenter } from "@/lib/istanbul-district-centers";
import { ISTANBUL_DISTRICTS, ROOM_OPTIONS, predictValue, parseRooms } from "@/lib/api";
import { addToHistory } from "@/lib/storage";

/**
 * Sonuç Sayfası
 * Değerleme sonuçlarını gösterir
 */

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState<ValuationFormData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  useEffect(() => {
    // localStorage'dan sonucu al
    const storedResult = localStorage.getItem("valuationResult");

    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        // timestamp'i Date objesine çevir
        parsed.timestamp = new Date(parsed.timestamp);
        setResult(parsed);
        // Initialize edit form with current values
        setEditForm(parsed.formData);
        setSelectedDistrict(parsed.formData.district);
      } catch (error) {
        console.error("Sonuç parse hatası:", error);
      }
    }

    setIsLoading(false);
  }, []);

  // Get neighborhoods for selected district
  const neighborhoods = selectedDistrict
    ? ISTANBUL_DISTRICTS.find((d) => d.name === selectedDistrict)?.neighborhoods || []
    : [];

  // Handle district change
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    if (editForm) {
      setEditForm({ ...editForm, district, neighborhood: "" });
    }
  };

  // Handle re-analysis
  const handleReanalyze = async () => {
    if (!editForm) return;
    
    setIsReanalyzing(true);
    try {
      const newResult = await predictValue(editForm);
      
      // Save to localStorage
      localStorage.setItem("valuationResult", JSON.stringify(newResult));
      
      // Add to history
      addToHistory(newResult);
      
      // Update state
      setResult(newResult);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Re-analysis error:", error);
    } finally {
      setIsReanalyzing(false);
    }
  };

  // Handle opportunity analysis - analyze clicked opportunity and show result
  const handleOpportunityAnalyze = async (opportunity: OpportunityItem) => {
    setIsLoading(true);
    try {
      // Convert opportunity to form data format
      const opportunityFormData: ValuationFormData = {
        district: opportunity.district,
        neighborhood: opportunity.neighborhood,
        squareMeters: opportunity.m2,
        rooms: `${opportunity.rooms}+1`, // Convert number to string format
        buildingAge: opportunity.buildingAge || 5,
        floor: opportunity.floor || 3,
        totalFloors: 6, // Default
        status: "Boş" as PropertyStatus,
        listingPrice: opportunity.price,
      };

      // Get new prediction for this opportunity
      const newResult = await predictValue(opportunityFormData);
      
      // Save to localStorage
      localStorage.setItem("valuationResult", JSON.stringify(newResult));
      
      // Add to history
      addToHistory(newResult);
      
      // Update state with new result
      setResult(newResult);
      setEditForm(opportunityFormData);
      setSelectedDistrict(opportunity.district);
      
      // Scroll to top to show new result
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Opportunity analysis error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Konut Özeti - Collapsible Edit Panel */}
      <Card className="border-2 border-zinc-100 overflow-hidden">
        <Collapsible open={isEditOpen} onOpenChange={setIsEditOpen}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-zinc-500">
                Analiz Edilen Konut
              </CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Pencil className="w-4 h-4" />
                  {isEditOpen ? "Kapat" : "Düzenle"}
                  {isEditOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Values Display */}
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
                <Layers className="w-3 h-3 mr-1" />
                {result.formData.floor}. kat / {result.formData.totalFloors} kat
              </Badge>
              <Badge variant="outline" className="text-sm py-1">
                <Banknote className="w-3 h-3 mr-1" />
                {formatCurrency(result.formData.listingPrice)}
              </Badge>
            </div>

            {/* Collapsible Edit Form */}
            <CollapsibleContent className="space-y-6">
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Parametreleri değiştirip tekrar analiz edebilirsiniz.
                </p>
                
                {editForm && (
                  <div className="grid gap-6">
                    {/* Row 1: Location */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          İlçe
                        </Label>
                        <Combobox
                          options={ISTANBUL_DISTRICTS.map((d) => ({
                            value: d.name,
                            label: d.name,
                          }))}
                          value={editForm.district}
                          onValueChange={handleDistrictChange}
                          placeholder="İlçe seçin"
                          searchPlaceholder="İlçe ara..."
                          emptyText="İlçe bulunamadı"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          Mahalle
                        </Label>
                        <Combobox
                          options={neighborhoods.map((n) => ({
                            value: n,
                            label: n,
                          }))}
                          value={editForm.neighborhood}
                          onValueChange={(value: string) => setEditForm({ ...editForm, neighborhood: value })}
                          placeholder="Mahalle seçin"
                          searchPlaceholder="Mahalle ara..."
                          emptyText="Önce ilçe seçin"
                          disabled={!selectedDistrict}
                        />
                      </div>
                    </div>

                    {/* Row 2: Property Details */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-muted-foreground" />
                          m²
                        </Label>
                        <Input
                          type="number"
                          value={editForm.squareMeters}
                          onChange={(e) => setEditForm({ ...editForm, squareMeters: Number(e.target.value) })}
                          min={20}
                          max={1000}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <DoorOpen className="w-4 h-4 text-muted-foreground" />
                          Oda Sayısı
                        </Label>
                        <Select
                          value={editForm.rooms}
                          onValueChange={(value) => setEditForm({ ...editForm, rooms: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Oda sayısı" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROOM_OPTIONS.map((room) => (
                              <SelectItem key={room} value={room}>
                                {room}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          Bina Yaşı
                        </Label>
                        <Input
                          type="number"
                          value={editForm.buildingAge}
                          onChange={(e) => setEditForm({ ...editForm, buildingAge: Number(e.target.value) })}
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>

                    {/* Row 3: Floor & Price */}
                    <div className="grid sm:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-muted-foreground" />
                          Bulunduğu Kat
                        </Label>
                        <Input
                          type="number"
                          value={editForm.floor}
                          onChange={(e) => setEditForm({ ...editForm, floor: Number(e.target.value) })}
                          min={-1}
                          max={50}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          Toplam Kat
                        </Label>
                        <Input
                          type="number"
                          value={editForm.totalFloors}
                          onChange={(e) => setEditForm({ ...editForm, totalFloors: Number(e.target.value) })}
                          min={1}
                          max={50}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          Durum
                        </Label>
                        <Select
                          value={editForm.status}
                          onValueChange={(value: PropertyStatus) => setEditForm({ ...editForm, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BOŞ">Boş</SelectItem>
                            <SelectItem value="KİRACILI">Kiracılı</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-muted-foreground" />
                          İlan Fiyatı (₺)
                        </Label>
                        <Input
                          type="number"
                          value={editForm.listingPrice}
                          onChange={(e) => setEditForm({ ...editForm, listingPrice: Number(e.target.value) })}
                          min={100000}
                          max={100000000}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-2">
                      <Button 
                        onClick={handleReanalyze} 
                        disabled={isReanalyzing || !editForm.district || !editForm.neighborhood}
                        className="gap-2"
                      >
                        {isReanalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analiz Ediliyor...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Tekrar Analiz Et
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </CardContent>
        </Collapsible>
      </Card>

      {/* Tab Navigation */}
      <Tabs defaultValue="summary" className="space-y-6 mt-6">
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
                Yatırım Değerlendirmesi
              </p>
              <div className="flex items-baseline justify-center gap-4">
                <p className="text-4xl md:text-5xl font-bold text-zinc-900">
                  {formatCurrency(result.fairValueMin || result.confidence?.lower || result.fairValue * 0.95)}
                </p>
                <span className="text-2xl text-zinc-400">-</span>
                <p className="text-4xl md:text-5xl font-bold text-zinc-900">
                  {formatCurrency(result.fairValueMax || result.confidence?.upper || result.fairValue * 1.05)}
                </p>
              </div>
              <p className="text-sm text-zinc-500">
                ±%5 güven aralığı ile hesaplanmıştır
              </p>
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
                advice={result.advice}
                fairValue={result.fairValue}
                listingPrice={result.listingPrice}
              />
              <p className="text-xs text-muted-foreground">
                Not: Mahalle bazlı koordinat olmadığından, harita işareti ilçe merkezini gösterir.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fırsat İlanları */}
      <OpportunitiesSection 
        district={result.formData.district} 
        m2={result.formData.squareMeters} 
        rooms={parseRooms(result.formData.rooms)}
        onAnalyze={handleOpportunityAnalyze}
      />

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

