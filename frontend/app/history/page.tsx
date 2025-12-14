"use client";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Clock, MapPin, ArrowRight, Trash2, Columns2, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearHistory,
  loadCompareSelection,
  loadHistory,
  removeFromHistory,
  saveCompareSelection,
  saveHistory,
  type SavedValuationResult,
} from "@/lib/storage";
import { cn, formatCurrency, sortHistory, SORT_OPTIONS } from "@/lib/utils";
import { SortDropdown } from "@/components/sort-dropdown";
import { SortOption } from "@/lib/types";

/**
 * Geçmiş Değerlemeler Sayfası
 * Kullanıcının önceki değerlemelerini listeler
 */

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<SavedValuationResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortOptionId, setSortOptionId] = useState<string>("timestamp-desc");

  const getAdviceColor = (advice: string) => {
    switch (advice) {
      case "FIRSAT":
        return "success";
      case "PAHALI":
        return "danger";
      default:
        return "warning";
    }
  };

  useEffect(() => {
    setItems(loadHistory());
    setSelectedIds(loadCompareSelection());
  }, []);

  // Sıralama uygula
  const sortedItems = useMemo(() => {
    const option = SORT_OPTIONS.find((opt) => opt.id === sortOptionId) || SORT_OPTIONS[0];
    return sortHistory(items as any, option.field, option.direction);
  }, [items, sortOptionId]);

  const handleSortChange = (option: SortOption) => {
    setSortOptionId(option.id);
  };

  const selectedCount = selectedIds.length;

  const canCompare = selectedCount >= 2;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveCompareSelection(next);
      return next;
    });
  };

  const openResult = (item: SavedValuationResult) => {
    localStorage.setItem("valuationResult", JSON.stringify(item));
    router.push("/result");
  };

  const handleDelete = (id: string) => {
    removeFromHistory(id);
    setItems(loadHistory());
    setSelectedIds((prev) => {
      const next = prev.filter((x) => x !== id);
      saveCompareSelection(next);
      return next;
    });
  };

  const handleClearAll = () => {
    clearHistory();
    setItems([]);
    setSelectedIds([]);
    saveCompareSelection([]);
  };

  const seedDemo = () => {
    const now = Date.now();
    const demo: SavedValuationResult[] = [
      {
        id: "demo-1",
        fairValue: 8500000,
        fairValueMin: 7700000,
        fairValueMax: 9300000,
        listingPrice: 7200000,
        diffPercent: ((7200000 - 8500000) / 8500000) * 100,
        advice: "FIRSAT",
        regionStats: {
          min: 6200000,
          max: 12000000,
          avg: 8500000,
          median: 8100000,
          count: 168,
        },
        confidence: { lower: 7700000, upper: 9300000 },
        timestamp: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
        formData: {
          district: "Kadıköy",
          neighborhood: "Caferağa",
          squareMeters: 120,
          rooms: "3+1",
          buildingAge: 8,
          floor: 3,
          totalFloors: 8,
          status: "BOŞ",
          listingPrice: 7200000,
        },
      },
      {
        id: "demo-2",
        fairValue: 12000000,
        fairValueMin: 10800000,
        fairValueMax: 13200000,
        listingPrice: 14500000,
        diffPercent: ((14500000 - 12000000) / 12000000) * 100,
        advice: "PAHALI",
        regionStats: {
          min: 9000000,
          max: 17000000,
          avg: 12000000,
          median: 11800000,
          count: 92,
        },
        confidence: { lower: 10800000, upper: 13200000 },
        timestamp: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
        formData: {
          district: "Beşiktaş",
          neighborhood: "Etiler",
          squareMeters: 85,
          rooms: "2+1",
          buildingAge: 12,
          floor: 5,
          totalFloors: 10,
          status: "KİRACILI",
          listingPrice: 14500000,
        },
      },
      {
        id: "demo-3",
        fairValue: 18000000,
        fairValueMin: 16200000,
        fairValueMax: 19800000,
        listingPrice: 17800000,
        diffPercent: ((17800000 - 18000000) / 18000000) * 100,
        advice: "NORMAL",
        regionStats: {
          min: 13500000,
          max: 25500000,
          avg: 18000000,
          median: 17500000,
          count: 61,
        },
        confidence: { lower: 16200000, upper: 19800000 },
        timestamp: new Date(now - 1000 * 60 * 60 * 24 * 9).toISOString(),
        formData: {
          district: "Şişli",
          neighborhood: "Nişantaşı",
          squareMeters: 150,
          rooms: "4+1",
          buildingAge: 18,
          floor: 2,
          totalFloors: 6,
          status: "BOŞ",
          listingPrice: 17800000,
        },
      },
    ];

    saveHistory(demo);
    saveCompareSelection([]);
    setSelectedIds([]);
    setItems(demo);
  };

  return (
    <PageContainer className="space-y-6">
      {/* Başlık */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <History className="w-8 h-8" />
            Geçmiş Değerlemeler
          </h1>
          <p className="text-muted-foreground">Son yaptığınız analizler</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/compare">
            <Button variant={canCompare ? "default" : "outline"} disabled={!canCompare}>
              <Columns2 className="mr-2 w-4 h-4" />
              Karşılaştır ({selectedCount})
            </Button>
          </Link>
          <Button variant="outline" onClick={seedDemo} disabled={items.length > 0}>
            Demo Verisi Yükle
          </Button>
          <Button variant="outline" onClick={handleClearAll} disabled={items.length === 0}>
            <Trash className="mr-2 w-4 h-4" />
            Hepsini Sil
          </Button>
        </div>
      </div>

      {/* Sıralama ve sayı */}
      {items.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {sortedItems.length} değerleme
          </p>
          <SortDropdown
            value={sortOptionId}
            onChange={handleSortChange}
          />
        </div>
      )}

      {/* Liste */}
      <div className="space-y-4">
        {sortedItems.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "border-2 border-border card-hover cursor-pointer transition-colors",
              selectedIds.includes(item.id) && "ring-2 ring-primary/30"
            )}
            onClick={() => openResult(item)}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Sol Bölüm - Konut Bilgisi */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {new Date(item.timestamp).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {item.formData.district}, {item.formData.neighborhood}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{item.formData.squareMeters} m²</Badge>
                    <Badge variant="outline">{item.formData.rooms}</Badge>
                  </div>
                </div>

                {/* Orta Bölüm - Fiyatlar */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Adil Değer</p>
                    <p className="font-bold text-foreground">
                      {formatCurrency(item.fairValue)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">İlan Fiyatı</p>
                    <p className="font-bold text-foreground">
                      {formatCurrency(item.listingPrice)}
                    </p>
                  </div>
                </div>

                {/* Sağ Bölüm - Sonuç ve Aksiyon */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(item.id);
                    }}
                    className={cn(
                      "h-10 w-10 rounded-2xl border border-border flex items-center justify-center transition-colors",
                      selectedIds.includes(item.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    )}
                    aria-label="Karşılaştırma için seç"
                  >
                    <Columns2 className="w-5 h-5" />
                  </button>
                  <Badge
                    variant={getAdviceColor(item.advice) as any}
                    className="text-sm px-3 py-1"
                  >
                    {item.advice}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      openResult(item);
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <Trash2 className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Boş Durum */}
      {items.length === 0 && (
        <Card className="border-2 border-dashed border-zinc-300">
          <CardContent className="p-12 text-center">
            <History className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Henüz değerleme yapmadınız
            </h3>
            <p className="text-muted-foreground mb-6">
              İlk değerlemenizi yaparak başlayın
            </p>
            <Link href="/analyze">
              <Button>Değerleme Yap</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}

