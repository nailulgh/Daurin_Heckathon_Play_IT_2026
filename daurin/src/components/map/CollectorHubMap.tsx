"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PickupPoint } from "./RouteOptimizerPanel";

const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface CollectorHubMapProps {
  collectorLat: number;
  collectorLng: number;
  pickupPoints: PickupPoint[];
  optimizedRoute: PickupPoint[] | null;
}

export default function CollectorHubMap({
  collectorLat,
  collectorLng,
  pickupPoints,
  optimizedRoute,
}: CollectorHubMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full min-h-[500px] bg-slate-100 animate-pulse rounded-xl border border-slate-200" />;
  }

  // Draw polyline based on optimized route, starting from the collector base
  const polylinePositions = optimizedRoute
    ? [
        [collectorLat, collectorLng] as [number, number], 
        ...optimizedRoute.map((p) => [p.lat, p.lng] as [number, number])
      ]
    : [];

  return (
    <div className="h-full min-h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={[collectorLat, collectorLng]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Collector Base Marker */}
        <Marker 
          position={[collectorLat, collectorLng]}
          icon={createCustomIcon("#059669")} // emerald-600
        >
          <Popup>
            <div className="font-bold text-emerald-800">Base Pengepul</div>
            <div className="text-xs text-slate-500">Titik Awal Rute</div>
          </Popup>
        </Marker>

        {/* Pickup Points Markers */}
        {pickupPoints.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createCustomIcon("#f59e0b")} // amber-500 for pickups
          >
            <Popup>
              <div className="p-1 space-y-1">
                <div className="font-bold text-sm text-slate-900">
                  {point.label}
                </div>
                <div className="text-xs text-slate-600">
                  Berat: {point.weightKg} kg
                </div>
                <div className="mt-2 text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded w-fit">
                  {point.status}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Optimized Route Polyline */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ color: "#f59e0b", weight: 4, dashArray: "8, 8" }} // amber-500 dashed line
          />
        )}
      </MapContainer>
    </div>
  );
}
