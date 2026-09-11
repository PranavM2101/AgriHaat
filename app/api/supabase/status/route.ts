import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const [
      { count: listingsCount, error: listingsError },
      { count: ordersCount, error: ordersError },
      { count: centresCount, error: centresError },
      { count: profilesCount, error: profilesError },
    ] = await Promise.all([
      supabase.from("produce_listings").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("procurement_centres").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

    const isConnected = !listingsError && !ordersError;

    return NextResponse.json({
      connected: isConnected,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oukoidwiwtdckkatmpbv.supabase.co",
      tables: {
        produce_listings: listingsCount ?? 0,
        orders: ordersCount ?? 0,
        procurement_centres: centresCount ?? 0,
        profiles: profilesCount ?? 0,
      },
      errors: {
        listings: listingsError?.message || null,
        orders: ordersError?.message || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        connected: false,
        error: err?.message || "Failed to query Supabase status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
