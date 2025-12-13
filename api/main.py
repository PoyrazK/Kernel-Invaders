# FastAPI Main Application

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from models import PredictRequest, PredictResponse, HealthResponse
from predictor import predictor


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup ve shutdown event handler"""
    # Startup: Model ve encoder'ı yükle
    try:
        predictor.load()
        print("🚀 API hazır!")
    except Exception as e:
        print(f"❌ Model yükleme hatası: {e}")
        raise e
    
    yield
    
    # Shutdown
    print("👋 API kapatılıyor...")


# Create FastAPI app
app = FastAPI(
    title="İstanbul Emlak Değerleme API",
    description="Yapay zeka ile ev fiyat tahmini ve yatırım tavsiyesi",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - Frontend erişimi için
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm origin'lere izin ver (development için)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="ok",
        model_loaded=predictor.model_loaded,
        encoder_loaded=predictor.encoder_loaded
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="ok",
        model_loaded=predictor.model_loaded,
        encoder_loaded=predictor.encoder_loaded
    )


@app.post("/api/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    """
    Ev fiyat tahmini yap
    
    - **location**: Mahalle adı (örn: "Moda", "Caferağa")
    - **district**: İlçe adı (örn: "Kadıköy", "Beşiktaş")
    - **m2**: Net metrekare
    - **rooms**: Toplam oda sayısı (2+1 = 3)
    - **building_age**: Bina yaşı
    - **floor**: Bulunduğu kat
    - **total_floors**: Bina toplam kat sayısı
    - **price**: İlan fiyatı (TL)
    
    Returns:
    - **fair_value**: Model tahmini
    - **advice**: FIRSAT / NORMAL / PAHALI
    - **diff_percent**: Fiyat farkı yüzdesi
    - **region_stats**: Bölge istatistikleri
    - **confidence**: Güven aralığı
    """
    try:
        result = predictor.predict(request)
        return PredictResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
