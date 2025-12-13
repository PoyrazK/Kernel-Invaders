# Metrekare 🏠

İstanbul konut piyasasında **gerçek değeri** veriye dayalı keşfedin.

Metrekare, makine öğrenmesi modelleri kullanarak konutların adil piyasa değerini hesaplayan ve yatırım tavsiyesi sunan modern bir web uygulamasıdır.

## ✨ Özellikler

- 📊 **Veri Odaklı Değerleme** - ML modeli ile objektif fiyat tahmini
- ⚖️ **Fiyat Karşılaştırması** - İlan fiyatı vs Adil Değer analizi
- 🎯 **Yatırım Tavsiyesi** - FIRSAT / NORMAL / PAHALI kategorileri
- 📈 **Görsel Grafikler** - Recharts ile interaktif veri görselleştirme
- 📱 **Mobil Uyumlu** - Responsive tasarım
- ♿ **Erişilebilir** - WCAG uyumlu bileşenler

## 🚀 Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya pnpm

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Tarayıcıda aç
open http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

## 🛠️ Teknoloji Yığını

| Kategori | Teknoloji |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| UI Library | React 18 + TypeScript |
| Styling | TailwindCSS |
| Components | shadcn/ui |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Icons | Lucide Icons |

## 📁 Proje Yapısı

```
metrekare/
├── app/
│   ├── page.tsx          # Landing page
│   ├── analyze/
│   │   └── page.tsx      # Değerleme formu
│   ├── result/
│   │   └── page.tsx      # Sonuç sayfası
│   ├── details/
│   │   └── page.tsx      # Detaylı analiz
│   ├── history/
│   │   └── page.tsx      # Geçmiş değerlemeler
│   └── profile/
│       └── page.tsx      # Kullanıcı profili
├── components/
│   ├── ui/               # shadcn/ui bileşenleri
│   ├── layout/           # Header, Footer, Nav
│   ├── charts/           # Grafik bileşenleri
│   ├── valuation-form.tsx
│   └── result-cards.tsx
└── lib/
    ├── api.ts            # API fonksiyonları
    ├── types.ts          # TypeScript tipleri
    └── utils.ts          # Yardımcı fonksiyonlar
```

## 🔌 Backend API

Backend henüz hazır olmadığında mock data kullanılır. Gerçek API şu kontratı takip etmelidir:

### POST /api/predict

**Request:**
```json
{
  "location": "string",
  "district": "string",
  "m2": "number",
  "rooms": "number",
  "building_age": "number",
  "floor": "number",
  "total_floors": "number",
  "price": "number"
}
```

**Response:**
```json
{
  "fair_value": "number",
  "advice": "FIRSAT | NORMAL | PAHALI",
  "diff_percent": "number",
  "region_stats": {
    "min": "number",
    "max": "number",
    "avg": "number"
  }
}
```

## 🎨 Tasarım Sistemi

- **Font:** Josefin Sans (ana), Instrument Serif (vurgu)
- **Renkler:** Slate/Zinc tabanlı, neon aksan renkleri
  - 🟢 Neon Green: `#39FF14` (FIRSAT)
  - 🟡 Neon Yellow: `#FFE135` (NORMAL)
  - 🔴 Neon Red: `#FF3131` (PAHALI)
  - 🔵 Neon Blue: `#00D4FF` (Vurgu)
- **Border Radius:** Büyük yuvarlatılmış köşeler (1rem+)

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**Made with ❤️ in İstanbul**

