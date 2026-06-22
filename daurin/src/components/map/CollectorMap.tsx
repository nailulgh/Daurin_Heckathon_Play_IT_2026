"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// CRITICAL: Fix default icon issue in Next.js
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const WASTE_COLORS: Record<string, string> = {
  PLASTIK_PET: "#38BDF8", // sky
  PLASTIK_HDPE: "#34D399", // emerald
  KERTAS_KARDUS: "#FCD34D", // yellow
  LOGAM_KALENG: "#94A3B8", // gray
  KACA: "#2DD4BF", // teal
  ELEKTRONIK: "#A78BFA", // purple
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface CollectorMapProps {
  collectorLat: number;
  collectorLng: number;
  listings: Array<{
    id: string;
    lat: number;
    lng: number;
    wasteType: string;
    weightKg: number;
    pricePerKg: number;
    description?: string;
  }>;
  onClaim: (id: string) => void;
  optimizedRoute?: Array<{ lat: number; lng: number }>;
}

export default function CollectorMap({
  collectorLat,
  collectorLng,
  listings,
  onClaim,
  optimizedRoute,
}: CollectorMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[500px] w-full bg-green-50 animate-pulse rounded-lg border border-green-200" />;
  }

  const polylinePositions = optimizedRoute
    ? [[collectorLat, collectorLng] as [number, number], ...optimizedRoute.map((p) => [p.lat, p.lng] as [number, number])]
    : [];

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border border-green-200 shadow-sm relative z-0">
      <MapContainer
        center={[collectorLat, collectorLng]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Collector Location */}
        <Marker position={[collectorLat, collectorLng]}>
          <Popup>
            <div className="font-semibold text-green-700">Lokasi Anda (Base)</div>
          </Popup>
        </Marker>

        {/* Waste Listings */}
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            icon={createCustomIcon(WASTE_COLORS[listing.wasteType] || "#000")}
          >
            <Popup>
              <div className="p-1 space-y-2">
                <div className="font-bold text-sm text-green-800">
                  {listing.wasteType.replace("_", " ")}
                </div>
                <div className="text-xs text-gray-600">
                  Berat: {listing.weightKg} kg <br />
                  Harga: Rp{listing.pricePerKg.toLocaleString("id-ID")}/kg
                </div>
                {listing.description && (
                  <div className="text-xs italic text-gray-500">
                    "{listing.description}"
                  </div>
                )}
                <button
                  onClick={() => onClaim(listing.id)}
                  className="w-full mt-2 bg-amber-500 text-white text-xs font-semibold py-1.5 px-3 rounded hover:bg-amber-600 transition-colors"
                >
                  Klaim Sekarang
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Polyline */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ color: "#3B82F6", weight: 4, dashArray: "10, 10" }}
          />
        )}
      </MapContainer>
    </div>
  );
}
