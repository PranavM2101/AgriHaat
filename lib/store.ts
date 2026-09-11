// ─── Farm2Market AI — Central Data Store & Entity Types ───
// Supports offline-first mock state with localStorage persistence,
// ready to swap with Supabase / PostgreSQL backend seamlessly.

export type Role = "FARMER" | "FPO" | "BUYER" | "LOGISTICS" | "PROCUREMENT_OPERATOR" | "ADMIN";

export type OrderStatus =
  | "Draft"
  | "Placed"
  | "Confirmed"
  | "Aggregating"
  | "Pickup Scheduled"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Payment Processing"
  | "Completed"
  | "Cancelled";

export type ProcurementStatus =
  | "Slot Booked"
  | "Checked In"
  | "In Queue"
  | "Under Quality Check"
  | "Produce Accepted"
  | "Payment Processing"
  | "Payment Completed";

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  fpoName?: string;
  productName: string;
  productNameHi: string;
  category: "Vegetables" | "Fruits" | "Grains" | "Pulses" | "Spices";
  grade: "A" | "B" | "Bulk";
  totalQuantity: number;
  availableQuantity: number;
  unit: "kg" | "quintal" | "tonne";
  pricePerKg: number;
  buyerPricePerKg: number;
  estimatedLogisticsPerKg: number;
  platformFeePerKg: number;
  farmerRealizationPerKg: number;
  harvestDate: string;
  availabilityWindow: { from: string; to: string };
  location: string;
  district: string;
  state: string;
  verified: boolean;
  image: string;
  createdAt: string;
}

export interface OrderItem {
  listingId: string;
  productName: string;
  quantity: number;
  pricePerKg: number;
  totalPrice: number;
}

export interface OrderAllocation {
  farmerId: string;
  farmerName: string;
  location: string;
  allocatedKg: number;
  pricePerKg: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerOrganization: string;
  buyerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  items: OrderItem[];
  allocations: OrderAllocation[];
  totalQuantityKg: number;
  totalBuyerAmount: number;
  totalLogisticsFee: number;
  totalPlatformFee: number;
  totalFarmerPayable: number;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[];
  pickupScheduledAt?: string;
  estimatedDeliveryAt?: string;
  deliveredAt?: string;
  trackingRouteId?: string;
  paymentRef?: string;
  createdAt: string;
}

export interface ProcurementCentre {
  id: string;
  name: string;
  nameHi: string;
  district: string;
  state: string;
  distanceKm: number;
  address: string;
  operatingHours: string;
  contactNumber: string;
  availableSlotsToday: number;
  avgWaitTimeMinutes: number;
  currentQueueCount: number;
  nowServingToken: number;
  status: "Open" | "Closing Soon" | "Closed";
  supportedProduce: string[];
}

export interface ProcurementBooking {
  id: string;
  bookingCode: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  centreId: string;
  centreName: string;
  centreLocation: string;
  date: string;
  timeSlot: string;
  produceName: string;
  produceNameHi: string;
  expectedQuantityKg: number;
  acceptedQuantityKg?: number;
  ratePerKg: number;
  tokenNumber: number;
  farmersAhead: number;
  estimatedWaitMinutes: number;
  status: ProcurementStatus;
  timeline: { step: string; timestamp: string; completed: boolean }[];
  paymentAmount?: number;
  paymentStatus: "Pending Inspection" | "Processing" | "Completed";
  paymentReference?: string;
  paymentDate?: string;
  qrCodeUrl: string;
  createdAt: string;
}

export interface RouteStop {
  id: string;
  sequence: number;
  stopName: string;
  type: "PICKUP" | "HUB" | "DELIVERY";
  farmerName?: string;
  quantityKg: number;
  location: string;
  lat: number;
  lng: number;
  eta: string;
  completed: boolean;
}

export interface LogisticsRoute {
  id: string;
  routeCode: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleCapacityKg: number;
  origin: string;
  destination: string;
  totalDistanceKm: number;
  estimatedDuration: string;
  optimizationSavingsKm: number;
  status: "Assigned" | "In Transit" | "Completed";
  stops: RouteStop[];
}

export interface DemandFactor {
  name: string;
  nameHi: string;
  contributionPercent: number; // e.g. +8 or -3
  description: string;
}

export interface DemandForecastData {
  productName: string;
  productNameHi: string;
  region: string;
  expectedDemandKg: number;
  forecastPeriod: string;
  changePercent: number;
  confidencePercent: number;
  dataWindowDays: number;
  recommendation: string;
  recommendationHi: string;
  suggestedAction: string;
  suggestedActionHi: string;
  factors: DemandFactor[];
  nearbyListingRange: { min: number; max: number };
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  role: Role;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  category: "ORDER" | "PROCUREMENT" | "PRICE" | "LOGISTICS" | "PAYMENT";
  read: boolean;
  timestamp: string;
  link?: string;
}

// ─── Initial Seed Data ───

export const INITIAL_LISTINGS: ProduceListing[] = [
  {
    id: "list-tomato-01",
    farmerId: "farmer-01",
    farmerName: "Ramesh Kumar",
    farmerLocation: "Kanchipuram, Tamil Nadu",
    fpoName: "ABC FPO",
    productName: "Tomatoes",
    productNameHi: "टमाटर",
    category: "Vegetables",
    grade: "A",
    totalQuantity: 500,
    availableQuantity: 500,
    unit: "kg",
    pricePerKg: 32,
    buyerPricePerKg: 40,
    estimatedLogisticsPerKg: 3,
    platformFeePerKg: 1,
    farmerRealizationPerKg: 36,
    harvestDate: "2026-08-28",
    availabilityWindow: { from: "2026-08-29", to: "2026-09-02" },
    location: "Kanchipuram, Tamil Nadu",
    district: "Kanchipuram",
    state: "Tamil Nadu",
    verified: true,
    image: "/tomatoes-market.png",
    createdAt: "2026-08-28T08:00:00Z",
  },
  {
    id: "list-onion-01",
    farmerId: "farmer-02",
    farmerName: "Suresh Reddy",
    farmerLocation: "Nellore, Andhra Pradesh",
    fpoName: "GreenFields FPO",
    productName: "Red Onions",
    productNameHi: "लाल प्याज",
    category: "Vegetables",
    grade: "A",
    totalQuantity: 1000,
    availableQuantity: 1000,
    unit: "kg",
    pricePerKg: 28,
    buyerPricePerKg: 35,
    estimatedLogisticsPerKg: 2.5,
    platformFeePerKg: 1,
    farmerRealizationPerKg: 31.5,
    harvestDate: "2026-09-01",
    availabilityWindow: { from: "2026-09-01", to: "2026-09-06" },
    location: "Nellore, Andhra Pradesh",
    district: "Nellore",
    state: "Andhra Pradesh",
    verified: true,
    image: "/onion.jpg",
    createdAt: "2026-08-27T10:30:00Z",
  },
  {
    id: "list-potato-01",
    farmerId: "farmer-03",
    farmerName: "Venkatesh Babu",
    farmerLocation: "Chittoor, Andhra Pradesh",
    fpoName: "Rayalaseema FPO",
    productName: "Potatoes",
    productNameHi: "आलू",
    category: "Vegetables",
    grade: "A",
    totalQuantity: 800,
    availableQuantity: 800,
    unit: "kg",
    pricePerKg: 26,
    buyerPricePerKg: 32,
    estimatedLogisticsPerKg: 2.5,
    platformFeePerKg: 1,
    farmerRealizationPerKg: 28.5,
    harvestDate: "2026-08-30",
    availabilityWindow: { from: "2026-08-30", to: "2026-09-05" },
    location: "Chittoor, Andhra Pradesh",
    district: "Chittoor",
    state: "Andhra Pradesh",
    verified: true,
    image: "/potato.jpg",
    createdAt: "2026-08-26T14:00:00Z",
  },
  {
    id: "list-rice-01",
    farmerId: "farmer-04",
    farmerName: "Harpreet Singh",
    farmerLocation: "Karnal, Haryana",
    fpoName: "Punjab Agri FPO",
    productName: "Basmati Rice",
    productNameHi: "बासमती चावल",
    category: "Grains",
    grade: "A",
    totalQuantity: 2000,
    availableQuantity: 2000,
    unit: "kg",
    pricePerKg: 62,
    buyerPricePerKg: 75,
    estimatedLogisticsPerKg: 4,
    platformFeePerKg: 2,
    farmerRealizationPerKg: 69,
    harvestDate: "2026-09-15",
    availabilityWindow: { from: "2026-09-15", to: "2026-09-30" },
    location: "Karnal, Haryana",
    district: "Karnal",
    state: "Haryana",
    verified: true,
    image: "/basmati.jpg",
    createdAt: "2026-08-25T09:00:00Z",
  },
];

export const INITIAL_PROCUREMENT_CENTRES: ProcurementCentre[] = [
  {
    id: "proc-centre-01",
    name: "Kanchipuram District Procurement Centre",
    nameHi: "कांचीपुरम जिला खरीद केंद्र",
    district: "Kanchipuram",
    state: "Tamil Nadu",
    distanceKm: 8.4,
    address: "APMC Yard Road, Near Railway Goods Shed, Kanchipuram - 631502",
    operatingHours: "08:00 AM – 05:00 PM (Mon-Sat)",
    contactNumber: "+91 44 2722 4110",
    availableSlotsToday: 18,
    avgWaitTimeMinutes: 42,
    currentQueueCount: 8,
    nowServingToken: 34,
    status: "Open",
    supportedProduce: ["Tomatoes", "Paddy / Rice", "Millets", "Pulses"],
  },
  {
    id: "proc-centre-02",
    name: "Walajabad Block Agricultural Sub-Centre",
    nameHi: "वालाजाबाद ब्लॉक कृषि उप-केंद्र",
    district: "Kanchipuram",
    state: "Tamil Nadu",
    distanceKm: 14.2,
    address: "State Highway 48, Near Farmer Service Society, Walajabad - 631605",
    operatingHours: "08:30 AM – 04:30 PM (Mon-Sat)",
    contactNumber: "+91 44 2725 6220",
    availableSlotsToday: 24,
    avgWaitTimeMinutes: 28,
    currentQueueCount: 4,
    nowServingToken: 19,
    status: "Open",
    supportedProduce: ["Tomatoes", "Vegetables", "Paddy / Rice", "Groundnut"],
  },
  {
    id: "proc-centre-03",
    name: "Chengalpattu Central Grain Mandi Centre",
    nameHi: "चेंगलपट्टू केंद्रीय अनाज मंडी केंद्र",
    district: "Chengalpattu",
    state: "Tamil Nadu",
    distanceKm: 28.6,
    address: "GST Road Market Yard, Chengalpattu - 603001",
    operatingHours: "07:30 AM – 06:00 PM",
    contactNumber: "+91 44 2742 8890",
    availableSlotsToday: 32,
    avgWaitTimeMinutes: 35,
    currentQueueCount: 11,
    nowServingToken: 52,
    status: "Open",
    supportedProduce: ["Paddy", "Wheat", "Millets", "Pulses", "Oilseeds"],
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-00421",
    orderNumber: "FM-2026-00421",
    buyerId: "buyer-01",
    buyerName: "Anita Rao",
    buyerOrganization: "ABC Grand Restaurant Group",
    buyerPhone: "+91 97100 88990",
    deliveryAddress: "No. 42 Anna Salai, Thousand Lights",
    deliveryCity: "Chennai",
    items: [
      {
        listingId: "list-tomato-01",
        productName: "Tomatoes",
        quantity: 500,
        pricePerKg: 32,
        totalPrice: 16000,
      },
    ],
    allocations: [
      {
        farmerId: "farmer-01",
        farmerName: "Ramesh Kumar",
        location: "Kanchipuram",
        allocatedKg: 500,
        pricePerKg: 32,
      },
    ],
    totalQuantityKg: 500,
    totalBuyerAmount: 20000, // ₹40/kg buyer rate * 500 kg
    totalLogisticsFee: 1500, // ₹3/kg * 500 kg
    totalPlatformFee: 500,   // ₹1/kg * 500 kg
    totalFarmerPayable: 18000, // ₹36/kg realization * 500 kg
    status: "Confirmed",
    statusHistory: [
      { status: "Placed", timestamp: "2026-08-28T09:15:00Z" },
      { status: "Confirmed", timestamp: "2026-08-28T10:00:00Z", note: "Verified seller inventory locked" },
    ],
    pickupScheduledAt: "2026-08-29T08:30:00Z",
    estimatedDeliveryAt: "2026-08-29T14:00:00Z",
    trackingRouteId: "route-001",
    paymentRef: "PAY-DEMO-38291",
    createdAt: "2026-08-28T09:15:00Z",
  },
  {
    id: "ord-00422",
    orderNumber: "FM-2026-00422",
    buyerId: "buyer-01",
    buyerName: "Anita Rao",
    buyerOrganization: "ABC Grand Restaurant Group",
    buyerPhone: "+91 97100 88990",
    deliveryAddress: "No. 18 GST Road, Guindy",
    deliveryCity: "Chennai",
    items: [
      {
        listingId: "list-onion-01",
        productName: "Red Onions",
        quantity: 700,
        pricePerKg: 28,
        totalPrice: 19600,
      },
    ],
    allocations: [
      {
        farmerId: "farmer-02",
        farmerName: "Suresh Reddy",
        location: "Nellore",
        allocatedKg: 700,
        pricePerKg: 28,
      },
    ],
    totalQuantityKg: 700,
    totalBuyerAmount: 24500,
    totalLogisticsFee: 1750,
    totalPlatformFee: 700,
    totalFarmerPayable: 22050,
    status: "In Transit",
    statusHistory: [
      { status: "Placed", timestamp: "2026-08-27T11:00:00Z" },
      { status: "Confirmed", timestamp: "2026-08-27T12:30:00Z" },
      { status: "Picked Up", timestamp: "2026-08-28T06:30:00Z" },
      { status: "In Transit", timestamp: "2026-08-28T07:45:00Z" },
    ],
    pickupScheduledAt: "2026-08-28T06:30:00Z",
    estimatedDeliveryAt: "2026-08-28T16:30:00Z",
    trackingRouteId: "route-002",
    paymentRef: "PAY-DEMO-38292",
    createdAt: "2026-08-27T11:00:00Z",
  },
];

export const INITIAL_PROCUREMENT_BOOKINGS: ProcurementBooking[] = [
  {
    id: "proc-book-00421",
    bookingCode: "FM-PROC-00421",
    farmerId: "farmer-01",
    farmerName: "Ramesh Kumar",
    farmerPhone: "+91 98401 23456",
    centreId: "proc-centre-01",
    centreName: "Kanchipuram District Procurement Centre",
    centreLocation: "APMC Yard, Kanchipuram",
    date: "2026-08-30",
    timeSlot: "10:30 AM – 11:00 AM",
    produceName: "Tomatoes",
    produceNameHi: "टमाटर",
    expectedQuantityKg: 500,
    acceptedQuantityKg: 480,
    ratePerKg: 32,
    tokenNumber: 42,
    farmersAhead: 8,
    estimatedWaitMinutes: 42,
    status: "In Queue",
    timeline: [
      { step: "Slot Booked", timestamp: "2026-08-28 16:30", completed: true },
      { step: "Gate Arrival & Checked In", timestamp: "2026-08-30 10:15", completed: true },
      { step: "Token Queue Assigned (#42)", timestamp: "2026-08-30 10:18", completed: true },
      { step: "Quality & Weighing Inspection", timestamp: "Pending", completed: false },
      { step: "Produce Accepted", timestamp: "Pending", completed: false },
      { step: "Direct Bank Payment Processing", timestamp: "Pending", completed: false },
      { step: "Payment Completed", timestamp: "Pending", completed: false },
    ],
    paymentAmount: 15360, // 480 kg * ₹32
    paymentStatus: "Pending Inspection",
    paymentReference: "PAY-DEMO-38291",
    paymentDate: "2026-08-30",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=FM-PROC-00421-TOKEN42",
    createdAt: "2026-08-28T16:30:00Z",
  },
];

export const INITIAL_DEMAND_FORECAST: DemandForecastData = {
  productName: "Tomatoes",
  productNameHi: "टमाटर",
  region: "Chennai Metro & Suburbs",
  expectedDemandKg: 18400,
  forecastPeriod: "Next 7 Days (29 Aug – 04 Sep)",
  changePercent: 12,
  confidencePercent: 87,
  dataWindowDays: 30,
  recommendation: "Increase tomato aggregation from nearby FPOs in Kanchipuram & Chengalpattu clusters.",
  recommendationHi: "कांचीपुरम और चेंगलपट्टू क्लस्टरों के नजदीकी FPOs से टमाटर संग्रह बढ़ाएं।",
  suggestedAction: "Consider listing additional Grade A tomatoes at ₹32–33/kg before weekend hotel & restaurant procurement rounds.",
  suggestedActionHi: "सप्ताहांत होटल और रेस्तरां खरीद से पहले ₹32–33/किलो पर अतिरिक्त ग्रेड A टमाटर लिस्ट करने पर विचार करें।",
  factors: [
    {
      name: "Recent Open Buyer Requirements",
      nameHi: "हालिया खुली खरीदार मांगें",
      contributionPercent: 8,
      description: "Active bulk orders from 14 verified Chennai restaurant & hotel chains logged in the last 72 hours.",
    },
    {
      name: "Historical Seasonal Pattern",
      nameHi: "ऐतिहासिक मौसमी पैटर्न",
      contributionPercent: 5,
      description: "Early September harvest transitions typically see increased consumption in urban centres.",
    },
    {
      name: "Nearby Available Inventory",
      nameHi: "आसपास उपलब्ध इन्वेंट्री",
      contributionPercent: -3,
      description: "Moderate buffer stock already listed by 3 neighboring FPOs.",
    },
    {
      name: "Mandi Arrival Inflow Trends",
      nameHi: "मंडी आवक रुझान",
      contributionPercent: 2,
      description: "Koyambedu wholesale arrivals projected to be slightly below average over the next 4 days.",
    },
  ],
  nearbyListingRange: { min: 30, max: 34 },
  timestamp: "2026-08-28T18:00:00Z",
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-01",
    userId: "farmer-01",
    role: "FARMER",
    title: "Order FM-2026-00421 Confirmed",
    titleHi: "ऑर्डर FM-2026-00421 की पुष्टि हो गई है",
    message: "ABC Restaurant has confirmed your 500 kg tomato listing. Pickup scheduled for tomorrow at 8:30 AM.",
    messageHi: "ABC रेस्तरां ने आपके 500 किलो टमाटर लिस्टिंग की पुष्टि कर दी है। पिकअप कल सुबह 8:30 बजे तय है।",
    category: "ORDER",
    read: false,
    timestamp: "10 mins ago",
    link: "/farmer/orders/ord-00421",
  },
  {
    id: "notif-02",
    userId: "farmer-01",
    role: "FARMER",
    title: "Procurement Slot Tomorrow at 10:30 AM",
    titleHi: "खरीद केंद्र स्लॉट कल सुबह 10:30 बजे",
    message: "Your token #42 is booked at Kanchipuram Centre. Expected wait time is ~42 mins.",
    messageHi: "आपका टोकन #42 कांचीपुरम केंद्र पर बुक है। अनुमानित प्रतीक्षा समय ~42 मिनट है।",
    category: "PROCUREMENT",
    read: false,
    timestamp: "1 hour ago",
    link: "/farmer/procurement/proc-book-00421",
  },
  {
    id: "notif-03",
    userId: "farmer-01",
    role: "FARMER",
    title: "Demand Alert: Tomato +12%",
    titleHi: "मांग अलर्ट: टमाटर +12%",
    message: "Demand for tomatoes in Chennai increased by 12% in the latest demo forecast.",
    messageHi: "नवीनतम डेमो पूर्वानुमान में चेन्नई में टमाटर की मांग में 12% की वृद्धि हुई है।",
    category: "PRICE",
    read: true,
    timestamp: "4 hours ago",
    link: "/farmer/insights",
  },
];