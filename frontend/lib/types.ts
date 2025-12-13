/**
 * Değerleme API'si için tip tanımları
 */

// Yatırım tavsiyesi tipleri
export type InvestmentAdvice = "FIRSAT" | "NORMAL" | "PAHALI";

// Evin durumu
export type PropertyStatus = "BOŞ" | "KİRACILI";

// Form verisi tipi
export interface ValuationFormData {
  district: string;      // İlçe
  neighborhood: string;  // Mahalle
  squareMeters: number;  // m²
  rooms: string;         // Oda sayısı (örn: "2+1", "3+1")
  buildingAge: number;   // Bina yaşı
  floor: number;         // Bulunduğu kat
  totalFloors: number;   // Toplam kat sayısı
  status: PropertyStatus; // Evin durumu
  listingPrice: number;  // İlan satış fiyatı
}

// API isteği tipi
export interface PredictRequest {
  location: string;
  district: string;
  m2: number;
  rooms: number;
  building_age: number;
  floor: number;
  total_floors: number;
  price: number;
}

// Bölge istatistikleri
export interface RegionStats {
  min: number;
  max: number;
  avg: number;
  median?: number;
  count?: number;
}

// API yanıtı tipi
export interface PredictResponse {
  fair_value: number;
  fair_value_min: number;  // -5%
  fair_value_max: number;  // +5%
  advice: InvestmentAdvice;
  diff_percent: number;
  region_stats: RegionStats;
  confidence?: {
    lower: number;
    upper: number;
  };
}

// Değerleme sonucu (frontend'de kullanılacak zenginleştirilmiş veri)
export interface ValuationResult {
  fairValue: number;
  fairValueMin: number;  // -5%
  fairValueMax: number;  // +5%
  listingPrice: number;
  diffPercent: number;
  advice: InvestmentAdvice;
  regionStats: RegionStats;
  confidence?: {
    lower: number;
    upper: number;
  };
  timestamp: Date;
  formData: ValuationFormData;
}

// İlçe verisi
export interface District {
  id: string;
  name: string;
  neighborhoods: string[];
}

// Grafik verisi tipi
export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

// Fiyat karşılaştırma grafik verisi
export interface PriceComparisonData {
  category: string;
  fairValue: number;
  listingPrice: number;
}

