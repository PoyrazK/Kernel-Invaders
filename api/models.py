# Pydantic Models for API Request/Response

from pydantic import BaseModel, Field
from typing import Optional, Literal


class PredictRequest(BaseModel):
    """Frontend'den gelen tahmin isteği"""
    location: str = Field(..., description="Mahalle adı")
    district: str = Field(..., description="İlçe adı")
    m2: float = Field(..., gt=0, description="Net metrekare")
    rooms: int = Field(..., ge=1, description="Toplam oda sayısı")
    building_age: int = Field(..., ge=0, description="Bina yaşı")
    floor: int = Field(..., description="Bulunduğu kat")
    total_floors: int = Field(..., ge=1, description="Toplam kat sayısı")
    price: float = Field(..., gt=0, description="İlan fiyatı (TL)")
    
    # Optional features
    heating: Optional[str] = Field(default="Kombi", description="Isıtma tipi")
    bathrooms: Optional[int] = Field(default=1, ge=1, description="Banyo sayısı")
    balcony: Optional[bool] = Field(default=True, description="Balkon var mı")
    elevator: Optional[bool] = Field(default=True, description="Asansör var mı")
    parking: Optional[bool] = Field(default=False, description="Otopark var mı")
    security: Optional[bool] = Field(default=False, description="Güvenlik var mı")


class RegionStats(BaseModel):
    """Bölge istatistikleri"""
    min: float
    max: float
    avg: float
    median: Optional[float] = None
    count: Optional[int] = None


class Confidence(BaseModel):
    """Güven aralığı"""
    lower: float
    upper: float


InvestmentAdvice = Literal["FIRSAT", "NORMAL", "PAHALI"]


class PredictResponse(BaseModel):
    """Tahmin sonucu yanıtı"""
    fair_value: float = Field(..., description="Model tahmini (TL)")
    advice: InvestmentAdvice = Field(..., description="Yatırım tavsiyesi")
    diff_percent: float = Field(..., description="Fiyat farkı yüzdesi")
    region_stats: RegionStats = Field(..., description="Bölge istatistikleri")
    confidence: Optional[Confidence] = Field(None, description="Güven aralığı")


class HealthResponse(BaseModel):
    """Health check yanıtı"""
    status: str
    model_loaded: bool
    encoder_loaded: bool
