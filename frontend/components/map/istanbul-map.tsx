"use client";

import { useMemo, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

import { type LatLng, ISTANBUL_CENTER } from "@/lib/istanbul-district-centers";
import type { InvestmentAdvice } from "@/lib/types";

// Easter egg koordinatları
const ERZURUM_CENTER: LatLng = [39.9055, 41.2658];
const BAKU_CENTER: LatLng = [40.4093, 49.8671];
const SAKARYA_CENTER: LatLng = [40.7569, 30.3783];

export interface MapMarker {
  position: LatLng;
  title: string;
  subtitle?: string;
}

export interface IstanbulMapProps {
  markers: MapMarker[];
  advice?: InvestmentAdvice;
  fairValue?: number;
  listingPrice?: number;
}

// Advice'a göre renk döndür
function getAdviceColor(advice?: InvestmentAdvice): string {
  switch (advice) {
    case "FIRSAT":
      return "#22c55e"; // green-500
    case "PAHALI":
      return "#ef4444"; // red-500
    case "NORMAL":
    default:
      return "#f59e0b"; // amber-500
  }
}

// Advice'ı Türkçe metne çevir
function getAdviceText(advice?: InvestmentAdvice): string {
  switch (advice) {
    case "FIRSAT":
      return "Fırsat";
    case "PAHALI":
      return "Pahalı";
    case "NORMAL":
    default:
      return "Normal";
  }
}

// Fiyatı formatla
function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

// Özel ev şekilli marker ikonu oluştur
function createHouseIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "custom-house-marker",
    html: `
      <div style="position: relative; width: 40px; height: 48px;">
        <svg viewBox="0 0 40 48" width="40" height="48" xmlns="http://www.w3.org/2000/svg">
          <!-- Marker gövdesi -->
          <path d="M20 0 C8.954 0 0 8.954 0 20 C0 35 20 48 20 48 C20 48 40 35 40 20 C40 8.954 31.046 0 20 0 Z" fill="${color}" stroke="white" stroke-width="2"/>
          <!-- Ev ikonu -->
          <path d="M20 10 L10 18 L10 28 L16 28 L16 22 L24 22 L24 28 L30 28 L30 18 Z" fill="white"/>
        </svg>
        <style>
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(2); opacity: 0; }
          }
          .pulse-animation {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 24px;
            height: 24px;
            margin-left: -12px;
            margin-top: -12px;
            border-radius: 50%;
            background: ${color};
            animation: pulse-ring 1.5s ease-out infinite;
          }
        </style>
        <div class="pulse-animation"></div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });
}

// Harita kontrollerini yöneten bileşen
function MapController({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

// Kalp ikonu oluştur (Easter egg için)
function createHeartIcon(): L.DivIcon {
  return L.divIcon({
    className: "custom-heart-marker",
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 28 C16 28 4 20 4 11 C4 6 8 2 13 2 C14.5 2 16 3 16 3 C16 3 17.5 2 19 2 C24 2 28 6 28 11 C28 20 16 28 16 28 Z" 
                fill="#ec4899" stroke="white" stroke-width="1.5"/>
        </svg>
        <style>
          @keyframes heart-beat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          .heart-beat-animation {
            animation: heart-beat 1s ease-in-out infinite;
          }
        </style>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

// Zoom seviyesini takip eden bileşen
function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);
  
  return null;
}

export function IstanbulMap({ markers, advice, fairValue, listingPrice }: IstanbulMapProps) {
  const [currentZoom, setCurrentZoom] = useState(13);
  
  const center = useMemo(() => {
    if (markers.length === 1) return markers[0].position;
    return ISTANBUL_CENTER;
  }, [markers]);

  const color = getAdviceColor(advice);
  const houseIcon = useMemo(() => createHouseIcon(color), [color]);
  const heartIcon = useMemo(() => createHeartIcon(), []);
  
  // Easter egg: Zoom 6 veya daha az olduğunda Erzurum'da kalp göster
  const showEasterEgg = currentZoom <= 6;

  return (
    <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden border border-border bg-muted/30">
      <MapContainer
        className="metrekare-minimap"
        center={center}
        zoom={markers.length === 1 ? 13 : 10}
        scrollWheelZoom={true}
        zoomControl={true}
        dragging={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        touchZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <MapController center={center} zoom={markers.length === 1 ? 13 : 10} />
        <ZoomTracker onZoomChange={setCurrentZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {markers.map((m) => (
          <Marker
            key={`${m.title}-${m.position[0]}-${m.position[1]}`}
            position={m.position}
            icon={houseIcon}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                {/* Başlık */}
                <div className="font-bold text-base mb-1">{m.title}</div>
                {m.subtitle && (
                  <div className="text-sm text-gray-600 mb-3">{m.subtitle}</div>
                )}
                
                {/* Fiyat bilgileri */}
                {fairValue && listingPrice && (
                  <div className="space-y-2 border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Adil Değer:</span>
                      <span className="font-semibold text-sm">{formatPrice(fairValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">İlan Fiyatı:</span>
                      <span className="font-semibold text-sm">{formatPrice(listingPrice)}</span>
                    </div>
                  </div>
                )}
                
                {/* Tavsiye badge */}
                {advice && (
                  <div className="mt-3 pt-2 border-t">
                    <div 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {getAdviceText(advice)}
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Easter Egg: Erzurum'da kalp */}
        {showEasterEgg && (
          <Marker
            position={ERZURUM_CENTER}
            icon={heartIcon}
          >
            <Popup>
              <div className="text-center p-2">
                <div className="text-lg mb-1">❤️</div>
                <div className="font-bold text-sm">Erzurum</div>
                <div className="text-xs text-gray-500 mt-1">Sevgiyle yapıldı 🏔️</div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Easter Egg: Bakü'de kalp */}
        {showEasterEgg && (
          <Marker
            position={BAKU_CENTER}
            icon={heartIcon}
          >
            <Popup>
              <div className="text-center p-2">
                <div className="text-lg mb-1">❤️</div>
                <div className="font-bold text-sm">Bakü</div>
                <div className="text-xs text-gray-500 mt-1">Bir millet, iki devlet 🇦🇿</div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Easter Egg: Sakarya'da kalp */}
        {showEasterEgg && (
          <Marker
            position={SAKARYA_CENTER}
            icon={heartIcon}
          >
            <Popup>
              <div className="text-center p-2">
                <div className="text-lg mb-1">❤️</div>
                <div className="font-bold text-sm">Sakarya</div>
                <div className="text-xs text-gray-500 mt-1">Yeşilin başkenti 🌲</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Legend */}
      {advice && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border">
          <div className="text-xs font-semibold text-muted-foreground mb-2">Değerlendirme</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs">Fırsat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs">Pahalı</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
