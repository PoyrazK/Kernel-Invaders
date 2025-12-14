# 🏠 Kernel-Invaders - İstanbul Emlak Değerleme Sistemi

## AI Spark Hackathon 2025

Yapay zeka destekli konut değerleme ve yatırım tavsiye sistemi. İstanbul emlak piyasası için 2020 verilerini kullanarak yapay zeka tabanlı "Adil Değer Tahminleyicisi" olan **Metrekare**'yi geliştirdik.

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.124-green)
![LightGBM](https://img.shields.io/badge/LightGBM-4.5-orange)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 👥 Takım Üyeleri

1. Hüseyin Poyraz Küçükarslan
2. Muhammed Türker Akarsu
3. Ravan Aliyev
4. Bahadır Koşapınar

## 🎯 Proje Hedefi

Yeni mezun mühendisler ve araştırma görevlileri için İstanbul emlak piyasasında:
- Bir evin **Adil Piyasa Değeri**'ni tahmin etmek
- İlan fiyatı ile karşılaştırarak **FIRSAT / NORMAL / PAHALI** tavsiyesi vermek
- Benzer bölgelerdeki fırsat ilanlarını listelemek

## 📁 Proje Yapısı

```
Kernel-Invaders/
├── api/                   # FastAPI Backend
│   ├── Dockerfile
│   ├── main.py
│   ├── predictor.py
│   ├── models.py
│   ├── encoder.py
│   └── requirements.txt
├── frontend/              # Next.js Frontend
│   ├── Dockerfile
│   ├── app/
│   ├── components/
│   └── lib/
├── models/                # Eğitilmiş modeller
│   ├── model.pkl          # LightGBM Regressor
│   └── encoder.pkl        # Optimization Encoder
├── data/                  # Temizlenmiş veri
│   └── processed_data.pkl
├── notebooks/             # Eğitim notebook'ları
│   └── model_training.ipynb
├── docker-compose.yml     # Docker orchestration
├── encoder.py             # Encoder modülü
├── processed_data.pkl     # İşlenmiş veri
└── requirements.txt       # Ana bağımlılıklar
```

## 🚀 Kurulum ve Çalıştırma

### 🐳 Docker ile (Önerilen - Tek Komut!) ⭐
```bash
docker-compose up
```
> Backend: http://localhost:8000 | Frontend: http://localhost:3000

### FastAPI + Next.js (Manuel)
```bash
# Terminal 1 - Backend
cd api && pip install -r requirements.txt && uvicorn main:app --port 8000

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev
```

> **NOT:** Model önceden eğitilmiş ve `models/` klasöründe hazır bulunmaktadır.

## 🤖 Model Detayları

### LightGBM Tuned Regressor

| Metrik | Değer |
|--------|-------|
| **Model** | LightGBM Regressor (Tuned) |
| **R² Score** | 0.9618 (%96.18 varyans açıklama) |
| **RMSE** | 182,825 TL |
| **MAPE** | %16.41 (Ortalama Mutlak Yüzde Hata) |
| **Eğitim Verisi** | 23,668 kayıt |
| **Model Boyutu** | 3.3 MB (Lightweight) |

### Hiperparametreler

| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| n_estimators | 700 | Ağaç sayısı |
| max_depth | -1 | Sınırsız derinlik |
| learning_rate | 0.05 | Öğrenme hızı |
| num_leaves | 50 | Yaprak sayısı |
| subsample | 0.9 | Veri örnekleme oranı |
| colsample_bytree | 0.7 | Özellik örnekleme |
| reg_alpha (L1) | 0.1 | Lasso regularization |
| reg_lambda (L2) | 2 | Ridge regularization |

### Denenen Modeller Karşılaştırması

| Model | R² Score | RMSE (TL) |
|-------|----------|-----------|
| Random Forest (v1) | 0.8512 | 262,450 |
| Gradient Boosting | 0.8789 | 252,125 |
| XGBoost | 0.9015 | 212,650 |
| XGBoost Tuned | 0.9387 | 202,340 |
| **LightGBM Tuned ⭐** | **0.9618** | **182,825** |

### Neden LightGBM?

- **Hızlı Eğitim**: XGBoost'tan 10-20x daha hızlı
- **Yüksek Performans**: Leaf-wise büyüme stratejisi
- **Emlak Verisi İçin İdeal**: Kategorik değişkenleri doğal olarak işler
- **Kolay Optimizasyon**: Early stopping ve cross-validation desteği

### Kullanılan Özellikler

- **Konum**: District, Neighborhood (Encoded)
- **Fiziksel**: m² (Net), Oda Sayısı, Bina Yaşı, Kat Konumu, Banyo Sayısı
- **Isıtma**: Heating tipi
- **Ekstralar**: Balkon, Asansör, Otopark, Güvenlik
- **Türetilen**: Room_Size_Ratio (m²/Oda), Floor_Ratio

## 📊 Karar Mekanizması

Model ±5% güven aralığı ile tahmin yapar:

| Durum | Koşul |
|-------|-------|
| **FIRSAT** 🟢 | İlan fiyatı < Tahmin × 0.95 |
| **NORMAL** 🟡 | Tahmin × 0.95 ≤ İlan ≤ Tahmin × 1.05 |
| **PAHALI** 🔴 | İlan fiyatı > Tahmin × 1.05 |

## ✨ Öne Çıkan Özellikler

1. **Full Stack Uygulama**: FastAPI + Next.js + Docker Compose
2. **Fırsat Evleri Önerisi**: Benzer bölgedeki diğer fırsatları listeler
3. **Güven Aralığı**: ±5% fiyat aralığı ile güvenilir tahminler
4. **Modern Arayüz**: Glassmorphism tasarım, koyu/açık tema
5. **Mobil Uyumlu**: Responsive tasarım

## 🛠️ Teknoloji Stack

- **Backend**: Python 3.11, FastAPI, LightGBM, Pandas, Scikit-learn
- **Frontend**: Next.js 14, React 18, TailwindCSS, shadcn/ui, Recharts
- **DevOps**: Docker, Docker Compose

## 🧪 Test Mekanizması

Modelin performansını harici veri setleri üzerinde test etmek için geliştirilmiş bir araç bulunmaktadır.

**Kullanım:**
```bash
python3 tests/calculate_metrics.py --data_path <veri_dosyasi_yolu.csv>
```

**Özellikler:**
- Verilen CSV dosyasını okur ve temizler (Outlier temizliği dahil)
- Eğitilmiş modeli kullanarak R² Score ve RMSE metriklerini hesaplar

## 📄 Lisans

Bu proje AI Spark Hackathon 2025 için geliştirilmiştir.
