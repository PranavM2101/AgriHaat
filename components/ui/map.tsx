"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
// @ts-ignore
import "leaflet/dist/leaflet.css";

// Fix default marker icon asset paths in Next.js/Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  description?: string;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
}

export default function InteractiveMap({
  center = [12.8342, 79.7001], // Kanchipuram region
  zoom = 9,
  markers = [],
  className = "h-[350px] w-full rounded-2xl overflow-hidden border border-[#E2E7E2]",
}: MapProps) {
  return (
    <div className={className}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-[#172019]">{marker.title}</p>
                {marker.description && <p className="text-[#687D6B] mt-0.5">{marker.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}