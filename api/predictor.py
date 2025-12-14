# Predictor - Model ve tahmin işlemleri

import os
import sys
import joblib
import pandas as pd
import numpy as np
from pathlib import Path

# Add parent directory to path for target_encoder module
sys.path.insert(0, str(Path(__file__).parent.parent))
import target_encoder  # noqa: F401 - needed for pickle


class HousePricePredictor:
    """LightGBM model ile ev fiyat tahmini"""
    
    def __init__(self):
        self.model = None
        self.encoder = None
        self.training_data = None
        self.model_loaded = False
        self.encoder_loaded = False
        
    def load(self, models_dir: str = None):
        """Model ve encoder'ı yükle"""
        if models_dir is None:
            # Default: parent directory's models folder
            base_path = Path(__file__).parent.parent
            models_dir = base_path / "models"
        else:
            models_dir = Path(models_dir)
        
        # Load the model
        model_path = models_dir / "model.pkl"
        if not model_path.exists():
            # Fallback to versioned names
            model_path = models_dir / "model_lightgbm_tuned_v3.pkl"
        
        encoder_path = models_dir / "target_encoder.pkl"
        if not encoder_path.exists():
            encoder_path = models_dir / "target_encoder_v3.pkl"
        
        # Load model
        if model_path.exists():
            self.model = joblib.load(model_path)
            self.model_loaded = True
            print(f"✅ Model loaded: {model_path.name}")
        else:
            raise FileNotFoundError(f"Model not found at {model_path}")
        
        # Load encoder
        if encoder_path.exists():
            self.encoder = joblib.load(encoder_path)
            self.encoder_loaded = True
            print(f"✅ Encoder loaded: {encoder_path.name}")
        else:
            raise FileNotFoundError(f"Encoder not found at {encoder_path}")
        
        # Load training data for region statistics
        data_path = base_path / "processed_data.pkl"
        if data_path.exists():
            self.training_data = pd.read_pickle(data_path)
            print(f"✅ Training data loaded: {len(self.training_data)} samples")
    
    def prepare_input(self, request) -> pd.DataFrame:
        """Request'i model input formatına dönüştür"""
        # Create DataFrame with expected columns
        data = {
            'District': [request.district],
            'Neighborhood': [request.location],  # frontend 'location' olarak gönderiyor
            'm² (Net)': [request.m2],
            'Rooms_Num': [request.rooms],
            'Age_Num': [request.building_age],
            'Floor location': [self._get_floor_location(request.floor, request.total_floors)],
            'Heating': [request.heating or "Kombi"],
            'Number of bathrooms': [request.bathrooms or 1],
            'Number of floors': [request.total_floors],
            'Balcony_Bool': [1 if request.balcony else 0],
            'Elevator': [1 if request.elevator else 0],
            'Parking Lot': [1 if request.parking else 0],
            'Security': [1 if request.security else 0],
            'Room_Size_Ratio': [request.m2 / max(request.rooms, 1)]
        }
        
        return pd.DataFrame(data)
    
    def _get_floor_location(self, floor: int, total_floors: int) -> str:
        """Kat numarasından kat konumu kategorisi oluştur"""
        if floor <= 0:
            return "Zemin Kat"
        elif floor == 1:
            return "1. Kat"
        elif floor == 2:
            return "2. Kat"
        elif floor == 3:
            return "3. Kat"
        elif floor >= total_floors:
            return "En Üst Kat"
        else:
            return "Orta Kat"
    
    def predict(self, request) -> dict:
        """Fiyat tahmini yap ve sonuç döndür"""
        if not self.model_loaded or not self.encoder_loaded:
            raise RuntimeError("Model or encoder not loaded")
        
        # Prepare input
        input_df = self.prepare_input(request)
        
        # Apply target encoding
        input_encoded = self.encoder.transform(input_df)
        
        # Predict
        fair_value = float(self.model.predict(input_encoded)[0])
        
        # ±5% Fiyat Aralığı
        RANGE_PERCENT = 0.05
        fair_value_min = fair_value * (1 - RANGE_PERCENT)
        fair_value_max = fair_value * (1 + RANGE_PERCENT)
        
        # Determine advice based on range
        # FIRSAT: İlan fiyatı < Alt sınır
        # NORMAL: Alt sınır <= İlan fiyatı <= Üst sınır
        # PAHALI: İlan fiyatı > Üst sınır
        advice = self._get_advice_with_range(request.price, fair_value_min, fair_value_max)
        
        # Calculate diff percent (ilan vs tahmin ortası)
        # Pozitif = ilan fiyatı adil değerden yüksek (pahalı)
        # Negatif = ilan fiyatı adil değerden düşük (fırsat)
        diff_percent = ((request.price - fair_value) / fair_value) * 100
        
        # Get region stats
        region_stats = self._get_region_stats(request.district, request.location)
        
        # Round to nearest 1000 TL for cleaner display
        def round_to_nearest_1000(value):
            return round(value / 1000) * 1000
        
        return {
            "fair_value": round_to_nearest_1000(fair_value),
            "fair_value_min": round_to_nearest_1000(fair_value_min),
            "fair_value_max": round_to_nearest_1000(fair_value_max),
            "advice": advice,
            "diff_percent": round(diff_percent, 2),
            "region_stats": region_stats,
            "confidence": {
                "lower": round_to_nearest_1000(fair_value_min),
                "upper": round_to_nearest_1000(fair_value_max)
            }
        }
    
    def _get_advice_with_range(self, listing_price: float, fair_min: float, fair_max: float) -> str:
        """Fiyat aralığına göre yatırım tavsiyesi"""
        if listing_price < fair_min:
            return "FIRSAT"  # İlan fiyatı alt sınırın altında
        elif listing_price > fair_max:
            return "PAHALI"  # İlan fiyatı üst sınırın üstünde
        else:
            return "NORMAL"  # İlan fiyatı aralık içinde
    
    def _get_advice(self, diff_percent: float) -> str:
        """Fiyat farkına göre yatırım tavsiyesi (eski mantık, backup)"""
        if diff_percent > 5:
            return "FIRSAT"
        elif diff_percent > -5:
            return "NORMAL"
        else:
            return "PAHALI"
    
    def _get_region_stats(self, district: str, neighborhood: str) -> dict:
        """Bölge istatistiklerini hesapla"""
        if self.training_data is None:
            return {
                "min": 0,
                "max": 0,
                "avg": 0,
                "median": 0,
                "count": 0
            }
        
        # Filter by district and neighborhood
        mask = (self.training_data['District'] == district)
        if neighborhood:
            neighborhood_mask = (self.training_data['Neighborhood'] == neighborhood)
            if neighborhood_mask.sum() > 10:  # En az 10 örnek varsa mahalle bazlı
                mask = mask & neighborhood_mask
        
        filtered = self.training_data[mask]
        
        if len(filtered) == 0:
            # Fallback: tüm verilerin istatistikleri
            filtered = self.training_data
        
        return {
            "min": float(filtered['Price'].min()),
            "max": float(filtered['Price'].max()),
            "avg": float(filtered['Price'].mean()),
            "median": float(filtered['Price'].median()),
            "count": int(len(filtered))
        }
    
    def get_opportunities(self, district: str, neighborhood: str = None, 
                          target_m2: float = None, target_rooms: int = None,
                          limit: int = 10) -> list:
        """Benzer özelliklerde fırsat evleri bul"""
        if self.training_data is None or not self.model_loaded:
            return []
        
        df = self.training_data.copy()
        
        # 1. İlçe filtresi - önce aynı ilçe, yoksa komşu ilçeler
        district_mask = (df['District'] == district)
        if district_mask.sum() < 20:
            # Komşu ilçeleri de dahil et (tüm veriden)
            district_mask = pd.Series([True] * len(df))
        
        df_filtered = df[district_mask].copy()
        
        # 2. Mahalle filtresi (opsiyonel, gevşek)
        if neighborhood and (df_filtered['Neighborhood'] == neighborhood).sum() >= 5:
            # Aynı mahallede yeterli veri varsa öncelik ver
            neighborhood_match = (df_filtered['Neighborhood'] == neighborhood)
            df_neighborhood = df_filtered[neighborhood_match]
            if len(df_neighborhood) >= 5:
                df_filtered = df_neighborhood
        
        # 3. m² filtresi (±30% tolerans)
        if target_m2 and 'm² (Net)' in df_filtered.columns:
            m2_min = target_m2 * 0.7
            m2_max = target_m2 * 1.3
            m2_mask = (df_filtered['m² (Net)'] >= m2_min) & (df_filtered['m² (Net)'] <= m2_max)
            if m2_mask.sum() >= 10:
                df_filtered = df_filtered[m2_mask]
        
        # 4. Oda sayısı filtresi (±1 tolerans)
        if target_rooms and 'Rooms_Num' in df_filtered.columns:
            rooms_mask = (df_filtered['Rooms_Num'] >= target_rooms - 1) & \
                        (df_filtered['Rooms_Num'] <= target_rooms + 1)
            if rooms_mask.sum() >= 10:
                df_filtered = df_filtered[rooms_mask]
        
        # 5. Her ev için tahmin yap ve fark hesapla
        opportunities = []
        
        for idx, row in df_filtered.iterrows():
            try:
                # Basit tahmin için input hazırla
                floor_loc = self._get_floor_location(
                    int(row.get('Floor', 3)), 
                    int(row.get('Number of floors', 10))
                )
                
                input_data = {
                    'District': [row['District']],
                    'Neighborhood': [row['Neighborhood']],
                    'm² (Net)': [row['m² (Net)']],
                    'Rooms_Num': [row['Rooms_Num']],
                    'Age_Num': [row.get('Age_Num', 5)],
                    'Floor location': [floor_loc],
                    'Heating': [row.get('Heating', 'Kombi')],
                    'Number of bathrooms': [row.get('Number of bathrooms', 1)],
                    'Number of floors': [row.get('Number of floors', 10)],
                    'Balcony_Bool': [row.get('Balcony_Bool', 1)],
                    'Elevator': [row.get('Elevator', 1)],
                    'Parking Lot': [row.get('Parking Lot', 0)],
                    'Security': [row.get('Security', 0)],
                    'Room_Size_Ratio': [row['m² (Net)'] / max(row['Rooms_Num'], 1)]
                }
                
                input_df = pd.DataFrame(input_data)
                input_encoded = self.encoder.transform(input_df)
                fair_value = float(self.model.predict(input_encoded)[0])
                
                actual_price = float(row['Price'])
                diff_percent = ((actual_price - fair_value) / fair_value) * 100
                
                # Sadece fırsatları al (negatif fark = değerinin altında)
                if diff_percent < -5:  # En az %5 indirimli olanlar
                    opportunities.append({
                        'district': row['District'],
                        'neighborhood': row['Neighborhood'],
                        'm2': float(row['m² (Net)']),
                        'rooms': int(row['Rooms_Num']),
                        'price': round(actual_price / 1000) * 1000,  # 1000'e yuvarla
                        'fair_value': round(fair_value / 1000) * 1000,
                        'diff_percent': round(diff_percent, 1),
                        'building_age': int(row.get('Age_Num', 0)) if pd.notna(row.get('Age_Num')) else None,
                        'floor': int(row.get('Floor', 0)) if pd.notna(row.get('Floor')) else None
                    })
            except Exception as e:
                # Skip problematic rows
                continue
        
        # En iyi fırsatları sırala (en düşük diff_percent = en iyi fırsat)
        opportunities.sort(key=lambda x: x['diff_percent'])
        
        return opportunities[:limit]


# Singleton instance
predictor = HousePricePredictor()
