export type LatLng = [number, number];

// Rough district center coordinates (approx.)
// Used when we don't have neighborhood-level geocoding.
export const ISTANBUL_CENTER: LatLng = [41.0082, 28.9784];

export const DISTRICT_CENTERS: Record<string, LatLng> = {
  "Adalar": [40.8760, 29.0906],
  "Arnavutköy": [41.1847, 28.7394],
  "Ataşehir": [40.9923, 29.1244],
  "Avcılar": [40.9796, 28.7214],
  "Bahçelievler": [41.0019, 28.8519],
  "Bakırköy": [40.9805, 28.8721],
  "Bayrampaşa": [41.0439, 28.9119],
  "Bağcılar": [41.0343, 28.8564],
  "Başakşehir": [41.0931, 28.8020],
  "Beykoz": [41.1322, 29.1017],
  "Beylikdüzü": [40.9946, 28.6406],
  "Beyoğlu": [41.0370, 28.9770],
  "Beşiktaş": [41.0422, 29.0083],
  "Büyükçekmece": [41.0223, 28.5853],
  "Çatalca": [41.1437, 28.4614],
  "Çekmeköy": [41.0333, 29.1833],
  "Esenler": [41.0439, 28.8764],
  "Esenyurt": [41.0343, 28.6801],
  "Eyüpsultan": [41.0550, 28.9344],
  "Fatih": [41.0186, 28.9497],
  "Gaziosmanpaşa": [41.0631, 28.9164],
  "Güngören": [41.0194, 28.8764],
  "Kadıköy": [40.9917, 29.0275],
  "Kağıthane": [41.0789, 28.9764],
  "Kartal": [40.8891, 29.1907],
  "Küçükçekmece": [41.0015, 28.7997],
  "Maltepe": [40.9357, 29.1551],
  "Pendik": [40.8746, 29.2354],
  "Sancaktepe": [41.0039, 29.2339],
  "Sarıyer": [41.1667, 29.0500],
  "Silivri": [41.0734, 28.2467],
  "Sultanbeyli": [40.9631, 29.2644],
  "Sultangazi": [41.1050, 28.8667],
  "Şile": [41.1750, 29.6128],
  "Şişli": [41.0602, 28.9877],
  "Tuzla": [40.8167, 29.3000],
  "Ümraniye": [41.0264, 29.0939],
  "Üsküdar": [41.0227, 29.0164],
  "Zeytinburnu": [40.9944, 28.9047],
};

export function getDistrictCenter(district: string): LatLng {
  return DISTRICT_CENTERS[district] || ISTANBUL_CENTER;
}
