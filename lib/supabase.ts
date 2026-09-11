import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://oukoidwiwtdckkatmpbv.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "PASTE_YOUR_SUPABASE_ANON_KEY_HERE"
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91a29pZHdpd3RkY2trYXRtcGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTYwMDAsImV4cCI6MjAyNTQzMjAwMH0.placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Database Types (matching supabase_schema.sql) ───

export interface DbProfile {
  id: string;
  user_id: string | null;
  full_name: string;
  role: "farmer" | "buyer" | "fpo" | "hub" | "admin";
  phone: string | null;
  email: string | null;
  organization: string | null;
  location: string | null;
  pincode: string | null;
  lat: number | null;
  lng: number | null;
  avatar_letter: string;
  verified: boolean;
  bank_account_masked: string | null;
  bank_ifsc: string | null;
  dbt_linked: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProduceListing {
  id: string;
  farmer_id: string;
  product_name: string;
  product_name_hi: string | null;
  category: string;
  grade: "A" | "B" | "Bulk";
  price_per_kg: number;
  buyer_price_per_kg: number;
  farmer_realization_per_kg: number;
  estimated_logistics_per_kg: number;
  platform_fee_per_kg: number;
  available_quantity: number;
  total_quantity: number;
  unit: string;
  location: string;
  pincode: string | null;
  lat: number | null;
  lng: number | null;
  harvest_date: string;
  available_until: string | null;
  image_url: string | null;
  status: "ACTIVE" | "PENDING_QC" | "SOLD_OUT" | "CANCELLED";
  created_at: string;
  // Joined
  profiles?: DbProfile;
}

export interface DbOrder {
  id: string;
  order_number: string;
  buyer_id: string;
  buyer_name: string;
  buyer_organization: string;
  buyer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_pincode: string | null;
  delivery_lat: number | null;
  delivery_lng: number | null;
  total_quantity_kg: number;
  total_buyer_amount: number;
  total_logistics_fee: number;
  total_platform_fee: number;
  total_farmer_payable: number;
  payment_status: "PENDING" | "PROCESSING" | "COMPLETED" | "DISBURSED";
  payment_ref: string | null;
  status: string;
  pickup_scheduled_at: string | null;
  estimated_delivery_at: string | null;
  created_at: string;
}

export interface DbProcurementCentre {
  id: string;
  centre_code: string;
  name: string;
  name_hi: string | null;
  district: string;
  address: string;
  pincode: string | null;
  lat: number | null;
  lng: number | null;
  operating_hours: string;
  available_slots_today: number;
  current_queue_count: number;
  avg_wait_time_minutes: number;
  now_serving_token: number;
  status: "Open" | "Crowded" | "Closed";
}

export interface DbProcurementBooking {
  id: string;
  booking_code: string;
  centre_id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone: string;
  token_number: number;
  booking_date: string;
  time_slot: string;
  produce_name: string;
  expected_quantity_kg: number;
  accepted_quantity_kg: number | null;
  rate_per_kg: number;
  payment_amount: number | null;
  payment_status: "Pending" | "Processing" | "Completed";
  payment_ref: string | null;
  status: string;
  estimated_wait_minutes: number;
  farmers_ahead: number;
  qr_code_url: string | null;
  created_at: string;
  // Joined
  procurement_centres?: DbProcurementCentre;
}

export interface DbLogisticsRoute {
  id: string;
  route_code: string;
  carrier_name: string;
  vehicle_number: string;
  driver_name: string;
  driver_phone: string;
  total_distance_km: number;
  distance_saved_km: number;
  estimated_duration: string;
  total_weight_kg: number;
  capacity_kg: number;
  status: "Scheduled" | "In Transit" | "Delivered" | "Completed";
  reefer_temperature_celsius: number;
  created_at: string;
}

export interface DbDemandForecast {
  id: string;
  product_name: string;
  region: string;
  forecast_period: string;
  expected_demand_kg: number;
  change_percent: number;
  confidence_percent: number;
  recommendation: string;
  recommendation_hi: string | null;
  factors: Record<string, any>;
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  title: string;
  title_hi: string | null;
  message: string;
  message_hi: string | null;
  category: "ORDER" | "PROCUREMENT" | "PRICE" | "PAYMENT" | "SYSTEM";
  read: boolean;
  link: string | null;
  created_at: string;
}

export interface DbOrderAllocation {
  id: string;
  order_id: string;
  listing_id: string;
  farmer_id: string;
  farmer_name: string;
  fpo_name: string | null;
  allocated_quantity_kg: number;
  rate_per_kg: number;
  farmer_realization: number;
  pickup_location: string;
  pickup_pincode: string | null;
  status: string;
}
// Live Connection Verification helper
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("produce_listings").select("id").limit(1);
    if (error && error.code !== "PGRST116") {
      console.warn("Supabase connection check warning:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase connection error:", err);
    return false;
  }
}
