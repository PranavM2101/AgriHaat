// ─── AgriHaat AI — Centralized Agricultural Market Data ───
// Real-time verified market data and supply index

export const produceListings = [
  {
    id: "tomato",
    name: "Tomatoes",
    nameHi: "टमाटर",
    grade: "A",
    quantity: 500,
    unit: "kg",
    price: 32,
    location: "Kanchipuram, TN",
    seller: "ABC FPO",
    verified: true,
    harvest: "28 Aug 2026",
    image: "/tomatoes-market.png",
  },
  {
    id: "onion",
    name: "Onions",
    nameHi: "प्याज",
    grade: "A",
    quantity: 1000,
    unit: "kg",
    price: 28,
    location: "Nellore, AP",
    seller: "GreenFields FPO",
    verified: true,
    harvest: "01 Sep 2026",
    image: "/onion.jpg",
  },
  {
    id: "potato",
    name: "Potatoes",
    nameHi: "आलू",
    grade: "A",
    quantity: 800,
    unit: "kg",
    price: 26,
    location: "Chittoor, AP",
    seller: "Rayalaseema FPO",
    verified: true,
    harvest: "30 Aug 2026",
    image: "/potato.jpg",
  },
  {
  id: "rice", // or "prod-4" / "basmati-rice"
  name: "Basmati Rice",
  nameHi: "बासमती चावल",
  category: "Grains",
  // Ensure this points to /basmati.jpg
  image: "/basmati.jpg", 
  // ... other properties
},
] as const;

export const demandForecast = {
  product: "Tomato",
  productHi: "टमाटर",
  region: "Chennai",
  expectedDemand: 18400,
  unit: "kg",
  period: "next 7 days",
  periodHi: "अगले 7 दिन",
  trend: 12,
  confidence: 87,
  recommendation: "Increase tomato aggregation from nearby FPOs before weekend peak.",
  recommendationHi: "सप्ताहांत की मांग के लिए नजदीकी FPOs से टमाटर संग्रह बढ़ाएं।",
  label: "AI Demand Forecast",
  labelHi: "AI मांग पूर्वानुमान",
};

export const farmerRealization = {
  buyerPrice: 40,
  logistics: 3,
  platformFee: 1,
  realization: 36,
  quantity: 500,
  expectedPayout: 18000,
  unit: "kg",
  label: "Net Farmer Realization",
  labelHi: "शुद्ध किसान प्राप्ति",
};

export const routeData = {
  origin: "Kanchipuram",
  destination: "Chennai Buyer",
  totalDistance: 124,
  totalTime: "4h 20m",
  totalWeight: 430,
  stops: [
    { name: "Farmer A", type: "pickup" as const, weight: 250, grade: "A", price: 31 },
    { name: "Farmer B", type: "pickup" as const, weight: 180, grade: "A", price: 33 },
    { name: "Collection Centre", type: "hub" as const, weight: 430, grade: "A", price: 0 },
    { name: "Chennai Buyer", type: "delivery" as const, weight: 430, grade: "A", price: 0 },
  ],
  label: "Multi-Stop Optimized Route",
  labelHi: "अनुकूलित बहु-स्टॉप मार्ग",
};

export const buyerOrder = {
  buyer: "ABC Restaurant",
  requirement: 2000,
  product: "Tomatoes",
  productHi: "टमाटर",
  grade: "A",
  deliveryCity: "Chennai",
  availableNearby: 2450,
  matched: 2000,
  estimatedDelivery: "Tomorrow",
  estimatedDeliveryHi: "कल",
};

export const faqItems = [
  {
    q: "How does AgriHaat help farmers get a better price?",
    qHi: "AgriHaat किसानों को बेहतर कीमत कैसे दिलाता है?",
    a: "By connecting farmers directly with verified buyers, the platform eliminates unnecessary intermediaries. The itemized pricing breakdown guarantees that farmers take home up to 18-25% more revenue.",
    aHi: "किसानों को सीधे सत्यापित खरीदारों से जोड़कर, प्लेटफ़ॉर्म बिचौलियों को हटाता है। पारदर्शी मूल्य विवरण सुनिश्चित करता है कि किसान 18-25% अधिक कमाई प्राप्त करें।",
  },
  {
    q: "How does the farmer know what they will receive?",
    qHi: "किसान को कैसे पता चलता है कि उसे कितना मिलेगा?",
    a: "Before confirming any order, farmers see a transparent realization calculation — buyer price minus transport and platform fee — with immediate DBT payment guarantee upon delivery.",
    aHi: "ऑर्डर की पुष्टि से पहले, किसान पारदर्शी प्राप्ति गणना देखते हैं — खरीदार मूल्य में से परिवहन और प्लेटफ़ॉर्म शुल्क घटाकर — डिलीवरी पर तत्काल DBT भुगतान गारंटी के साथ।",
  },
  {
    q: "Can multiple farmers fulfill one buyer order?",
    qHi: "क्या एक खरीदार के ऑर्डर को कई किसान पूरा कर सकते हैं?",
    a: "Yes. AgriHaat automatically aggregates supply from nearby farmers and FPOs to fulfill large buyer orders, routing a single vehicle for coordinated multi-stop pickup.",
    aHi: "हाँ। AgriHaat बड़े खरीदार ऑर्डर्स को पूरा करने के लिए नजदीकी किसानों और FPOs से आपूर्ति जोड़ता है, और एक ही वाहन से पिकअप का समन्वय करता है।",
  },
  {
    q: "Who handles pickup and delivery?",
    qHi: "पिकअप और डिलीवरी कौन करता है?",
    a: "AgriHaat partners with verified local logistics fleets and optimizes multi-stop routes using GPS telemetry and temperature-monitored vehicles for direct farm-to-kitchen transit.",
    aHi: "AgriHaat सत्यापित स्थानीय लॉजिस्टिक्स बेड़े के साथ साझेदारी करता है और खेत से सीधे रसोई तक पारगमन के लिए GPS और तापमान-निगरानी वाले वाहनों का उपयोग करता है।",
  },
  {
    q: "Can buyers order large quantities?",
    qHi: "क्या खरीदार बड़ी मात्रा में ऑर्डर कर सकते हैं?",
    a: "Yes. The platform supports bulk wholesale orders — restaurants, hotel chains, and retail supermarkets can source metric tons of graded produce with verified quality inspection.",
    aHi: "हाँ। प्लेटफ़ॉर्म थोक ऑर्डर का समर्थन करता है — रेस्तरां, होटल श्रृंखलाएं और सुपरमार्केट सत्यापित गुणवत्ता निरीक्षण के साथ मीट्रिक टन उपज खरीद सकते हैं।",
  },
  {
    q: "How are AI forecasts generated?",
    qHi: "AI पूर्वानुमान कैसे बनाए जाते हैं?",
    a: "Demand forecasts analyze historical consumption trends, regional wedding/festival seasons, hotel ordering patterns, and weather feeds to predict 7–14 day commodity requirements with 85%+ accuracy.",
    aHi: "मांग पूर्वानुमान 7–14 दिनों की मांग की भविष्यवाणी करने के लिए खपत के रुझान, मौसमी मांग, होटल ऑर्डरिंग और मौसम डेटा का विश्लेषण करते हैं।",
  },
  {
    q: "What happens if a farmer cannot fulfill an order?",
    qHi: "अगर किसान ऑर्डर पूरा नहीं कर पाता तो क्या होता है?",
    a: "The aggregation engine automatically shifts shortfall allocation to nearby verified cluster farmers within a 15 km radius, ensuring uninterrupted supply for the buyer.",
    aHi: "एग्रीगेशन इंजन 15 किमी के दायरे में नजदीकी सत्यापित किसानों को ऑर्डर स्वतः आवंटित करता है, जिससे खरीदार को निर्बाध आपूर्ति मिलती है।",
  },
];

export const testimonials = [
  {
    stars: 5,
    quote: "We sold 500 kg of grade-A tomatoes directly to Chennai restaurants without middleman cuts and received DBT settlement within 2 hours of delivery.",
    quoteHi: "हमने बिना बिचौलियों के सीधे चेन्नई के रेस्तरां को 500 किलो टमाटर बेचे और डिलीवरी के 2 घंटे के भीतर DBT भुगतान प्राप्त किया।",
    name: "Ramesh Kumar",
    role: "Farmer · Kanchipuram, TN",
    roleHi: "किसान · कांचीपुरम, तमिलनाडु",
    label: "Verified Farmer",
    labelHi: "सत्यापित किसान",
  },
  {
    stars: 5,
    quote: "Sourcing 2 tonnes of fresh vegetables daily has become completely transparent. We track the delivery truck in real-time right to our central kitchen.",
    quoteHi: "प्रतिदिन 2 टन ताजी सब्जियां खरीदना पूरी तरह से पारदर्शी हो गया है। हम डिलीवरी ट्रक को सीधे अपनी केंद्रीय रसोई तक लाइव ट्रैक करते हैं।",
    name: "Anita Rao",
    role: "Procurement Head · ABC Grand Hotels",
    roleHi: "खरीद प्रमुख · एबीसी ग्रैंड होटल्स, चेन्नई",
    label: "Verified Buyer",
    labelHi: "सत्यापित खरीदार",
  },
  {
    stars: 5,
    quote: "Coordinating 12 farmer pickups into one 120 km route saved us 35% on fuel and cut empty transit miles significantly.",
    quoteHi: "एक 120 किमी मार्ग में 12 किसानों के पिकअप का समन्वय करने से हमारे ईंधन में 35% की बचत हुई।",
    name: "Murugan Swaminathan",
    role: "Logistics Partner · Kanchipuram Hub",
    roleHi: "लॉजिस्टिक्स पार्टनर · कांचीपुरम हब",
    label: "Fleet Operator",
    labelHi: "फ्लीट ऑपरेटर",
  },
];

export const aiChatMessages = [
  {
    role: "user" as const,
    text: "Chennai mein agle 7 din mein tomato demand kaisi hai?",
    textHi: "चेन्नई में अगले 7 दिन में टमाटर की डिमांड कैसी है?",
  },
  {
    role: "ai" as const,
    text: "According to current market intelligence, expected demand is 18,400 kg (+12% vs last week). AI suggests listing Grade A tomatoes before Friday morning to capture weekend restaurant demand.",
    textHi: "बाजार विश्लेषण के अनुसार, अपेक्षित मांग 18,400 किलो (+12%) है। सप्ताहांत की रेस्टोरेंट मांग के लिए शुक्रवार सुबह से पहले ग्रेड A टमाटर लिस्ट करने की सलाह दी जाती है।",
  },
  {
    role: "user" as const,
    text: "Nearby FPO supply kitni available hai?",
    textHi: "नजदीकी FPO सप्लाई कितनी उपलब्ध है?",
  },
  {
    role: "ai" as const,
    text: "Active inventory across Kanchipuram cluster shows 21,600 kg verified harvest ready for aggregated dispatch.",
    textHi: "कांचीपुरम क्लस्टर में सक्रिय इन्वेंट्री में समन्वित डिस्पैच के लिए 21,600 किलो सत्यापित फसल उपलब्ध है।",
  },
];

export const orderSteps = [
  { label: "Placed", labelHi: "ऑर्डर किया", completed: true },
  { label: "Confirmed", labelHi: "पुष्टि हुई", completed: true },
  { label: "Picked Up", labelHi: "पिक अप हुआ", completed: true },
  { label: "In Transit", labelHi: "रास्ते में", completed: false },
  { label: "Delivered", labelHi: "डिलीवर हुआ", completed: false },
];