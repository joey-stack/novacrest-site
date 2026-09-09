/**
 * NOVACREST HOMES LIMITED - Properties Dataset
 * Abuja, Nigeria - Diaspora & Luxury Real Estate
 */

import { 
  fetchFirestoreCollection, 
  saveFirestoreDocument, 
  deleteFirestoreDocument 
} from './firebase-config.js';

const DEFAULT_PROPERTIES = [
  {
    id: "nova-crest-palace",
    name: "Nova Crest Palace",
    subtitle: "Palatial Sovereign Living in Maitama's Most Exclusive Enclave",
    status: "Selling Fast",
    badgeType: "selling-fast",
    chip: "MANSION",
    category: "off-plan",
    type: "Mansion",
    purpose: "For Sale",
    district: "Maitama",
    address: "Diplomatic Ridge, Maitama, Abuja",
    priceNGN: 1250000000,
    priceUSD: 850000,
    period: null,
    monthlyPayment: "From ₦28M/month",
    availability: { available: 40, reserved: 35, sold: 25 },
    titleStatus: "Certificate of Occupancy (C of O)",
    titleAgency: "FCDA / AGIS Verified",
    landSize: "1,850 sqm",
    bedrooms: 7,
    bathrooms: 8,
    carParks: 6,
    image: "assets/images/nova-crest-palace.jpg",
    gallery: [
      "assets/images/nova-crest-palace.jpg",
      "assets/images/your-home-interior.jpg",
      "assets/images/masterplan-aerial.jpg"
    ],
    amenities: [
      "Private Heated Infinity Pool",
      "Dual Penthouse Master Suites with Walk-in Closets",
      "Smart Home Automation (Lutron & Crestron)",
      "Dedicated 50kVA Hybrid Solar Inverter System",
      "Private Cinema & Wine Cellar",
      "Bullet-Resistant Security Outer Perimeter & Safe Room",
      "Separate 2-Bedroom Staff Quarters (BQ)",
      "AGIS Verified Digital Title Dossier"
    ],
    description: "The crown jewel of Nova Crest Homes Ltd. Nova Crest Palace stands atop the elevated hills of Maitama, commanding sweeping sunset vistas across Abuja's skyline. Designed specifically for discerning diaspora families and institutional investors seeking an uncompromised family seat with bulletproof legal tenure.",
    proximity: {
      airport: "28 mins (via Airport Rd Expressway)",
      cbd: "8 mins (Central Business District)",
      landmark: "5 mins to Transcorp Hilton & European Union Delegation"
    },
    investmentThesis: "Maitama real estate has delivered 18.5% annual capital appreciation over the past decade. With zero new greenfield plots in Maitama proper, Nova Crest Palace represents rare generational land assembly."
  },
  {
    id: "nova-crest-villa",
    name: "Nova Crest Villa",
    subtitle: "Contemporary Waterfront Elegance on Jabi Lake",
    status: "Available",
    badgeType: "available",
    chip: "WATERFRONT VILLA",
    category: "off-plan",
    type: "Waterfront Villa",
    purpose: "For Sale",
    district: "Jabi",
    address: "Lake View Crest, Jabi Waterfront, Abuja",
    priceNGN: 780000000,
    priceUSD: 530000,
    period: null,
    monthlyPayment: "From ₦18.5M/month",
    availability: { available: 55, reserved: 30, sold: 15 },
    titleStatus: "Certificate of Occupancy (C of O)",
    titleAgency: "AGIS Recertified",
    landSize: "1,200 sqm",
    bedrooms: 5,
    bathrooms: 6,
    carParks: 4,
    image: "assets/images/nova-crest-villa.jpg",
    gallery: [
      "assets/images/nova-crest-villa.jpg",
      "assets/images/your-home-interior.jpg",
      "assets/images/masterplan-aerial.jpg"
    ],
    amenities: [
      "Private Motorized Boat Dock & Jet Ski Slipway",
      "Cantilevered Lakeview Infinity Deck",
      "Double-Height Glass Atrium Living Space",
      "Italian Quartzite Open-Plan Kitchen",
      "Full Solar Pergola & Tesla Powerwall Integration",
      "CCTV Perimeter with AI Facial Recognition",
      "1-Bedroom En-Suite BQ"
    ],
    description: "Positioned directly on the pristine shoreline of Jabi Lake, Nova Crest Villa reimagines resort-style waterfront tranquility within the heartbeat of Nigeria's capital. Glass expanses capture shimmering lake reflections, providing an idyllic sanctuary for diaspora executives returning home.",
    proximity: {
      airport: "22 mins (via Nnamdi Azikiwe International Highway)",
      cbd: "10 mins (via Shehu Yar'Adua Way)",
      landmark: "4 mins to Jabi Lake Mall & Jabi Boat Club"
    },
    investmentThesis: "Waterfront property in Abuja is extraordinarily scarce. High rental yields from diplomatic tenants and multinational leadership offer projected 9.8% net annual USD rental yields."
  },
  {
    id: "nova-crest-garden",
    name: "Nova Crest Garden",
    subtitle: "Eco-Luxury Hillside Residences in Guzape District",
    status: "Under Construction",
    badgeType: "construction",
    chip: "TERRACE ESTATE",
    category: "off-plan",
    type: "Terrace & Duplex Estate",
    purpose: "For Sale",
    district: "Guzape",
    address: "Aura Ridge, Guzape Phase 2, Abuja",
    priceNGN: 420000000,
    priceUSD: 285000,
    period: null,
    monthlyPayment: "From ₦9.2M/month",
    availability: { available: 65, reserved: 20, sold: 15 },
    titleStatus: "Right of Occupancy (R of O) & C of O in processing",
    titleAgency: "AGIS Verified File Ref",
    landSize: "650 sqm units",
    bedrooms: 4,
    bathrooms: 5,
    carParks: 3,
    image: "assets/images/nova-crest-garden.jpg",
    gallery: [
      "assets/images/nova-crest-garden.jpg",
      "assets/images/your-home-interior.jpg",
      "assets/images/masterplan-aerial.jpg"
    ],
    amenities: [
      "Private Landscaped Zen Courtyards",
      "Rooftop Solar Pergola with Guzape Valley Views",
      "High-Speed Fiber-to-the-Home Infrastructure",
      "Estate Swimming Pool & Squash Court",
      "Centralized Water Treatment & Deep Aquifer Borehole",
      "24/7 Manned Gatehouse & Biometric Resident Access"
    ],
    description: "Nestled against the undulating green hills of Guzape, Nova Crest Garden delivers a balanced synthesis of sustainable bioclimatic architecture and elevated prestige. Built with insulated walls, natural ventilation breezeways, and solar energy autonomy.",
    proximity: {
      airport: "27 mins",
      cbd: "7 mins (via Hassan Usman Katsina St)",
      landmark: "5 mins to Asokoro / COZA Hills"
    },
    investmentThesis: "Guzape is Abuja's fastest-growing luxury enclave, often dubbed 'the New Asokoro.' Ground-floor entry pricing during our off-plan phase allows early investors to capture 35%+ equity lift upon completion."
  },
  {
    id: "nova-crest-experience",
    name: "Nova Crest Experience",
    subtitle: "Next-Generation Smart Duplexes in Prime Asokoro",
    status: "Selling Fast",
    badgeType: "selling-fast",
    chip: "SMART DUPLEX",
    category: "off-plan",
    type: "Smart Duplex",
    purpose: "For Sale",
    district: "Asokoro",
    address: "Presidential Boulevard Corridor, Asokoro, Abuja",
    priceNGN: 950000000,
    priceUSD: 645000,
    period: null,
    monthlyPayment: "From ₦22M/month",
    availability: { available: 35, reserved: 45, sold: 20 },
    titleStatus: "Certificate of Occupancy (C of O)",
    titleAgency: "AGIS Verified Clean Title",
    landSize: "1,100 sqm",
    bedrooms: 6,
    bathrooms: 7,
    carParks: 5,
    image: "assets/images/nova-crest-experience.jpg",
    gallery: [
      "assets/images/nova-crest-experience.jpg",
      "assets/images/your-home-interior.jpg",
      "assets/images/nova-crest-palace.jpg"
    ],
    amenities: [
      "Voice & App-Controlled Smart Environment",
      "Cantilevered Architectural Facade with Night Neon Accents",
      "Private Elevator Servicing All Three Levels",
      "Infinity Reflection Pool with Sunken Fire Lounge",
      "Executive Home Office Suite with Satellite Uplink",
      "Triple Filtered Clean Air Circulation System",
      "2-Room En-Suite Domestic Staff Quarters"
    ],
    description: "Nova Crest Experience is an unapologetic testament to bold contemporary ambition. Built in Asokoro, Nigeria's premier seat of power, this development caters to diaspora tech founders, senior international civil servants, and visionaries demanding precision craftsmanship.",
    proximity: {
      airport: "30 mins",
      cbd: "6 mins",
      landmark: "3 mins to ECOWAS Secretariat & Aso Rock Villa Ridge"
    },
    investmentThesis: "Asokoro maintains the highest land asset retention in Sub-Saharan Africa. High-liquidity asset with perpetual institutional demand."
  },
  {
    id: "your-home",
    name: "Your Home by Novacrest",
    subtitle: "Accessible Luxury Tailored for Diaspora Families Building Home",
    status: "Available",
    badgeType: "available",
    chip: "DETACHED DUPLEX",
    category: "off-plan",
    type: "Detached Smart Duplex",
    purpose: "For Sale",
    district: "Airport Road",
    address: "River Park - Airport Road Gateway, Abuja",
    priceNGN: 240000000,
    priceUSD: 163000,
    period: null,
    monthlyPayment: "From ₦5.5M/month",
    availability: { available: 70, reserved: 20, sold: 10 },
    titleStatus: "FCDA Allocation / C of O in process",
    titleAgency: "AGIS Documented Cadastral Zone",
    landSize: "500 sqm",
    bedrooms: 4,
    bathrooms: 5,
    carParks: 3,
    image: "assets/images/your-home-interior.jpg",
    gallery: [
      "assets/images/your-home-interior.jpg",
      "assets/images/masterplan-aerial.jpg",
      "assets/images/nova-crest-garden.jpg"
    ],
    amenities: [
      "Turnkey Diaspora Furnishing Options",
      "Dedicated Milestone Video Tracking App",
      "10kVA Solar Hybrid Backup with Lithium Batteries",
      "Children's Play Park & Recreational Clubhouse",
      "Independent Perimeter Security & Guard Patrols",
      "Guaranteed Delivery Timeline with Milestone Penalty Clauses"
    ],
    description: "Created specifically for Nigerians in the UK, USA, Canada, and Europe who have dreamed of having a secure, dignifying home of their own in Abuja without the nightmare of family mismanagement or site scams. We provide verified documentation, transparent escrow, and live drone cameras.",
    proximity: {
      airport: "12 mins direct via 10-lane Airport Expressway",
      cbd: "18 mins",
      landmark: "7 mins to Centenary City & Shoprite Gateway Mall"
    },
    investmentThesis: "With the expansion of the Airport Road corridor into Abuja's prime aerotropolis, properties in this sector have registered 24% annual growth driven by airport proximity and diaspora settlement."
  },
  {
    id: "karshi-horizon-plots",
    name: "Nova Crest Horizon Estates",
    subtitle: "High-Growth Masterplanned Plots in Karshi Corridor",
    status: "Selling Fast",
    badgeType: "selling-fast",
    chip: "SERVICED PLOTS",
    category: "land",
    type: "Land / Plots",
    purpose: "Land / Plots",
    district: "Karshi",
    address: "Apo-Karshi Expressway Junction, Karshi, Abuja",
    priceNGN: 18500000,
    priceUSD: 12500,
    period: null,
    monthlyPayment: "From ₦1.2M/month",
    availability: { available: 50, reserved: 30, sold: 20 },
    titleStatus: "Government Excision & Gazetted Layout",
    titleAgency: "Survey Plan Registered with AGIS",
    landSize: "500 sqm & 1000 sqm",
    bedrooms: 0,
    bathrooms: 0,
    carParks: 0,
    image: "assets/images/masterplan-aerial.jpg",
    gallery: [
      "assets/images/masterplan-aerial.jpg",
      "assets/images/nova-crest-garden.jpg"
    ],
    amenities: [
      "100% Dry Table Land (Instant Allocation)",
      "Paved Internal Road Networks with Concrete Drainage",
      "Perimeter Fencing with Gatehouse Security",
      "Electrification & Solar Street Lighting",
      "Recreational Green Areas & Community Park",
      "Immediate Deed of Assignment & Registered Survey"
    ],
    description: "The Karshi district represents Abuja's most explosive capital appreciation corridor upon the full operationalization of the Apo-Karshi road bypass. Perfect for diaspora land banking and long-term generational wealth building.",
    proximity: {
      airport: "40 mins",
      cbd: "20 mins (via newly completed Apo bypass link)",
      landmark: "10 mins to Apo Mechanics & Gudu District"
    },
    investmentThesis: "Historic land value comparison shows early investors in Guzape and Lokogoma earned 600%+ returns over 7 years. Karshi is currently on that exact trajectory at an accessible entry ticket."
  },
  {
    id: "kuje-eco-plots",
    name: "Nova Crest Palms Enclave",
    subtitle: "Fertile Residential & Commercial Acreage in Kuje",
    status: "Available",
    badgeType: "available",
    chip: "LAND & PLOTS",
    category: "land",
    type: "Land / Plots",
    purpose: "Land / Plots",
    district: "Kuje",
    address: "Kuje-Gwagwalada Link Corridor, Kuje, Abuja",
    priceNGN: 14000000,
    priceUSD: 9500,
    period: null,
    monthlyPayment: "From ₦850K/month",
    availability: { available: 80, reserved: 15, sold: 5 },
    titleStatus: "Right of Occupancy (R of O)",
    titleAgency: "Kuje Area Council & AGIS Verified",
    landSize: "600 sqm",
    bedrooms: 0,
    bathrooms: 0,
    carParks: 0,
    image: "assets/images/masterplan-aerial.jpg",
    gallery: [
      "assets/images/masterplan-aerial.jpg"
    ],
    amenities: [
      "Clear Topographical Survey & Pegging",
      "Free from Customary Encumbrances",
      "Commercial Frontage Availability",
      "Flexible 12-Month Installment Structure"
    ],
    description: "Positioned in Kuje's tranquil green expansion belt. Ideal for organic living, agricultural retreats, or suburban residential estates.",
    proximity: {
      airport: "15 mins via Kuje-Airport bypass",
      cbd: "30 mins",
      landmark: "8 mins to Kuje City Center & Tipper Garage"
    },
    investmentThesis: "Kuje is experiencing decentralized growth following railway links and agro-allied investments, offering steady 20% land appreciation."
  },
  {
    id: "lokogoma-family-duplex",
    name: "The Crestview Manor",
    subtitle: "Finished Family Duplex in Gated Lokogoma Community",
    status: "Available",
    badgeType: "available",
    chip: "DETACHED HOUSE",
    category: "sale",
    type: "Semi-Detached Duplex",
    purpose: "For Sale",
    district: "Lokogoma",
    address: "Adom Estate Sector, Lokogoma District, Abuja",
    priceNGN: 185000000,
    priceUSD: 126000,
    period: null,
    monthlyPayment: "From ₦4.8M/month",
    availability: { available: 60, reserved: 25, sold: 15 },
    titleStatus: "Certificate of Occupancy (C of O)",
    titleAgency: "AGIS Verified Title",
    landSize: "450 sqm",
    bedrooms: 4,
    bathrooms: 5,
    carParks: 3,
    image: "assets/images/nova-crest-garden.jpg",
    gallery: [
      "assets/images/nova-crest-garden.jpg",
      "assets/images/your-home-interior.jpg"
    ],
    amenities: [
      "Fully Finished Ready-for-Occupancy Duplex",
      "Fitted European Kitchen with Marble Tops",
      "POP Ceiling Design with Mood Lighting",
      "Paved Compound with Interlocking Stones",
      "Clean Tap Water & Constant Electricity Feeder Line"
    ],
    description: "An already delivered family residence ready for immediate handover. Ideal for families relocating back home or investors seeking immediate tenant occupancy.",
    proximity: {
      airport: "20 mins",
      cbd: "15 mins",
      landmark: "5 mins to Games Village & Galadimawa Roundabout"
    },
    investmentThesis: "Immediate rental yield capability generating between ₦7,500,000 to ₦9,000,000 annually ($5,000 - $6,000 USD/yr)."
  },
  {
    id: "maitama-diplomat-residence",
    name: "The Diplomat Residence",
    subtitle: "High-Security Ambassadorial Mansion for Executive Lease",
    status: "Reserved",
    badgeType: "reserved",
    chip: "AMBASSADORIAL",
    category: "rent",
    type: "Ambassadorial Villa",
    purpose: "For Rent",
    district: "Maitama",
    address: "Aguiyi Ironsi Way Enclave, Maitama, Abuja",
    priceNGN: 45000000,
    priceUSD: 30500,
    period: "/ year",
    monthlyPayment: "Annual Lease",
    availability: { available: 20, reserved: 60, sold: 20 },
    titleStatus: "Certificate of Occupancy (C of O)",
    titleAgency: "FCDA Clean Title",
    landSize: "1,500 sqm",
    bedrooms: 5,
    bathrooms: 6,
    carParks: 6,
    image: "assets/images/nova-crest-palace.jpg",
    gallery: [
      "assets/images/nova-crest-palace.jpg",
      "assets/images/your-home-interior.jpg"
    ],
    amenities: [
      "Diplomatic Security Clearance & Guardhouse",
      "Industrial Water Borehole & Standby Caterpillar Generator",
      "Large Swimming Pool & Private Tennis Court",
      "Commercial-Grade Chef Kitchen & Pantry",
      "3-Room Attached Quarters"
    ],
    description: "Available for corporate and diplomatic long-term leases in the heart of Maitama. Exceptional privacy, refined architecture, and vetted security installations.",
    proximity: {
      airport: "28 mins",
      cbd: "8 mins",
      landmark: "2 mins to Netherlands Embassy & British High Commission"
    },
    investmentThesis: "Diplomatic lease covenants in Maitama offer multi-year upfront payments in foreign or verified currency."
  }
];

export const ABUJA_DISTRICTS = [
  {
    id: "maitama",
    name: "Maitama",
    tier: "Tier 1 Luxury",
    headline: "The Pinnacle of Diplomatic Prestige & Generational Wealth",
    character: "Home to foreign embassies, high commissioners, ministers, and Nigeria's wealthiest families. Characterized by expansive boulevards, heavy security, and strict FCDA building codes.",
    priceRange: "₦750M – ₦3.5B ($500K – $2.5M USD)",
    distanceAirport: "28 km (25-30 mins)",
    distanceCBD: "5 km (8 mins)",
    majorRoads: "Shehu Shagari Way, IBB Way, Aguiyi Ironsi St",
    growthIndex: "+18.2% YoY",
    popularFor: "Ultra-luxury mansions, diplomatic leases, foreign currency rents"
  },
  {
    id: "asokoro",
    name: "Asokoro",
    tier: "Tier 1 Luxury",
    headline: "The Seat of Power & Uncompromising Security",
    character: "Bordered by Aso Rock, Asokoro is the administrative heart of the Federation. Extreme privacy, state-of-the-art security, and presidential neighbors.",
    priceRange: "₦650M – ₦3B ($440K – $2M USD)",
    distanceAirport: "32 km (30 mins)",
    distanceCBD: "4 km (6 mins)",
    majorRoads: "Murtala Mohammed Expressway, Yakubu Gowon Cres",
    growthIndex: "+17.5% YoY",
    popularFor: "Government officials, international agencies, sovereign estates"
  },
  {
    id: "guzape",
    name: "Guzape",
    tier: "Tier 1 Emerging Luxury",
    headline: "The Beverly Hills of Abuja — Elevated Hillside Living",
    character: "Abuja's premier hillside residential destination. Spectacular panoramic views over the city, contemporary architecture, and rapid luxury development.",
    priceRange: "₦350M – ₦1.2B ($240K – $800K USD)",
    distanceAirport: "29 km (27 mins)",
    distanceCBD: "6 km (7 mins)",
    majorRoads: "Hassan Usman Katsina St, Asokoro-Guzape Link",
    growthIndex: "+28.4% YoY",
    popularFor: "Diaspora executives, creative modern duplexes, luxury terraces"
  },
  {
    id: "jabi",
    name: "Jabi",
    tier: "Tier 1 Lifestyle",
    headline: "Waterfront Serenity Combined with Urban Vitality",
    character: "Centered around the picturesque Jabi Lake. Offers water sports, high-end shopping at Jabi Lake Mall, and lakeside residential villas.",
    priceRange: "₦400M – ₦1.5B ($270K – $1M USD)",
    distanceAirport: "24 km (22 mins)",
    distanceCBD: "8 km (10 mins)",
    majorRoads: "Shehu Yar'Adua Way, Obafemi Awolowo Way",
    growthIndex: "+21.0% YoY",
    popularFor: "Waterfront villas, diaspora vacation homes, short-let investments"
  },
  {
    id: "karshi",
    name: "Karshi",
    tier: "High-Growth Investment Frontier",
    headline: "Abuja's #1 Land Banking & Capital Appreciation Corridor",
    character: "Located along the Apo-Karshi bypass. With infrastructure rapidly catching up, Karshi provides massive land appreciation for smart diaspora investors.",
    priceRange: "₦15M – ₦45M ($10K – $30K USD) per plot",
    distanceAirport: "45 km (40 mins)",
    distanceCBD: "18 km (20 mins via Apo bypass)",
    majorRoads: "Apo-Karshi Expressway, Nyanya-Karshi Road",
    growthIndex: "+45.0% projected post-road commissioning",
    popularFor: "Land banking, master-planned private estates, low-entry high-ROI"
  },
  {
    id: "kuje",
    name: "Kuje",
    tier: "Green Expansion Belt",
    headline: "Peaceful Suburban Enclave for Sustainable Living",
    character: "Abuja's green food basket and quiet suburban district. Wide open spaces, organic farming potential, and master-planned gated communities.",
    priceRange: "₦12M – ₦60M ($8K – $40K USD) per plot",
    distanceAirport: "15 km (15 mins via bypass)",
    distanceCBD: "28 km (30 mins)",
    majorRoads: "Airport-Kuje Road, Gwagwalada Highway",
    growthIndex: "+22.5% YoY",
    popularFor: "Family country homes, agricultural retreats, affordable acreage"
  },
  {
    id: "lokogoma",
    name: "Lokogoma",
    tier: "Family Residential Hub",
    headline: "Established Gated Estate Living for Upper-Middle Class Families",
    character: "Dense with gated estate communities, private schools, and commercial nodes. High rental demand from working professionals and civil servants.",
    priceRange: "₦120M – ₦280M ($80K – $190K USD) per home",
    distanceAirport: "20 km (20 mins)",
    distanceCBD: "12 km (15 mins)",
    majorRoads: "Airport Expressway Link, Ring Road 2",
    growthIndex: "+19.0% YoY",
    popularFor: "Instant rental cashflow, family homes, completed move-in duplexes"
  },
  {
    id: "airport-road",
    name: "Airport Road Corridor",
    tier: "Aerotropolis Growth Axis",
    headline: "Direct International Access & Fast-Moving Commercial Spine",
    character: "10-lane superhighway linking the capital to the world. Encompasses River Park, Centenary City, and modern diaspora communities.",
    priceRange: "₦180M – ₦450M ($120K – $300K USD)",
    distanceAirport: "10 km (10-12 mins)",
    distanceCBD: "16 km (18 mins)",
    majorRoads: "Umaru Musa Yar'Adua Expressway (Airport Road)",
    growthIndex: "+25.5% YoY",
    popularFor: "Frequent flyers, diaspora families, logistics hubs, luxury apartments"
  }
];

export const BLOG_POSTS = [
  {
    id: "land-title-types-abuja",
    category: "Legal & Due Diligence",
    readTime: "6 min read",
    title: "Land Title Types in Abuja Explained: C of O vs. R of O vs. Excision",
    snippet: "Before sending money from London or Dallas, learn the vital differences between an FCDA Certificate of Occupancy, Right of Occupancy, and Area Council allocations to protect your hard-earned capital.",
    date: "September 2026",
    content: "When investing in Abuja real estate from the diaspora, the single most critical safeguard is understanding the cadastral title. Abuja operates under the Federal Capital Development Authority (FCDA) and the Abuja Geographic Information Systems (AGIS). A Certificate of Occupancy (C of O) grants a statutory 99-year leasehold directly signed by the Minister of the FCT. A Right of Occupancy (R of O) is an offer of grant that must be converted. Excision or Gazette relates to lands excised for community resettlement. At Nova Crest Homes Ltd, every project undergoes strict multi-tier AGIS search verification prior to groundbreaking."
  },
  {
    id: "is-karshi-the-next-big-investment-zone",
    category: "Market Forecast",
    readTime: "5 min read",
    title: "Is Karshi the Next Big Investment Zone? Abuja's High-Yield Corridor",
    snippet: "Why institutional funds and diaspora syndicates are quietly snapping up square kilometers in Karshi before the final bypass connections permanently reshape travel times to the CBD.",
    date: "August 2026",
    content: "Real estate wealth in Abuja has historically favored those who buy ahead of arterial infrastructure. In 2005, Guzape was considered rocky and remote; today it commands over ₦500 million per duplex. The Apo-Karshi road will slash commute times from 90 minutes down to just 20 minutes directly into the Apo district. This dynamic creates an asymmetric investment window for land banking at Nova Crest Horizon Estates."
  },
  {
    id: "diaspora-guide-buying-land-abuja",
    category: "Diaspora Concierge",
    readTime: "7 min read",
    title: "The Diaspora Guide to Buying Real Estate in Abuja Without Getting Burned",
    snippet: "The step-by-step playbook: from independent AGIS searches, structured milestone disbursements, power of attorney protocols, to live drone telemetry.",
    date: "July 2026",
    content: "Over 70% of diaspora investors recount painful tales of sending money to relatives or informal agents who inflated costs or bought encumbered greenfield land. Novacrest Homes Ltd introduces an institutional framework: dedicated escrow, milestone-based payments with engineer certifications, live 4K drone surveillance feeds accessible from your smartphone in London or New York, and direct DHL courier dispatch of your legally perfected title deeds."
  }
];

export const TESTIMONIALS = [
  {
    name: "Dr. Babatunde Alabi",
    role: "Consultant Surgeon, Manchester, UK",
    quote: "Buying property while living in the UK has always been fraught with anxiety. Novacrest Homes Ltd handled my acquisition with military precision. The AGIS title search was shared digitally, the milestone drone videos kept me informed, and the deed was delivered directly to my address in Manchester.",
    project: "Nova Crest Villa (Jabi)",
    rating: 5
  },
  {
    name: "Ngozi & Michael Eze",
    role: "Senior IT Executives, Houston, Texas, USA",
    quote: "What won our trust was their transparency. When they said 'Building The Future You Can Trust', they meant it. No hidden charges, clear building schedules, and a dedicated diaspora liaison who was available despite our 6-hour time zone difference.",
    project: "Nova Crest Garden (Guzape)",
    rating: 5
  },
  {
    name: "Engr. Farouk Danladi",
    role: "Aviation Director, Dubai, UAE",
    quote: "I purchased two residential plots in Karshi through Novacrest for land banking. Within 14 months, capital values jumped by 38%. Their legal documentation and surveyor coordinates were flawless.",
    project: "Nova Crest Horizon Plots (Karshi)",
    rating: 5
  }
];

export function getProperties() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('novacrest_properties');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Error reading stored properties:', err);
  }
  return DEFAULT_PROPERTIES;
}

/**
 * Fetch live property documents from Google Cloud Firestore
 */
export async function fetchFirestoreProperties() {
  try {
    const firestoreProps = await fetchFirestoreCollection("properties");
    if (firestoreProps && firestoreProps.length > 0) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('novacrest_properties', JSON.stringify(firestoreProps));
      }
      return firestoreProps;
    }
  } catch (err) {
    console.warn('[Firestore] Falling back to local dataset:', err);
  }
  return getProperties();
}

/**
 * Save property to both local cache and Google Cloud Firestore
 */
export function saveProperty(propData) {
  const props = getProperties().slice();
  const existingIdx = props.findIndex(p => p.id === propData.id);
  if (existingIdx >= 0) {
    props[existingIdx] = { ...props[existingIdx], ...propData };
  } else {
    props.unshift(propData);
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('novacrest_properties', JSON.stringify(props));
  }

  // Cloud Firestore Sync (Async background)
  if (propData.id) {
    saveFirestoreDocument("properties", propData.id, propData);
  }

  return props;
}

/**
 * Delete property from both local cache and Google Cloud Firestore
 */
export function deleteProperty(id) {
  const props = getProperties().filter(p => p.id !== id);
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('novacrest_properties', JSON.stringify(props));
  }

  // Cloud Firestore Delete (Async background)
  if (id) {
    deleteFirestoreDocument("properties", id);
  }

  return props;
}

/**
 * One-Click Bulk Cloud Sync: Uploads all properties to Google Cloud Firestore
 */
export async function syncAllPropertiesToFirestore() {
  const props = getProperties();
  let count = 0;
  for (const prop of props) {
    const ok = await saveFirestoreDocument("properties", prop.id, prop);
    if (ok) count++;
  }
  return count;
}

export function resetProperties() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('novacrest_properties');
  }
  return DEFAULT_PROPERTIES;
}

export const PROPERTIES = getProperties();

if (typeof window !== 'undefined') {
  window.NovacrestPropertyStore = {
    getProperties,
    fetchFirestoreProperties,
    saveProperty,
    deleteProperty,
    syncAllPropertiesToFirestore,
    resetProperties,
    DEFAULT_PROPERTIES
  };
}

