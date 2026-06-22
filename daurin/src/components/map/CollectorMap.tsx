"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function CollectorMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      // Force clean up any stray instances before creating a new one
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      // Safe fallback to reset Leaflet's internal element cache if Strict Mode double-renders
      const container = L.DomUtil.get("vanilla-leaflet-map");
      if (container && (container as any)._leaflet_id) {
        (container as any)._leaflet_id = null;
      }

      // Configure default marker asset icons securely
      const defaultIcon = L.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      // Synchronously initialize the map instance
      const map = L.map(mapRef.current).setView([-7.983908, 112.621391], 13);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add Mock Pick-up Point Markers around Malang Area
      L.marker([-7.973908, 112.631391], { icon: defaultIcon })
        .addTo(map)
        .bindPopup("<b class='text-slate-900'>Rumah Budi (Warga)</b><br><span class='text-xs text-slate-600'>Plastik PET &bull; 12.5 Kg</span>");

      L.marker([-7.993908, 112.611391], { icon: defaultIcon })
        .addTo(map)
        .bindPopup("<b class='text-slate-900'>Rumah Siti (Warga)</b><br><span class='text-xs text-slate-600'>Kertas Kardus &bull; 8.0 Kg</span>");
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative z-0">
      <div ref={mapRef} className="w-full h-full" id="vanilla-leaflet-map" />
    </div>
  );
}
