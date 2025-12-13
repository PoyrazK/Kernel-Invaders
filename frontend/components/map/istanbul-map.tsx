"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

import { type LatLng, ISTANBUL_CENTER } from "@/lib/istanbul-district-centers";

export interface MapMarker {
  position: LatLng;
  title: string;
  subtitle?: string;
}

export function IstanbulMap({ markers }: { markers: MapMarker[] }) {
  const center = useMemo(() => {
    if (markers.length === 1) return markers[0].position;
    return ISTANBUL_CENTER;
  }, [markers]);

  return (
    <div className="w-full h-72 md:h-96 rounded-3xl overflow-hidden border border-border bg-muted/30">
      <MapContainer
        className="metrekare-minimap"
        center={center}
        zoom={markers.length === 1 ? 12 : 10}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        touchZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {markers.map((m) => (
          <CircleMarker
            key={`${m.title}-${m.position[0]}-${m.position[1]}`}
            center={m.position}
            radius={6}
            pathOptions={{
              color: "rgba(0,0,0,0.35)",
              weight: 1,
              fillColor: "rgba(0,0,0,0.55)",
              fillOpacity: 0.9,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={0.95} sticky>
              <div className="space-y-0.5">
                <div className="font-semibold">{m.title}</div>
                {m.subtitle && <div className="text-xs opacity-80">{m.subtitle}</div>}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
