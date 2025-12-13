import { PredictRequest, PredictResponse, ValuationFormData, ValuationResult } from "./types";

// API base URL - production'da environment variable'dan alınacak
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// API bağlantı durumu
let apiConnected = false;

/**
 * API health check - bağlantı durumunu kontrol eder
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    apiConnected = response.ok;
    return apiConnected;
  } catch {
    apiConnected = false;
    return false;
  }
}

/**
 * Değerleme API'sine istek atar
 * Backend bağlantısı başarısız olursa mock data döner
 */
export async function predictValue(formData: ValuationFormData): Promise<ValuationResult> {
  // Form verisini API formatına dönüştür
  const requestData: PredictRequest = {
    location: formData.neighborhood,
    district: formData.district,
    m2: formData.squareMeters,
    rooms: parseRooms(formData.rooms),
    building_age: formData.buildingAge,
    floor: formData.floor,
    total_floors: formData.totalFloors,
    price: formData.listingPrice,
  };

  console.log("🔄 API isteği gönderiliyor:", API_BASE_URL);
  console.log("📤 Request data:", JSON.stringify(requestData, null, 2));

  try {
    // Gerçek API çağrısı
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Hata:", response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data: PredictResponse = await response.json();
    console.log("✅ API yanıtı alındı:", JSON.stringify(data, null, 2));

    apiConnected = true;
    return transformResponse(data, formData);
  } catch (error) {
    console.warn("⚠️ Backend bağlantısı başarısız, mock data kullanılıyor:", error);
    apiConnected = false;
    // Mock data ile devam et
    return getMockValuation(formData);
  }
}

/**
 * API bağlantı durumunu döndürür
 */
export function isApiConnected(): boolean {
  return apiConnected;
}

/**
 * Oda sayısını string'den number'a çevirir
 * Örn: "2+1" -> 3, "3+1" -> 4
 */
function parseRooms(rooms: string): number {
  const parts = rooms.split("+");
  return parts.reduce((sum, part) => sum + parseInt(part, 10), 0);
}

/**
 * API yanıtını frontend formatına dönüştürür
 */
function transformResponse(response: PredictResponse, formData: ValuationFormData): ValuationResult {
  return {
    fairValue: response.fair_value,
    fairValueMin: response.fair_value_min,
    fairValueMax: response.fair_value_max,
    listingPrice: formData.listingPrice,
    diffPercent: response.diff_percent,
    advice: response.advice,
    regionStats: response.region_stats,
    confidence: response.confidence,
    timestamp: new Date(),
    formData,
  };
}

/**
 * Mock değerleme verisi - backend hazır olmadan geliştirme için
 */
function getMockValuation(formData: ValuationFormData): ValuationResult {
  // Gerçekçi mock hesaplama
  const basePrice = formData.squareMeters * 85000; // m² başına ortalama fiyat

  // Lokasyon faktörü
  const locationMultiplier = getLocationMultiplier(formData.district);

  // Yaş faktörü (yeni binalar daha değerli)
  const ageMultiplier = Math.max(0.7, 1 - formData.buildingAge * 0.015);

  // Kat faktörü
  const floorMultiplier = formData.floor > 0 ? 1 + (formData.floor / formData.totalFloors) * 0.1 : 0.95;

  // Fair value hesapla
  const fairValue = Math.round(basePrice * locationMultiplier * ageMultiplier * floorMultiplier);

  // Fark yüzdesi
  const diffPercent = ((formData.listingPrice - fairValue) / fairValue) * 100;

  // Tavsiye belirle
  let advice: "FIRSAT" | "NORMAL" | "PAHALI";
  if (diffPercent < -10) {
    advice = "FIRSAT";
  } else if (diffPercent > 15) {
    advice = "PAHALI";
  } else {
    advice = "NORMAL";
  }

  // Bölge istatistikleri
  const avgPrice = fairValue;
  const regionStats = {
    min: Math.round(avgPrice * 0.7),
    max: Math.round(avgPrice * 1.4),
    avg: avgPrice,
    median: Math.round(avgPrice * 0.95),
    count: Math.floor(Math.random() * 200) + 50,
  };

  // Güven aralığı
  const confidence = {
    lower: Math.round(fairValue * 0.9),
    upper: Math.round(fairValue * 1.1),
  };

  return {
    fairValue,
    fairValueMin: Math.round(fairValue * 0.95),  // -5%
    fairValueMax: Math.round(fairValue * 1.05),  // +5%
    listingPrice: formData.listingPrice,
    diffPercent,
    advice,
    regionStats,
    confidence,
    timestamp: new Date(),
    formData,
  };
}

/**
 * İlçeye göre fiyat çarpanı
 */
function getLocationMultiplier(district: string): number {
  const multipliers: Record<string, number> = {
    "Kadıköy": 1.5,
    "Beşiktaş": 1.7,
    "Şişli": 1.4,
    "Sarıyer": 1.6,
    "Bakırköy": 1.3,
    "Ataşehir": 1.25,
    "Üsküdar": 1.2,
    "Maltepe": 1.1,
    "Kartal": 1.0,
    "Pendik": 0.9,
    "Beylikdüzü": 0.85,
    "Esenyurt": 0.7,
    "Başakşehir": 0.95,
    "Küçükçekmece": 0.8,
  };

  return multipliers[district] || 1.0;
}

/**
 * İlçe ve mahalle verilerini getirir
 */
export function getDistricts() {
  return ISTANBUL_DISTRICTS;
}

/**
 * İstanbul ilçeleri ve mahalleleri
 */
export const ISTANBUL_DISTRICTS = [
  {
    id: "kadikoy",
    name: "Kadıköy",
    neighborhoods: ["Caferağa", "Fenerbahçe", "Göztepe", "Koşuyolu", "Moda", "Suadiye", "Caddebostan", "Bostancı", "Erenköy", "Fikirtepe"],
  },
  {
    id: "besiktas",
    name: "Beşiktaş",
    neighborhoods: ["Etiler", "Levent", "Bebek", "Ortaköy", "Arnavutköy", "Kuruçeşme", "Yıldız", "Akatlar", "Ulus", "Konaklar"],
  },
  {
    id: "sisli",
    name: "Şişli",
    neighborhoods: ["Nişantaşı", "Teşvikiye", "Maçka", "Osmanbey", "Mecidiyeköy", "Esentepe", "Fulya", "Bomonti", "Halaskargazi"],
  },
  {
    id: "sariyer",
    name: "Sarıyer",
    neighborhoods: ["Tarabya", "İstinye", "Emirgan", "Rumelihisarı", "Yeniköy", "Maslak", "Ayazağa", "Zekeriyaköy", "Bahçeköy"],
  },
  {
    id: "bakirkoy",
    name: "Bakırköy",
    neighborhoods: ["Ataköy", "Yeşilköy", "Florya", "Bahçelievler", "Şenlik", "Zeytinlik", "Osmaniye", "Kartaltepe"],
  },
  {
    id: "atasehir",
    name: "Ataşehir",
    neighborhoods: ["Ataşehir", "İçerenköy", "Küçükbakkalköy", "Kayışdağı", "Yenisahra", "Barbaros", "Ferhatpaşa"],
  },
  {
    id: "uskudar",
    name: "Üsküdar",
    neighborhoods: ["Acıbadem", "Altunizade", "Beylerbeyi", "Çengelköy", "Kuzguncuk", "Kandilli", "Ünalan", "Yavuztürk"],
  },
  {
    id: "maltepe",
    name: "Maltepe",
    neighborhoods: ["Altayçeşme", "Cevizli", "Girne", "İdealtepe", "Küçükyalı", "Zümrütevler", "Bağlarbaşı"],
  },
  {
    id: "kartal",
    name: "Kartal",
    neighborhoods: ["Soğanlık", "Yakacık", "Kordonboyu", "Uğur Mumcu", "Hürriyet", "Atalar", "Cevizli"],
  },
  {
    id: "pendik",
    name: "Pendik",
    neighborhoods: ["Kaynarca", "Yenişehir", "Kurtköy", "Güzelyalı", "Esenyalı", "Fevzi Çakmak", "Bahçelievler"],
  },
  {
    id: "beylikduzu",
    name: "Beylikdüzü",
    neighborhoods: ["Adnan Kahveci", "Barış", "Büyükşehir", "Cumhuriyet", "Kavakli", "Yakuplu", "Gürpınar"],
  },
  {
    id: "esenyurt",
    name: "Esenyurt",
    neighborhoods: ["Fatih", "Yeşilkent", "Saadetdere", "İncirtepe", "Mehterçeşme", "Pınar", "Ardıçlı"],
  },
  {
    id: "basaksehir",
    name: "Başakşehir",
    neighborhoods: ["Başakşehir", "Bahçeşehir", "Kayabaşı", "Altınşehir", "Güvercintepe", "Ziya Gökalp"],
  },
  {
    id: "kucukcekmece",
    name: "Küçükçekmece",
    neighborhoods: ["Atakent", "Cennet", "Halkalı", "Sefaköy", "Söğütlüçeşme", "İnönü", "Cumhuriyet"],
  },
];

/**
 * Oda sayısı seçenekleri
 */
export const ROOM_OPTIONS = [
  "1+0",
  "1+1",
  "2+1",
  "2+2",
  "3+1",
  "3+2",
  "4+1",
  "4+2",
  "5+1",
  "5+2",
  "6+1",
  "6+2",
];

