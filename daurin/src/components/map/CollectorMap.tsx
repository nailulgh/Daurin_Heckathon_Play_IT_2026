"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon assets mapping in Next.js Leaflet client builds
const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function CollectorMap() {
  // Center map position on Malang coordinates area
  const centerPosition: [number, number] = [-7.983908, 112.621391];

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative z-0">
      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Mock Marker Point A - Rumah Budi */}
        <Marker position={[-7.973908, 112.631391]} icon={markerIcon}>
          <Popup>
            <div className="text-sm font-sans p-1">
              <p className="font-bold text-slate-900">Rumah Budi (Warga)</p>
              <p className="text-slate-600 text-xs mt-0.5">Kategori: Plastik PET &bull; 12.5 Kg</p>
            </div>
          </Popup>
        </Marker>

        {/* Mock Marker Point B - Rumah Siti */}
        <Marker position={[-7.993908, 112.611391]} icon={markerIcon}>
          <Popup>
            <div className="text-sm font-sans p-1">
              <p className="font-bold text-slate-900">Rumah Siti (Warga)</p>
              <p className="text-slate-600 text-xs mt-0.5">Kategori: Kertas Kardus &bull; 8.0 Kg</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
