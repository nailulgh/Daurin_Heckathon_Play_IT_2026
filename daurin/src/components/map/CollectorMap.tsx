"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle: string;
  color?: string; // e.g., for different waste types
}

interface CollectorMapProps {
  points?: MapPoint[];
}

export default function CollectorMap({ points = [] }: CollectorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      const container = L.DomUtil.get("vanilla-leaflet-map");
      if (container && (container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }

      const defaultIcon = L.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      // Default to Malang Raya center if no points
      const centerLat = points.length > 0 ? points[0].lat : -7.983908;
      const centerLng = points.length > 0 ? points[0].lng : 112.621391;

      const map = L.map(mapRef.current).setView([centerLat, centerLng], 13);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Render dynamic points
      points.forEach((point) => {
        L.marker([point.lat, point.lng], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`
            <b class='text-slate-900'>${point.title}</b><br>
            <span class='text-xs text-slate-600'>${point.subtitle}</span>
          `);
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [points]);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative z-0">
      <div ref={mapRef} className="w-full h-full" id="vanilla-leaflet-map" />
    </div>
  );
}
