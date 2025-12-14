FROM python:3.11-slim

WORKDIR /app

# LightGBM için sistem bağımlılıkları
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# API bağımlılıklarını kur
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# API dosyalarını kopyala
COPY api/ .

# Model ve data dosyalarını kopyala
COPY models/ ./models/
COPY data/ ./data/
COPY processed_data.pkl .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
