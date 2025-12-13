"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Columns2, X, History, ArrowRightLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import {
  loadCompareSelection,
  loadHistory,
  saveCompareSelection,
  type SavedValuationResult,
} from "@/lib/storage";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<SavedValuationResult[]>([]);

  useEffect(() => {
    const history = loadHistory();

    const idsParam = searchParams.get("ids");
    const ids = idsParam
      ? idsParam.split(",").map((x) => x.trim()).filter(Boolean)
      : loadCompareSelection();

    setItems(history.filter((x) => ids.includes(x.id)));
  }, [searchParams]);

  const ids = useMemo(() => items.map((x) => x.id), [items]);

  const clear = () => {
    saveCompareSelection([]);
    setItems([]);
  };

  const remove = (id: string) => {
    const next = ids.filter((x) => x !== id);
    saveCompareSelection(next);
    const history = loadHistory();
    setItems(history.filter((x) => next.includes(x.id)));
  };

  if (items.length < 2) {
    return (
      <PageContainer className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Columns2 className="w-8 h-8" />
              Karşılaştır
            </h1>
            <p className="text-muted-foreground">
              Karşılaştırmak için geçmişten en az 2 analiz seçin.
            </p>
          </div>
        </div>

        <Card className="border-2 border-dashed border-border">
          <CardContent className="p-10 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-secondary flex items-center justify-center">
              <ArrowRightLeft className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Henüz seçim yok</p>
              <p className="text-sm text-muted-foreground">
                Geçmiş sayfasından seçim yapıp tekrar gelin.
              </p>
            </div>
            <Link href="/history">
              <Button>
                <History className="mr-2 w-4 h-4" />
                Geçmişe Git
              </Button>
            </Link>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Columns2 className="w-8 h-8" />
            Karşılaştır
          </h1>
          <p className="text-muted-foreground">
            Seçili analizler: <span className="font-semibold text-foreground">{items.length}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/history">
            <Button variant="outline">
              <History className="mr-2 w-4 h-4" />
              Seçimi Düzenle
            </Button>
          </Link>
          <Button variant="outline" onClick={clear}>
            Temizle
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="border-2 border-border overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-base text-foreground">
                    {item.formData.district}, {item.formData.neighborhood}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(item.id)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{item.formData.squareMeters} m²</Badge>
                <Badge variant="outline">{item.formData.rooms}</Badge>
                <Badge variant="outline">{item.formData.buildingAge} yaş</Badge>
                <Badge variant="outline">
                  {item.formData.floor}. kat / {item.formData.totalFloors}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-secondary">
                  <p className="text-xs text-muted-foreground">İlan</p>
                  <p className="font-bold text-foreground">{formatCurrency(item.listingPrice)}</p>
                </div>
                <div className="p-3 rounded-2xl bg-secondary">
                  <p className="text-xs text-muted-foreground">Adil Değer</p>
                  <p className="font-bold text-foreground">{formatCurrency(item.fairValue)}</p>
                </div>
              </div>

              <div
                className={cn(
                  "p-3 rounded-2xl border",
                  item.diffPercent < 0
                    ? "border-neon-green/30 bg-neon-green/10"
                    : item.diffPercent > 10
                    ? "border-neon-red/30 bg-neon-red/10"
                    : "border-border bg-secondary"
                )}
              >
                <p className="text-xs text-muted-foreground">Fark</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-foreground">{formatPercent(item.diffPercent)}</p>
                  <Badge
                    variant={
                      item.advice === "FIRSAT"
                        ? "success"
                        : item.advice === "PAHALI"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {item.advice}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
