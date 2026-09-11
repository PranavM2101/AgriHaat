"use client";

import dynamic from "next/dynamic";
import FarmerProcurementPage from "@/app/farmer/procurement/page";

// Dynamically import the map component with SSR disabled
const InteractiveMap = dynamic(() => import("@/components/ui/map"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] w-full rounded-2xl bg-[#EEF7EF] animate-pulse flex items-center justify-center text-xs font-semibold text-[#16803A]">
      Loading Interactive Map...
    </div>
  ),
});

export default function PublicProcurementRoute() {
  const hubLocations = [
    {
      id: "hub-1",
      position: [12.8342, 79.7001] as [number, number],
      title: "Kanchipuram APMC Procurement Hub",
      description: "Active Slot Token #42 · Daily Collection",
    },
    {
      id: "hub-2",
      position: [13.0827, 80.2707] as [number, number],
      title: "Chennai Wholesale Aggregation Point",
      description: "Direct Buyer Drop-off Center",
    },
  ];

  return (
    <div className="space-y-6">
      <FarmerProcurementPage />
      <div className="px-4 md:px-8 max-w-7xl mx-auto space-y-2">
        <h3 className="text-sm font-bold text-[#172019]">Procurement & Collection Hub Locations</h3>
        <InteractiveMap center={[12.9000, 79.9000]} zoom={9} markers={hubLocations} />
      </div>
    </div>
  );
}