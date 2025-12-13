import streamlit as st
import pandas as pd
import numpy as np
import joblib
import json
import os

# Page Config
st.set_page_config(
    page_title="🏡 Emlak Yatırım Danışmanı",
    page_icon="🏡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .stApp {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }
    .metric-card {
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        padding: 25px;
        border-radius: 15px;
        border: 1px solid rgba(255,255,255,0.2);
        text-align: center;
        color: white;
        margin: 10px 0;
    }
    .metric-card h3 {
        color: #a0a0a0;
        font-size: 14px;
        margin-bottom: 10px;
    }
    .metric-card h2 {
        font-size: 28px;
        font-weight: bold;
    }
    .firsat {
        background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
    }
    .normal {
        background: linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%);
    }
    .pahali {
        background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    }
    .sidebar .sidebar-content {
        background: #16213e;
    }
    h1, h2, h3, p {
        color: white;
    }
    .stButton>button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 15px 30px;
        font-size: 18px;
        font-weight: bold;
        border-radius: 10px;
        width: 100%;
        cursor: pointer;
        transition: transform 0.3s;
    }
    .stButton>button:hover {
        transform: scale(1.02);
    }
    .info-box {
        background: rgba(255,255,255,0.1);
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid #667eea;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

def apply_target_encoding(df, encoder_data):
    """Target encoding uygular - harici modül gerektirmez."""
    df_out = df.copy()
    global_mean = encoder_data['global_mean']
    
    # District encoding
    if 'District' in df_out.columns:
        df_out['District'] = df_out['District'].map(encoder_data['district']).fillna(global_mean)
    
    # Neighborhood encoding
    if 'Neighborhood' in df_out.columns:
        df_out['Neighborhood'] = df_out['Neighborhood'].map(encoder_data['neighborhood']).fillna(global_mean)
    
    return df_out

# Load Model and Resources
@st.cache_resource
def load_resources():
    """Model ve gerekli verileri yükle."""
    base_path = os.path.dirname(__file__)
    
    # Model yükle
    model_path = os.path.join(base_path, "models", "model.pkl")
    model = joblib.load(model_path)
    
    # Encoder verilerini JSON'dan yükle (harici modül gerektirmez)
    encoder_path = os.path.join(base_path, "models", "encoder_mappings.json")
    with open(encoder_path, 'r', encoding='utf-8') as f:
        encoder_data = json.load(f)
    
    # Dropdown seçenekleri için veri yükle
    data_path = os.path.join(base_path, "data", "processed_data.pkl")
    df = pd.read_pickle(data_path)
    
    return model, encoder_data, df

try:
    model, encoder_data, df = load_resources()
    model_loaded = True
except Exception as e:
    model_loaded = False
    st.error(f"Model yüklenirken hata: {e}")

# Header
st.markdown("""
<div style='text-align: center; padding: 20px;'>
    <h1 style='font-size: 48px; margin-bottom: 0;'>🏡 İstanbul Emlak Yatırım Danışmanı</h1>
    <p style='font-size: 18px; color: #a0a0a0;'>Yapay Zeka ile Akıllı Yatırım Kararları</p>
</div>
""", unsafe_allow_html=True)

if model_loaded:
    # Sidebar - Property Features
    st.sidebar.markdown("## 📋 Ev Özellikleri")
    st.sidebar.markdown("---")
    
    # Location Section
    st.sidebar.markdown("### 📍 Konum")
    district = st.sidebar.selectbox("İlçe", sorted(df['District'].unique()))
    neighborhoods_in_district = sorted(df[df['District'] == district]['Neighborhood'].unique())
    neighborhood = st.sidebar.selectbox("Mahalle", neighborhoods_in_district)
    
    st.sidebar.markdown("---")
    
    # Property Specs
    st.sidebar.markdown("### 🏠 Özellikler")
    m2 = st.sidebar.number_input("Net Alan (m²)", min_value=20, max_value=500, value=100)
    rooms = st.sidebar.number_input("Oda Sayısı (Toplam)", min_value=1, max_value=15, value=3)
    age = st.sidebar.slider("Bina Yaşı", min_value=0, max_value=50, value=5)
    
    floor_opts = sorted(df['Floor location'].unique())
    floor = st.sidebar.selectbox("Kat Konumu", floor_opts)
    
    heating_opts = sorted(df['Heating'].unique())
    heating = st.sidebar.selectbox("Isıtma Tipi", heating_opts)
    
    bathrooms = st.sidebar.number_input("Banyo Sayısı", min_value=1, max_value=5, value=1)
    floors_total = st.sidebar.number_input("Bina Kat Sayısı", min_value=1, max_value=40, value=5)
    
    st.sidebar.markdown("---")
    
    # Amenities
    st.sidebar.markdown("### ✨ Ek Özellikler")
    col1, col2 = st.sidebar.columns(2)
    with col1:
        balcony = st.checkbox("🌿 Balkon", value=True)
        elevator = st.checkbox("🛗 Asansör", value=True)
    with col2:
        parking = st.checkbox("🚗 Otopark", value=False)
        security = st.checkbox("🔒 Güvenlik", value=False)
    
    st.sidebar.markdown("---")
    
    # Asking Price
    st.sidebar.markdown("### 💰 İlan Fiyatı")
    asking_price = st.sidebar.number_input(
        "Satış Fiyatı (TL)", 
        min_value=50000, 
        max_value=50000000, 
        value=500000, 
        step=25000,
        format="%d"
    )
    
    st.sidebar.markdown("---")
    
    # Analyze Button
    analyze_clicked = st.sidebar.button("🔍 FIRSAT MI? ANALİZ ET", use_container_width=True)
    
    # Main Content Area
    if analyze_clicked:
        # Prepare Input Data
        input_data = pd.DataFrame({
            'District': [district],
            'Neighborhood': [neighborhood],
            'm² (Net)': [m2],
            'Rooms_Num': [rooms],
            'Age_Num': [age],
            'Floor location': [floor],
            'Heating': [heating],
            'Number of bathrooms': [bathrooms],
            'Number of floors': [floors_total],
            'Balcony_Bool': [1 if balcony else 0],
            'Elevator': [1 if elevator else 0],
            'Parking Lot': [1 if parking else 0],
            'Security': [1 if security else 0],
            'Room_Size_Ratio': [m2 / max(rooms, 1)]
        })
        
        # Apply Target Encoding
        input_encoded = apply_target_encoding(input_data, encoder_data)
        
        # Predict
        predicted_price = model.predict(input_encoded)[0]
        
        # Business Logic - Investment Decision
        diff = predicted_price - asking_price
        percent_diff = (diff / asking_price) * 100
        
        # Thresholds based on model RMSE (~315K TL, ~10% of average price)
        if percent_diff > 15:
            advice = "🎯 FIRSAT!"
            advice_class = "firsat"
            advice_detail = "Bu ev, model tahmininin oldukça altında! Yatırım için değerlendirin."
        elif percent_diff > 5:
            advice = "✅ İYİ FİYAT"
            advice_class = "firsat"
            advice_detail = "Fiyat, piyasa değerinin biraz altında görünüyor."
        elif percent_diff > -5:
            advice = "⚖️ NORMAL"
            advice_class = "normal"
            advice_detail = "Fiyat, piyasa değerine yakın. Pazarlık yapılabilir."
        elif percent_diff > -15:
            advice = "⚠️ BİRAZ PAHALI"
            advice_class = "pahali"
            advice_detail = "Fiyat, piyasa değerinin biraz üstünde."
        else:
            advice = "❌ PAHALI!"
            advice_class = "pahali"
            advice_detail = "Bu ev, model tahmininin oldukça üstünde fiyatlandırılmış!"
        
        # Display Results
        st.markdown("---")
        st.markdown("## 📊 Analiz Sonuçları")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown(f"""
            <div class='metric-card'>
                <h3>🤖 Tahmin Edilen Değer</h3>
                <h2>{predicted_price:,.0f} TL</h2>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class='metric-card'>
                <h3>💵 İlan Fiyatı</h3>
                <h2>{asking_price:,.0f} TL</h2>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown(f"""
            <div class='metric-card {advice_class}'>
                <h3>📈 Yatırım Tavsiyesi</h3>
                <h2>{advice}</h2>
            </div>
            """, unsafe_allow_html=True)
        
        # Detailed Analysis
        st.markdown("---")
        st.markdown("### 📋 Detaylı Analiz")
        
        fark = predicted_price - asking_price
        fark_yuzde = (fark / asking_price) * 100
        
        if fark >= 0:
            fark_text = f"+{fark:,.0f} TL ({fark_yuzde:+.1f}%)"
            fark_emoji = "📈"
        else:
            fark_text = f"{fark:,.0f} TL ({fark_yuzde:.1f}%)"
            fark_emoji = "📉"
        
        st.markdown(f"""
        <div class='info-box'>
            <p><strong>🏠 Ev:</strong> {district}, {neighborhood} - {m2}m², {rooms} Oda</p>
            <p><strong>🤖 Model Tahmini:</strong> {predicted_price:,.0f} TL</p>
            <p><strong>💵 İlan Fiyatı:</strong> {asking_price:,.0f} TL</p>
            <p><strong>{fark_emoji} Fark:</strong> {fark_text}</p>
            <hr style='border-color: rgba(255,255,255,0.2);'>
            <p><strong>💡 Değerlendirme:</strong> {advice_detail}</p>
        </div>
        """, unsafe_allow_html=True)
        
    else:
        # Welcome Message
        st.markdown("""
        <div class='info-box' style='margin: 50px auto; max-width: 800px; text-align: center;'>
            <h2 style='margin-bottom: 20px;'>👋 Hoş Geldiniz!</h2>
            <p style='font-size: 16px; line-height: 1.8;'>
                Bu yapay zeka destekli sistem, İstanbul'daki konut fiyatlarını analiz ederek 
                yatırım kararlarınıza yardımcı olur.
            </p>
            <p style='font-size: 16px; line-height: 1.8;'>
                <strong>Nasıl Kullanılır?</strong><br>
                1️⃣ Sol menüden ev özelliklerini girin<br>
                2️⃣ İlan fiyatını belirtin<br>
                3️⃣ "FIRSAT MI? ANALİZ ET" butonuna tıklayın
            </p>
        </div>
        """, unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666; padding: 20px;'>
    <p>🤖 <strong>Model:</strong> LightGBM Regressor | R² Score: 0.8115 | RMSE: 314,981 TL</p>
    <p>📅 Eğitim Verisi: 2020 İstanbul Emlak Verileri</p>
    <p>⚠️ Bu tahminler yalnızca bilgi amaçlıdır, yatırım tavsiyesi değildir.</p>
</div>
""", unsafe_allow_html=True)
