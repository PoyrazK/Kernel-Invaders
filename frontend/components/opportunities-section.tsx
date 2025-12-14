"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Home, 
  MapPin, 
  Ruler, 
  DoorOpen, 
  Calendar, 
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  Building2
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency } from "@/lib/utils";
import { OpportunityItem } from "@/lib/types";
import { getOpportunities } from "@/lib/api";

interface OpportunitiesSectionProps {
  district: string;
  neighborhood?: string;
  m2?: number;
  rooms?: number;
  onAnalyze?: (opportunity: OpportunityItem) => void;
}

/**
 * Tek bir fırsat kartı
 */
function OpportunityCard({ 
  opportunity, 
  onAnalyze 
}: { 
  opportunity: OpportunityItem; 
  onAnalyze?: (opportunity: OpportunityItem) => void;
}) {
  const savings = opportunity.fairValue - opportunity.price;
  
  return (
    <Card className="min-w-[280px] max-w-[280px] border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
      onClick={() => onAnalyze?.(opportunity)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Üst Kısım - Konum ve Fırsat Badge */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{opportunity.district}</span>
            </div>
            <p className="font-semibold text-sm">{opportunity.neighborhood}</p>
          </div>
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs">
            <TrendingDown className="w-3 h-3 mr-1" />
            {Math.abs(opportunity.diffPercent).toFixed(0)}% indirim
          </Badge>
        </div>

        {/* Özellikler */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            <Ruler className="w-3 h-3" />
            {opportunity.m2} m²
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            <DoorOpen className="w-3 h-3" />
            {opportunity.rooms}+1
          </div>
          {opportunity.buildingAge !== undefined && opportunity.buildingAge !== null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <Calendar className="w-3 h-3" />
              {opportunity.buildingAge} yaş
            </div>
          )}
          {opportunity.floor !== undefined && opportunity.floor !== null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <Building2 className="w-3 h-3" />
              {opportunity.floor}. kat
            </div>
          )}
        </div>

        {/* Fiyat Bilgileri */}
        <div className="pt-2 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">İlan Fiyatı</span>
            <span className="font-bold text-lg text-foreground">
              {formatCurrency(opportunity.price)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Piyasa Değeri</span>
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(opportunity.fairValue)}
            </span>
          </div>
          <div className="flex items-center justify-between bg-emerald-100 dark:bg-emerald-900/30 rounded-lg px-2 py-1.5">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Tasarruf</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(savings)}
            </span>
          </div>
        </div>

        {/* Analiz Et Butonu */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Bu Evi Analiz Et
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Yükleme skeleton'u
 */
function OpportunityCardSkeleton() {
  return (
    <Card className="min-w-[280px] max-w-[280px] border-2">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
        <div className="pt-2 border-t space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

/**
 * Fırsat evleri bölümü - Yatay kaydırılabilir
 */
export function OpportunitiesSection({ 
  district, 
  neighborhood,
  m2,
  rooms,
  onAnalyze 
}: OpportunitiesSectionProps) {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchOpportunities() {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getOpportunities(district, neighborhood, m2, rooms, 10);
        setOpportunities(data);
      } catch (err) {
        setError("Fırsatlar yüklenirken bir hata oluştu");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOpportunities();
  }, [district, neighborhood, m2, rooms]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Fırsat yoksa gösterme
  if (!isLoading && opportunities.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Benzer Fırsatlar
                <Badge variant="secondary" className="ml-2">
                  {isLoading ? "..." : opportunities.length} ilan
                </Badge>
              </CardTitle>
              <CardDescription>
                {district} bölgesinde değerinin altında fiyatlanmış evler
              </CardDescription>
            </div>
          </div>
          
          {/* Scroll Buttons */}
          {!isLoading && opportunities.length > 3 && (
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin" }}
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <OpportunityCardSkeleton key={i} />
            ))
          ) : error ? (
            // Error state
            <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
              <p>{error}</p>
            </div>
          ) : (
            // Opportunity cards
            opportunities.map((opp, index) => (
              <div key={index} className="snap-start">
                <OpportunityCard 
                  opportunity={opp} 
                  onAnalyze={onAnalyze}
                />
              </div>
            ))
          )}
        </div>

        {/* Swipe hint for mobile */}
        <p className="text-xs text-center text-muted-foreground mt-2 md:hidden">
          ← Kaydırarak daha fazla fırsat görün →
        </p>
      </CardContent>
    </Card>
  );
}
