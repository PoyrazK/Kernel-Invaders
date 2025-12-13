# 🏠 Kernel-Invaiders - İstanbul Emlak Değerleme Sistemi

## AI Spark Hackathon 2025

Yapay zeka destekli konut değerleme ve yatırım tavsiye sistemi.

![Python](https://img.shields.io/badge/Python-3.9+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.124-green)
![LightGBM](https://img.shields.io/badge/LightGBM-4.5-orange)

## 🎯 Proje Hedefi

Yeni mezun mühendisler ve araştırma görevlileri için İstanbul emlak piyasasında:
- Bir evin **Adil Piyasa Değeri**'ni tahmin etmek
- İlan fiyatı ile karşılaştırarak **FIRSAT / NORMAL / PAHALI** tavsiyesi vermek

## 📁 Proje Yapısı

```
Kernel-Invaiders/
├── data/                  # Temizlenmiş veri
│   └── processed_data.pkl
├── models/                # Eğitilmiş modeller
│   ├── model.pkl          # LightGBM Regressor (R²: 0.62)
│   └── target_encoder.pkl # Target Encoder
├── notebooks/             # Eğitim notebook'ları
│   └── model_training.ipynb
├── api/                   # FastAPI Backend
│   ├── main.py
│   ├── predictor.py
│   ├── models.py
│   └── requirements.txt
├── frontend/              # Next.js Frontend
│   ├── app/
│   ├── components/
│   └── lib/
├── app.py                 # Streamlit Arayüzü
├── requirements.txt       # Ana bağımlılıklar
└── SUNUM_RAPORU.txt       # Sunum raporu
```

## 🚀 Kurulum ve Çalıştırma

### Streamlit Arayüzü (Hızlı Demo)
```bash
pip install -r requirements.txt
streamlit run app.py
```

### FastAPI + Next.js (Full Stack)

#### Backend
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🤖 Model Detayları

| Metrik | Değer |
|--------|-------|
| **Model** | LightGBM Regressor |
| **R² Score** | 0.62 |
| **Test RMSE** | ~275K TL |
| **Eğitim Verisi** | 23,668 kayıt |

### Kullanılan Özellikler
- İlçe, Mahalle (Target Encoded)
- m² (Net)
- Oda Sayısı
- Bina Yaşı
- Kat / Toplam Kat

## 📊 Karar Mekanizması

| Durum | Koşul |
|-------|-------|
| **FIRSAT** 🟢 | İlan fiyatı < Tahmin × 0.90 |
| **NORMAL** 🟡 | Tahmin × 0.90 ≤ İlan ≤ Tahmin × 1.10 |
| **PAHALI** 🔴 | İlan fiyatı > Tahmin × 1.10 |

## 👥 Takım

**Kernel-Invaiders**

## 📄 Lisans

Bu proje AI Spark Hackathon 2025 için geliştirilmiştir.
