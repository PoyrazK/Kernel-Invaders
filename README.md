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
│   ├── model.pkl          # LightGBM Regressor (R²: 0.8115)
│   └── encoder.pkl        # Encoder
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

### 🐳 Docker ile (Önerilen - Tek Komut!) ⭐
```bash
docker-compose up
```
> Backend: http://localhost:8000 | Frontend: http://localhost:3000 | Streamlit: http://localhost:8501

### Streamlit Arayüzü (Hızlı Demo)
```bash
pip install -r requirements.txt
streamlit run app.py
```

### FastAPI + Next.js (Manuel)
```bash
# Terminal 1 - Backend
cd api && pip install -r requirements.txt && uvicorn main:app --port 8000

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev
```

## 🤖 Model Detayları

| Metrik | Değer |
|--------|-------|
| **Model** | LightGBM Regressor (Tuned) |
| **R² Score** | 0.8115 (%81.15 varyans açıklama) |
| **RMSE** | 314,981 TL |
| **MAPE** | %22.15 (Ortalama Mutlak Yüzde Hata) |
| **Eğitim Verisi** | 23,668 kayıt |

### Denenen Modeller Karşılaştırması

| Model | R² Score | RMSE (TL) |
|-------|----------|-----------|
| Random Forest (v1) | 0.7884 | 333,769 |
| Gradient Boosting | 0.8003 | 324,248 |
| XGBoost | 0.8080 | 317,925 |
| XGBoost Tuned | 0.8111 | 315,339 |
| **LightGBM Tuned ⭐** | **0.8115** | **314,981** |

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
