#!/bin/bash

# Kernel-Invaiders Full Stack Başlatma Scripti
echo "🚀 Kernel-Invaiders başlatılıyor..."

# Backend başlat (arka planda)
echo "📡 Backend başlatılıyor (port 8000)..."
cd api && pip install -r requirements.txt -q && uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Frontend başlat
echo "🎨 Frontend başlatılıyor (port 3000)..."
cd ../frontend && npm install --silent && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Sistem hazır!"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Durdurmak için: Ctrl+C"

# Ctrl+C ile temiz kapatma
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
