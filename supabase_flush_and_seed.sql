-- ============================================================================
-- AgriHaat AI — 1-Click Flush & Seed Script for Supabase PostgreSQL
-- Problem Statement 26033 (Direct Marketplace) & 26032 (Procurement Queue)
-- ============================================================================
-- INSTRUCTIONS FOR LIVE DEMO / SIH PRESENTATION:
-- 1. Open your Supabase Dashboard -> SQL Editor
-- 2. Click "New Query", paste this ENTIRE file, and click "Run" (Ctrl+Enter)
-- 3. This script will:
--    - Enable required extensions (uuid-ossp, pgcrypto)
--    - Drop and recreate all 10 application tables with proper schema & RLS
--    - DIRECTLY provision 5 Real Auth Personas into auth.users & auth.identities
--      (Password for all personas: AgriHaat@2026)
--    - Seed all 10 tables with production-ready SIH demo data
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Clean Existing Public Tables (Drop in Reverse Dependency Order)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS demand_forecasts CASCADE;
DROP TABLE IF EXISTS logistics_routes CASCADE;
DROP TABLE IF EXISTS procurement_bookings CASCADE;
DROP TABLE IF EXISTS procurement_centres CASCADE;
DROP TABLE IF EXISTS order_allocations CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS produce_listings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================================
-- Table 1: Profiles
-- ============================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'fpo', 'hub', 'admin')),
    phone TEXT,
    email TEXT,
    organization TEXT,
    location TEXT,
    pincode TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    avatar_letter TEXT DEFAULT 'C',
    verified BOOLEAN DEFAULT true,
    bank_account_masked TEXT,
    bank_ifsc TEXT,
    dbt_linked BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Table 2: Produce Listings
-- ============================================================================
CREATE TABLE produce_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_name_hi TEXT,
    category TEXT NOT NULL,
    grade TEXT NOT NULL CHECK (grade IN ('A', 'B', 'Bulk')),
    price_per_kg NUMERIC(10, 2) NOT NULL,
    buyer_price_per_kg NUMERIC(10, 2) NOT NULL,
    farmer_realization_per_kg NUMERIC(10, 2) NOT NULL,
    estimated_logistics_per_kg NUMERIC(10, 2) DEFAULT 3.00,
    platform_fee_per_kg NUMERIC(10, 2) DEFAULT 1.00,
    available_quantity NUMERIC(10, 2) NOT NULL,
    total_quantity NUMERIC(10, 2) NOT NULL,
    unit TEXT DEFAULT 'kg',
    location TEXT NOT NULL,
    pincode TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    harvest_date DATE NOT NULL,
    available_until DATE,
    image_url TEXT,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING_QC', 'SOLD_OUT', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Table 3: Orders
-- ============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    buyer_id UUID REFERENCES profiles(id),
    buyer_name TEXT NOT NULL,
    buyer_organization TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_pincode TEXT,
    delivery_lat DOUBLE PRECISION,
    delivery_lng DOUBLE PRECISION,
    total_quantity_kg NUMERIC(10, 2) NOT NULL,
    total_buyer_amount NUMERIC(12, 2) NOT NULL,
    total_logistics_fee NUMERIC(10, 2) NOT NULL,
    total_platform_fee NUMERIC(10, 2) NOT NULL,
    total_farmer_payable NUMERIC(12, 2) NOT NULL,
    payment_status TEXT DEFAULT 'PROCESSING' CHECK (payment_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'DISBURSED')),
    payment_ref TEXT,
    status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Placed', 'Confirmed', 'Aggregating', 'Pickup Scheduled', 'Picked Up', 'In Transit', 'Delivered', 'Payment Processing', 'Completed', 'Cancelled')),
    pickup_scheduled_at TIMESTAMPTZ,
    estimated_delivery_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Table 4: Order Allocations (Multi-Farmer Supply Cluster)
-- ============================================================================
CREATE TABLE order_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES produce_listings(id),
    farmer_id UUID REFERENCES profiles(id),
    farmer_name TEXT NOT NULL,
    fpo_name TEXT,
    allocated_quantity_kg NUMERIC(10, 2) NOT NULL,
    rate_per_kg NUMERIC(10, 2) NOT NULL,
    farmer_realization NUMERIC(10, 2) NOT NULL,
    pickup_location TEXT NOT NULL,
    pickup_pincode TEXT,
    status TEXT DEFAULT 'Scheduled'
);

-- ============================================================================
-- Table 5: Procurement Centres (PS 26032)
-- ============================================================================
CREATE TABLE procurement_centres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    centre_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_hi TEXT,
    district TEXT NOT NULL,
    address TEXT NOT NULL,
    pincode TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    operating_hours TEXT DEFAULT '08:00 AM – 04:00 PM',
    available_slots_today INT DEFAULT 24,
    current_queue_count INT DEFAULT 8,
    avg_wait_time_minutes INT DEFAULT 42,
    now_serving_token INT DEFAULT 34,
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Crowded', 'Closed'))
);

-- ============================================================================
-- Table 6: Procurement Bookings & Token Queue (PS 26032)
-- ============================================================================
CREATE TABLE procurement_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL,
    centre_id UUID REFERENCES procurement_centres(id),
    farmer_id UUID REFERENCES profiles(id),
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    token_number INT NOT NULL,
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    produce_name TEXT NOT NULL,
    expected_quantity_kg NUMERIC(10, 2) NOT NULL,
    accepted_quantity_kg NUMERIC(10, 2),
    rate_per_kg NUMERIC(10, 2) NOT NULL,
    payment_amount NUMERIC(12, 2),
    payment_status TEXT DEFAULT 'Processing' CHECK (payment_status IN ('Pending', 'Processing', 'Completed')),
    payment_ref TEXT,
    status TEXT DEFAULT 'In Queue' CHECK (status IN ('Slot Confirmed', 'Checked In', 'In Queue', 'Quality Check', 'Accepted', 'Payment Processing', 'Payment Completed')),
    estimated_wait_minutes INT DEFAULT 42,
    farmers_ahead INT DEFAULT 8,
    qr_code_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Table 7: Logistics Routes
-- ============================================================================
CREATE TABLE logistics_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_code TEXT UNIQUE NOT NULL,
    carrier_name TEXT NOT NULL,
    vehicle_number TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    total_distance_km NUMERIC(8, 2) NOT NULL,
    distance_saved_km NUMERIC(8, 2) DEFAULT 18.00,
    estimated_duration TEXT DEFAULT '4h 20m',
    total_weight_kg NUMERIC(10, 2) NOT NULL,
    capacity_kg NUMERIC(10, 2) DEFAULT 3000.00,
    status TEXT DEFAULT 'In Transit' CHECK (status IN ('Scheduled', 'In Transit', 'Delivered', 'Completed')),
    reefer_temperature_celsius NUMERIC(4, 1) DEFAULT 14.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Table 8: Demand Forecasts
-- ============================================================================
CREATE TABLE demand_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name TEXT NOT NULL,
    region TEXT NOT NULL,
    forecast_period TEXT NOT NULL,
    expected_demand_kg NUMERIC(12, 2) NOT NULL,
    change_percent NUMERIC(5, 2) NOT NULL,
    confidence_percent INT NOT NULL,
    recommendation TEXT NOT NULL,
    recommendation_hi TEXT,
    factors JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Table 9: Notifications
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    title_hi TEXT,
    message TEXT NOT NULL,
    message_hi TEXT,
    category TEXT NOT NULL CHECK (category IN ('ORDER', 'PROCUREMENT', 'PRICE', 'PAYMENT', 'SYSTEM')),
    read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Table 10: Platform Audit Logs
-- ============================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    actor_id TEXT,
    details JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Public full access produce listings" ON produce_listings FOR ALL USING (true);
CREATE POLICY "Public full access orders" ON orders FOR ALL USING (true);
CREATE POLICY "Public full access order allocations" ON order_allocations FOR ALL USING (true);
CREATE POLICY "Public full access procurement centres" ON procurement_centres FOR ALL USING (true);
CREATE POLICY "Public full access procurement bookings" ON procurement_bookings FOR ALL USING (true);
CREATE POLICY "Public full access logistics routes" ON logistics_routes FOR ALL USING (true);
CREATE POLICY "Public full access demand forecasts" ON demand_forecasts FOR ALL USING (true);
CREATE POLICY "Public full access notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Public full access audit logs" ON audit_logs FOR ALL USING (true);

-- ============================================================================
-- 🔐 PROVISION REAL SUPABASE AUTH USERS (auth.users + auth.identities)
-- Password for all personas: AgriHaat@2026
-- ============================================================================

-- Clean old auth identities and users if present
DELETE FROM auth.identities WHERE user_id IN (
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'b2222222-2222-2222-2222-222222222222'::uuid,
    'c3333333-3333-3333-3333-333333333333'::uuid,
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'e5555555-5555-5555-5555-555555555555'::uuid
);

DELETE FROM auth.users WHERE id IN (
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'b2222222-2222-2222-2222-222222222222'::uuid,
    'c3333333-3333-3333-3333-333333333333'::uuid,
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'e5555555-5555-5555-5555-555555555555'::uuid
) OR email IN (
    'ramesh.k@abcfpo.in',
    'anita.rao@abcrestaurants.com',
    'murugan@chennaisupplyhub.in',
    'suresh@greenfieldsfpo.org',
    'ops@agrihaat.ai'
);

-- Persona 1: Farmer (Ramesh Kumar)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, phone_change, phone_change_token,
    reauthentication_token, email_change_confirm_status, is_sso_user, is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'authenticated', 'authenticated', 'ramesh.k@abcfpo.in',
    crypt('AgriHaat@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Ramesh Kumar","role":"farmer"}'::jsonb,
    NOW(), NOW(), '', '', '', '', '', '', '', 0, false, false
);

INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'a1111111-1111-1111-1111-111111111111'::uuid,
    '{"sub":"a1111111-1111-1111-1111-111111111111","email":"ramesh.k@abcfpo.in"}'::jsonb,
    'email',
    'a1111111-1111-1111-1111-111111111111',
    NOW(), NOW(), NOW()
);

-- Persona 2: Buyer (Anita Rao)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, phone_change, phone_change_token,
    reauthentication_token, email_change_confirm_status, is_sso_user, is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    'authenticated', 'authenticated', 'anita.rao@abcrestaurants.com',
    crypt('AgriHaat@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Anita Rao","role":"buyer"}'::jsonb,
    NOW(), NOW(), '', '', '', '', '', '', '', 0, false, false
);

INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'b2222222-2222-2222-2222-222222222222'::uuid,
    '{"sub":"b2222222-2222-2222-2222-222222222222","email":"anita.rao@abcrestaurants.com"}'::jsonb,
    'email',
    'b2222222-2222-2222-2222-222222222222',
    NOW(), NOW(), NOW()
);

-- Persona 3: Hub & Logistics Driver (Murugan S.)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, phone_change, phone_change_token,
    reauthentication_token, email_change_confirm_status, is_sso_user, is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'c3333333-3333-3333-3333-333333333333'::uuid,
    'authenticated', 'authenticated', 'murugan@chennaisupplyhub.in',
    crypt('AgriHaat@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Murugan S.","role":"hub"}'::jsonb,
    NOW(), NOW(), '', '', '', '', '', '', '', 0, false, false
);

INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'c3333333-3333-3333-3333-333333333333'::uuid,
    '{"sub":"c3333333-3333-3333-3333-333333333333","email":"murugan@chennaisupplyhub.in"}'::jsonb,
    'email',
    'c3333333-3333-3333-3333-333333333333',
    NOW(), NOW(), NOW()
);

-- Persona 4: FPO Lead & Farmer (Suresh Reddy)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, phone_change, phone_change_token,
    reauthentication_token, email_change_confirm_status, is_sso_user, is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'authenticated', 'authenticated', 'suresh@greenfieldsfpo.org',
    crypt('AgriHaat@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Suresh Reddy","role":"farmer"}'::jsonb,
    NOW(), NOW(), '', '', '', '', '', '', '', 0, false, false
);

INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'd4444444-4444-4444-4444-444444444444'::uuid,
    '{"sub":"d4444444-4444-4444-4444-444444444444","email":"suresh@greenfieldsfpo.org"}'::jsonb,
    'email',
    'd4444444-4444-4444-4444-444444444444',
    NOW(), NOW(), NOW()
);

-- Persona 5: AgriHaat Central Admin
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change, phone_change, phone_change_token,
    reauthentication_token, email_change_confirm_status, is_sso_user, is_anonymous
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'e5555555-5555-5555-5555-555555555555'::uuid,
    'authenticated', 'authenticated', 'ops@agrihaat.ai',
    crypt('AgriHaat@2026', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"AgriHaat Central Admin","role":"admin"}'::jsonb,
    NOW(), NOW(), '', '', '', '', '', '', '', 0, false, false
);

INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'e5555555-5555-5555-5555-555555555555'::uuid,
    '{"sub":"e5555555-5555-5555-5555-555555555555","email":"ops@agrihaat.ai"}'::jsonb,
    'email',
    'e5555555-5555-5555-5555-555555555555',
    NOW(), NOW(), NOW()
);

-- ============================================================================
-- 🚀 POPULATE REALISTIC DEMONSTRATION SEED DATA
-- ============================================================================

-- 1. Insert 5 Verified User Profiles linked to auth.users
INSERT INTO profiles (id, user_id, full_name, role, phone, email, organization, location, pincode, lat, lng, avatar_letter, bank_account_masked, bank_ifsc, dbt_linked, verified)
VALUES 
(
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'Ramesh Kumar',
    'farmer',
    '+91 98401 23456',
    'ramesh.k@abcfpo.in',
    'ABC Farmer Producer Organization',
    'Kanchipuram, Tamil Nadu',
    '631501',
    12.8342,
    79.7036,
    'R',
    '•••• •••• •••• 4892',
    'SBIN0001234',
    true,
    true
),
(
    'b2222222-2222-2222-2222-222222222222'::uuid,
    'b2222222-2222-2222-2222-222222222222'::uuid,
    'Anita Rao',
    'buyer',
    '+91 97100 88990',
    'anita.rao@abcrestaurants.com',
    'ABC Grand Hotels & Restaurants',
    'Thousand Lights, Chennai',
    '600006',
    13.0604,
    80.2496,
    'A',
    '•••• •••• •••• 9102',
    'HDFC0000120',
    true,
    true
),
(
    'c3333333-3333-3333-3333-333333333333'::uuid,
    'c3333333-3333-3333-3333-333333333333'::uuid,
    'Murugan S.',
    'hub',
    '+91 94440 55667',
    'murugan@chennaisupplyhub.in',
    'Kanchipuram-Walajabad Collection Hub',
    'Walajabad Junction, TN',
    '631605',
    12.8120,
    79.8240,
    'M',
    '•••• •••• •••• 3341',
    'ICIC0000551',
    true,
    true
),
(
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'Suresh Reddy',
    'farmer',
    '+91 94400 88776',
    'suresh@greenfieldsfpo.org',
    'GreenFields Farmer Producer Co.',
    'Walajabad, Tamil Nadu',
    '631605',
    12.8120,
    79.8240,
    'S',
    '•••• •••• •••• 1129',
    'IOBA0001948',
    true,
    true
),
(
    'e5555555-5555-5555-5555-555555555555'::uuid,
    'e5555555-5555-5555-5555-555555555555'::uuid,
    'AgriHaat Central Admin',
    'admin',
    '+91 98400 00000',
    'ops@agrihaat.ai',
    'AgriHaat AI Central Operations',
    'Bengaluru / Chennai',
    '560001',
    12.9716,
    77.5946,
    'A',
    '•••• •••• •••• 0001',
    'SBIN0000001',
    true,
    true
);

-- 2. Insert 8 Produce Listings with Realistic Pricing & Margin Realization
INSERT INTO produce_listings (id, farmer_id, product_name, product_name_hi, category, grade, price_per_kg, buyer_price_per_kg, farmer_realization_per_kg, estimated_logistics_per_kg, platform_fee_per_kg, available_quantity, total_quantity, unit, location, pincode, lat, lng, harvest_date, image_url, status)
VALUES 
(
    '11111111-0001-0000-0000-000000000001'::uuid,
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'Tomatoes (Grade A)',
    'टमाटर (ग्रेड A)',
    'Vegetables',
    'A',
    32.00,
    36.00,
    32.00,
    3.00,
    1.00,
    500.00,
    800.00,
    'kg',
    'Kanchipuram, Tamil Nadu',
    '631501',
    12.8342,
    79.7036,
    CURRENT_DATE - INTERVAL '1 day',
    '/tomatoes-market.png',
    'ACTIVE'
),
(
    '11111111-0002-0000-0000-000000000002'::uuid,
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'Red Onions (Grade A)',
    'लाल प्याज (ग्रेड A)',
    'Vegetables',
    'A',
    28.00,
    32.00,
    28.00,
    3.00,
    1.00,
    750.00,
    1200.00,
    'kg',
    'Walajabad, Tamil Nadu',
    '631605',
    12.8120,
    79.8240,
    CURRENT_DATE - INTERVAL '2 days',
    '/onion.jpg',
    'ACTIVE'
),
(
    '11111111-0003-0000-0000-000000000003'::uuid,
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'Baby Potatoes (Grade A)',
    'छोटे आलू (ग्रेड A)',
    'Vegetables',
    'A',
    22.00,
    26.00,
    22.00,
    3.00,
    1.00,
    1200.00,
    2000.00,
    'kg',
    'Kanchipuram, Tamil Nadu',
    '631501',
    12.8342,
    79.7036,
    CURRENT_DATE - INTERVAL '3 days',
    '/potato.jpg',
    'ACTIVE'
),
(
    '11111111-0004-0000-0000-000000000004'::uuid,
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'Green Chillies (G4 Fresh)',
    'हरी मिर्च (G4 ताज़ा)',
    'Vegetables',
    'A',
    48.00,
    52.00,
    48.00,
    3.00,
    1.00,
    350.00,
    500.00,
    'kg',
    'Chengalpattu, Tamil Nadu',
    '603001',
    12.6819,
    79.9888,
    CURRENT_DATE,
    '/placeholder.jpg',
    'ACTIVE'
),
(
    '11111111-0005-0000-0000-000000000005'::uuid,
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'Basmati Rice (Pusa 1121)',
    'बासमती चावल (पूसा 1121)',
    'Grains',
    'A',
    75.00,
    80.00,
    75.00,
    4.00,
    1.00,
    2500.00,
    5000.00,
    'kg',
    'Kanchipuram, Tamil Nadu',
    '631501',
    12.8342,
    79.7036,
    CURRENT_DATE - INTERVAL '5 days',
    '/placeholder.jpg',
    'ACTIVE'
),
(
    '11111111-0006-0000-0000-000000000006'::uuid,
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'Fresh Cabbage (Green Head)',
    'पत्तागोभी (हरी)',
    'Vegetables',
    'A',
    18.00,
    22.00,
    18.00,
    3.00,
    1.00,
    900.00,
    1500.00,
    'kg',
    'Walajabad, Tamil Nadu',
    '631605',
    12.8120,
    79.8240,
    CURRENT_DATE - INTERVAL '1 day',
    '/placeholder.jpg',
    'ACTIVE'
),
(
    '11111111-0007-0000-0000-000000000007'::uuid,
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'Ooty Carrots (Grade A)',
    'ऊटी गाजर (ग्रेड A)',
    'Vegetables',
    'A',
    42.00,
    47.00,
    42.00,
    4.00,
    1.00,
    600.00,
    1000.00,
    'kg',
    'Kanchipuram, Tamil Nadu',
    '631501',
    12.8342,
    79.7036,
    CURRENT_DATE - INTERVAL '2 days',
    '/placeholder.jpg',
    'ACTIVE'
),
(
    '11111111-0008-0000-0000-000000000008'::uuid,
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'Cavendish Bananas (Robusta)',
    'केला (रोबस्टा)',
    'Fruits',
    'A',
    25.00,
    29.00,
    25.00,
    3.00,
    1.00,
    1500.00,
    2500.00,
    'kg',
    'Walajabad, Tamil Nadu',
    '631605',
    12.8120,
    79.8240,
    CURRENT_DATE,
    '/placeholder.jpg',
    'ACTIVE'
);

-- 3. Insert 3 Operational Procurement Centres (PS 26032)
INSERT INTO procurement_centres (id, centre_code, name, name_hi, district, address, pincode, lat, lng, available_slots_today, current_queue_count, avg_wait_time_minutes, now_serving_token, status)
VALUES 
(
    '22222222-0001-0000-0000-000000000001'::uuid,
    'PROC-CTR-KCH-01',
    'Kanchipuram District Procurement Centre',
    'कांचीपुरम जिला खरीद केंद्र',
    'Kanchipuram',
    'State Highway 58, Near Agricultural Marketing Complex, Kanchipuram',
    '631501',
    12.8342,
    79.7036,
    18,
    8,
    42,
    34,
    'Open'
),
(
    '22222222-0002-0000-0000-000000000002'::uuid,
    'PROC-CTR-WLJ-02',
    'Walajabad Regulated Market & QC Centre',
    'वालाजाबाद विनियमित मंडी खरीद केंद्र',
    'Kanchipuram',
    'Mandi Road, Walajabad Taluk',
    '631605',
    12.8120,
    79.8240,
    24,
    4,
    25,
    19,
    'Open'
),
(
    '22222222-0003-0000-0000-000000000003'::uuid,
    'PROC-CTR-CPT-03',
    'Chengalpattu Collection & Cold Chain Hub',
    'चेंगलपट्टू संग्रह एवं कोल्ड चेन हब',
    'Chengalpattu',
    'GST Road, Opposite Collectorate, Chengalpattu',
    '603001',
    12.6819,
    79.9888,
    12,
    11,
    55,
    28,
    'Crowded'
);

-- 4. Insert Active Digital Queue Bookings (PS 26032)
INSERT INTO procurement_bookings (id, booking_code, centre_id, farmer_id, farmer_name, farmer_phone, token_number, booking_date, time_slot, produce_name, expected_quantity_kg, accepted_quantity_kg, rate_per_kg, payment_amount, payment_status, payment_ref, status, estimated_wait_minutes, farmers_ahead, qr_code_url)
VALUES 
(
    '33333333-0001-0000-0000-000000000001'::uuid,
    'FM-PROC-00421',
    '22222222-0001-0000-0000-000000000001'::uuid,
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'Ramesh Kumar',
    '+91 98401 23456',
    42,
    CURRENT_DATE,
    '10:30 AM – 11:00 AM',
    'Tomatoes',
    500.00,
    480.00,
    32.00,
    15360.00,
    'Processing',
    'PAY-DBT-20260831-42',
    'In Queue',
    42,
    8,
    'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=AGRIHAAT-PROC-TOKEN-42'
),
(
    '33333333-0002-0000-0000-000000000002'::uuid,
    'FM-PROC-00422',
    '22222222-0002-0000-0000-000000000002'::uuid,
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'Suresh Reddy',
    '+91 94400 88776',
    21,
    CURRENT_DATE,
    '11:30 AM – 12:00 PM',
    'Red Onions',
    800.00,
    800.00,
    28.00,
    22400.00,
    'Completed',
    'PAY-DBT-20260831-21',
    'Payment Completed',
    0,
    0,
    'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=AGRIHAAT-PROC-TOKEN-21'
);

-- 5. Insert Realistic Bulk Orders & Direct Farmer Realizations (PS 26033)
INSERT INTO orders (id, order_number, buyer_id, buyer_name, buyer_organization, buyer_phone, delivery_address, delivery_city, delivery_pincode, delivery_lat, delivery_lng, total_quantity_kg, total_buyer_amount, total_logistics_fee, total_platform_fee, total_farmer_payable, payment_status, payment_ref, status, pickup_scheduled_at, estimated_delivery_at)
VALUES 
(
    '44444444-0001-0000-0000-000000000001'::uuid,
    'FM-2026-00421',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    'Anita Rao',
    'ABC Grand Hotels & Restaurants',
    '+91 97100 88990',
    'No. 42 Anna Salai, Thousand Lights',
    'Chennai',
    '600006',
    13.0604,
    80.2496,
    500.00,
    18000.00,
    1500.00,
    500.00,
    16000.00,
    'PROCESSING',
    'PAY-ORD-00421',
    'Confirmed',
    NOW() + INTERVAL '12 hours',
    NOW() + INTERVAL '18 hours'
),
(
    '44444444-0002-0000-0000-000000000002'::uuid,
    'FM-2026-00398',
    'b2222222-2222-2222-2222-222222222222'::uuid,
    'Anita Rao',
    'ABC Grand Hotels & Restaurants',
    '+91 97100 88990',
    'No. 42 Anna Salai, Thousand Lights',
    'Chennai',
    '600006',
    13.0604,
    80.2496,
    1200.00,
    38400.00,
    3600.00,
    1200.00,
    33600.00,
    'COMPLETED',
    'PAY-ORD-00398',
    'Delivered',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '18 hours'
);

-- 6. Insert Order Allocation Breakdown (Multi-Farm Aggregation)
INSERT INTO order_allocations (id, order_id, listing_id, farmer_id, farmer_name, fpo_name, allocated_quantity_kg, rate_per_kg, farmer_realization, pickup_location, pickup_pincode, status)
VALUES 
(
    '55555555-0001-0000-0000-000000000001'::uuid,
    '44444444-0001-0000-0000-000000000001'::uuid,
    '11111111-0001-0000-0000-000000000001'::uuid,
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'Ramesh Kumar',
    'ABC Farmer Producer Organization',
    300.00,
    32.00,
    9600.00,
    'Kanchipuram Hub Cluster',
    '631501',
    'Pickup Scheduled'
),
(
    '55555555-0002-0000-0000-000000000002'::uuid,
    '44444444-0001-0000-0000-000000000001'::uuid,
    '11111111-0002-0000-0000-000000000002'::uuid,
    'd4444444-4444-4444-4444-444444444444'::uuid,
    'Suresh Reddy',
    'GreenFields Farmer Producer Co.',
    200.00,
    32.00,
    6400.00,
    'Walajabad Collection Point',
    '631605',
    'Pickup Scheduled'
);

-- 7. Insert Aggregated Logistics Route (124 km route, Reefer tracking)
INSERT INTO logistics_routes (id, route_code, carrier_name, vehicle_number, driver_name, driver_phone, total_distance_km, distance_saved_km, estimated_duration, total_weight_kg, capacity_kg, status, reefer_temperature_celsius)
VALUES 
(
    '66666666-0001-0000-0000-000000000001'::uuid,
    'RT-KCH-CHE-01',
    'AgriHaat Green Logistics',
    'TN-21-CA-4892',
    'Murugan S.',
    '+91 94440 55667',
    124.00,
    18.00,
    '4h 20m',
    2100.00,
    3000.00,
    'In Transit',
    14.2
);

-- 8. Insert Grounded Demand Forecasts
INSERT INTO demand_forecasts (id, product_name, region, forecast_period, expected_demand_kg, change_percent, confidence_percent, recommendation, recommendation_hi, factors)
VALUES 
(
    '77777777-0001-0000-0000-000000000001'::uuid,
    'Tomatoes (Grade A)',
    'Chennai Metropolitan Region',
    'Next 7 Days',
    18400.00,
    12.5,
    94,
    'High restaurant procurement surge anticipated from Wednesday through Saturday. Recommend listing at ₹32–₹34/kg for maximum farm gate realization.',
    'बुधवार से शनिवार तक रेस्तरां खरीद में भारी वृद्धि की उम्मीद है। ₹32-₹34/किग्रा पर लिस्ट करने की सलाह दी जाती है।',
    '{"festival_demand": "High", "wholesale_supply_gap": "14%", "weather_risk": "Low"}'::jsonb
),
(
    '77777777-0002-0000-0000-000000000002'::uuid,
    'Red Onions (Grade A)',
    'Kanchipuram & Chengalpattu',
    'Next 14 Days',
    24500.00,
    8.2,
    91,
    'Stable market demand with steady institutional buying. Safe to aggregate farm clusters for single dispatch.',
    'स्थिर मांग के साथ नियमित संस्थागत खरीद जारी है। सिंगल डिस्पैच के लिए किसान क्लस्टर जोड़ें।',
    '{"mandi_arrival_rate": "Moderate", "storage_index": "88%"}'::jsonb
);

-- 9. Insert Realistic User Notifications
INSERT INTO notifications (id, user_id, title, title_hi, message, message_hi, category, read, link)
VALUES 
(
    '88888888-0001-0000-0000-000000000001'::uuid,
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'Bulk Order Allocated: 500 kg Tomatoes',
    'थोक ऑर्डर आवंटित: 500 किग्रा टमाटर',
    'ABC Grand Hotels Chennai confirmed Order #FM-2026-00421. Pickup scheduled tomorrow at 08:30 AM.',
    'ABC ग्रैंड होटल्स चेन्नई ने ऑर्डर #FM-2026-00421 की पुष्टि की। कल सुबह 08:30 बजे पिकअप शेड्यूल है।',
    'ORDER',
    false,
    '/farmer/orders'
),
(
    '88888888-0002-0000-0000-000000000002'::uuid,
    'a1111111-1111-1111-1111-111111111111'::uuid,
    'Procurement Slot Token #42 Active',
    'खरीद टोकन #42 सक्रिय',
    'Kanchipuram Centre is currently serving Token #34. Estimated wait time: 42 minutes.',
    'कांचीपुरम केंद्र वर्तमान में टोकन #34 की सेवा कर रहा है। अनुमानित प्रतीक्षा समय: 42 मिनट।',
    'PROCUREMENT',
    false,
    '/farmer/procurement'
);
