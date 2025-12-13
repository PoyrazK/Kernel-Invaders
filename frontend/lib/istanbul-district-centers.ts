export type LatLng = [number, number];

// Rough district center coordinates (approx.)
// Used when we don't have neighborhood-level geocoding.
export const ISTANBUL_CENTER: LatLng = [41.0082, 28.9784];

export const DISTRICT_CENTERS: Record<string, LatLng> = {
  "Kadıköy": [40.9917, 29.0275],
  "Beşiktaş": [41.0422, 29.0083],
  "Şişli": [41.0602, 28.9877],
  "Sarıyer": [41.1667, 29.0500],
  "Bakırköy": [40.9805, 28.8721],
  "Ataşehir": [40.9923, 29.1244],
  "Üsküdar": [41.0227, 29.0164],
  "Maltepe": [40.9357, 29.1551],
  "Kartal": [40.8891, 29.1907],
  "Pendik": [40.8746, 29.2354],
  "Beylikdüzü": [40.9946, 28.6406],
  "Esenyurt": [41.0343, 28.6801],
  "Başakşehir": [41.0931, 28.8020],
  "Küçükçekmece": [41.0015, 28.7997],
};

export function getDistrictCenter(district: string): LatLng {
  return DISTRICT_CENTERS[district] || ISTANBUL_CENTER;
}
