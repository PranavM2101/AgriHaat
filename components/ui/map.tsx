"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { AlertCircle, MapPin, Radio, Loader2 } from "lucide-react";
import { geocodePincode } from "@/lib/services/geocoding";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  description?: string;
  type?: "farm" | "delivery" | "hub" | "driver";
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  pincode?: string;
  pincodeLabel?: string;
  driverStatus?: "NOT_STARTED" | "SCHEDULED" | "IN_TRANSIT" | "DELIVERED";
  driverLocation?: { lat: number; lng: number; lastPing?: string } | null;
  className?: string;
}

export default function InteractiveMap({
  center = [12.8342, 79.7001],
  zoom = 10,
  markers = [],
  pincode,
  pincodeLabel = "Delivery Location",
  driverStatus,
  driverLocation,
  className = "h-[360px] w-full rounded-2xl overflow-hidden border border-[#E2E7E2]",
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [pincodeMarker, setPincodeMarker] = useState<MapMarker | null>(null);
  const [geocoding, setGeocoding] = useState(false);

  // Resolve pincode to genuine OpenStreetMap coordinates
  useEffect(() => {
    if (!pincode) {
      setPincodeMarker(null);
      return;
    }
    let isCurrent = true;
    setGeocoding(true);
    geocodePincode(pincode).then((geo) => {
      if (isCurrent && geo) {
        setPincodeMarker({
          id: `pin-${pincode}`,
          position: [geo.lat, geo.lng],
          title: `${pincodeLabel} (PIN: ${pincode})`,
          description: geo.displayName,
          type: "delivery",
        });
      }
      setGeocoding(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [pincode, pincodeLabel]);

  // Combine markers + pincode + real driver location
  const allMarkers = useMemo(() => {
    const list = [...markers];
    if (pincodeMarker) {
      list.push(pincodeMarker);
    }
    if (driverLocation && driverStatus === "IN_TRANSIT") {
      list.push({
        id: "active-driver-pin",
        position: [driverLocation.lat, driverLocation.lng],
        title: "Active Carrier Vehicle",
        description: `Live GPS: ${driverLocation.lat.toFixed(4)}, ${driverLocation.lng.toFixed(4)}`,
        type: "driver",
      });
    }
    return list;
  }, [markers, pincodeMarker, driverLocation, driverStatus]);

  const activeCenter = useMemo(() => {
    if (driverLocation && driverStatus === "IN_TRANSIT") {
      return [driverLocation.lat, driverLocation.lng] as [number, number];
    }
    if (pincodeMarker) {
      return pincodeMarker.position;
    }
    if (markers.length > 0) {
      return markers[0].position;
    }
    return center;
  }, [driverLocation, driverStatus, pincodeMarker, markers, center]);

  // Pure Leaflet initialization on canvas ref
  useEffect(() => {
    let isMounted = true;

    async function setupMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      const L = (await import("leaflet")).default;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: activeCenter,
          zoom: zoom,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      if (!map) return;

      map.setView(activeCenter, zoom);

      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      const driverIcon = L.divIcon({
        className: "custom-driver-pin",
        html: `<div style="background:#16803A;color:white;border-radius:50%;width:34px;height:34px;display:grid;place-items:center;box-shadow:0 4px 12px rgba(22,128,58,0.5);border:2px solid white;"><svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'><path d='M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'/><path d='M15 18H9'/><path d='M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'/><circle cx='17' cy='18' r='2'/><circle cx='7' cy='18' r='2'/></svg></div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const destinationIcon = L.divIcon({
        className: "custom-dest-pin",
        html: `<div style="background:#dc2626;color:white;border-radius:50%;width:32px;height:32px;display:grid;place-items:center;box-shadow:0 4px 12px rgba(220,38,38,0.4);border:2px solid white;"><svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'><path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/><circle cx='12' cy='10' r='3'/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 30],
      });

      allMarkers.forEach((m) => {
        const icon =
          m.type === "driver"
            ? driverIcon
            : m.type === "delivery"
            ? destinationIcon
            : defaultIcon;

        const marker = L.marker(m.position, { icon }).addTo(map);
        marker.bindPopup(
          `<div style="font-size:12px;font-family:sans-serif;padding:2px;">
            <strong>${m.title}</strong>
            ${m.description ? `<p style="margin:2px 0 0;color:#687D6B;">${m.description}</p>` : ""}
          </div>`
        );
      });
    }

    setupMap();

    return () => {
      isMounted = false;
    };
  }, [allMarkers, activeCenter, zoom]);

  const showGpsNotFound = driverStatus && driverStatus !== "IN_TRANSIT" && !driverLocation;

  return (
    <div className={`relative ${className}`}>
      {/* Real Leaflet Map Container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Top-Left Status Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col gap-2 max-w-sm">
        {showGpsNotFound && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur-md px-3 py-2 text-white shadow-md border border-amber-400">
            <AlertCircle className="size-4 shrink-0 text-amber-100" />
            <div>
              <p className="text-xs font-bold leading-tight">Driver GPS Not Found</p>
              <p className="text-[10px] text-amber-100 leading-tight">
                Vehicle has not started transit. Real GPS will activate on dispatch.
              </p>
            </div>
          </div>
        )}

        {driverStatus === "IN_TRANSIT" && driverLocation && (
          <div className="flex items-center gap-2 rounded-xl bg-[#16803A]/95 backdrop-blur-md px-3 py-2 text-white shadow-md border border-emerald-400">
            <Radio className="size-4 shrink-0 text-emerald-200 animate-pulse" />
            <div>
              <p className="text-xs font-bold leading-tight">Driver GPS Live</p>
              <p className="text-[10px] text-emerald-100 leading-tight">
                Coords: {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>
        )}

        {pincodeMarker && (
          <div className="flex items-center gap-1.5 rounded-lg bg-white/95 backdrop-blur-sm px-2.5 py-1.5 text-xs text-[#172019] shadow-sm border border-[#E2E7E2]">
            <MapPin className="size-3.5 text-[#dc2626] shrink-0" />
            <span className="font-semibold truncate">PIN {pincode}:</span>
            <span className="text-[#687D6B] truncate max-w-[180px]">{pincodeMarker.description}</span>
          </div>
        )}
      </div>

      {/* Bottom Attribution / Production Badge */}
      <div className="absolute bottom-2 right-2 z-[400] rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[#16803A] shadow-xs backdrop-blur-xs border border-[#E2E7E2]">
        Real OpenStreetMap Data · No Simulation
      </div>
    </div>
  );
}