import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SortField, SortDirection, SortOption } from "./types";
import { SavedValuationResult } from "./storage";

/**
 * Tailwind class'larını birleştirmek için utility fonksiyonu
 * clsx ile conditional class'ları birleştirir
 * tailwind-merge ile çakışan class'ları çözer
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Para birimini Türk Lirası formatında gösterir
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Yüzde değerini formatlar
 */
export function formatPercent(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

/**
 * Tarihi Türkçe formatında gösterir
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Kısa tarih formatı
 */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Sıralama seçenekleri
 */
export const SORT_OPTIONS: SortOption[] = [
  { id: "timestamp-desc", field: "timestamp", direction: "desc", label: "Tarih (Yeni → Eski)" },
  { id: "timestamp-asc", field: "timestamp", direction: "asc", label: "Tarih (Eski → Yeni)" },
  { id: "listingPrice-asc", field: "listingPrice", direction: "asc", label: "Fiyat (Düşük → Yüksek)" },
  { id: "listingPrice-desc", field: "listingPrice", direction: "desc", label: "Fiyat (Yüksek → Düşük)" },
  { id: "squareMeters-asc", field: "squareMeters", direction: "asc", label: "m² (Küçük → Büyük)" },
  { id: "squareMeters-desc", field: "squareMeters", direction: "desc", label: "m² (Büyük → Küçük)" },
  { id: "district-asc", field: "district", direction: "asc", label: "İlçe (A → Z)" },
  { id: "district-desc", field: "district", direction: "desc", label: "İlçe (Z → A)" },
  { id: "diffPercent-asc", field: "diffPercent", direction: "asc", label: "Fırsat Skoru (En İyi)" },
  { id: "diffPercent-desc", field: "diffPercent", direction: "desc", label: "Fırsat Skoru (En Kötü)" },
  { id: "advice-asc", field: "advice", direction: "asc", label: "Durum (FIRSAT önce)" },
];

/**
 * Advice için custom sıralama değerleri
 */
const ADVICE_ORDER: Record<string, number> = {
  "FIRSAT": 1,
  "NORMAL": 2,
  "PAHALI": 3,
};

/**
 * Geçmiş analizleri sıralar
 */
export function sortHistory(
  items: SavedValuationResult[],
  field: SortField,
  direction: SortDirection
): SavedValuationResult[] {
  return [...items].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "timestamp":
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        comparison = dateA - dateB;
        break;

      case "listingPrice":
        comparison = a.listingPrice - b.listingPrice;
        break;

      case "fairValue":
        comparison = a.fairValue - b.fairValue;
        break;

      case "squareMeters":
        comparison = a.formData.squareMeters - b.formData.squareMeters;
        break;

      case "district":
        comparison = a.formData.district.localeCompare(b.formData.district, "tr");
        break;

      case "diffPercent":
        comparison = a.diffPercent - b.diffPercent;
        break;

      case "advice":
        comparison = ADVICE_ORDER[a.advice] - ADVICE_ORDER[b.advice];
        break;

      default:
        comparison = 0;
    }

    return direction === "asc" ? comparison : -comparison;
  });
}
