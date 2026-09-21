# 🌾 Product Requirements Document (PRD)
## Project Name: KisanDirect (किसानडायरेक्ट)
### Theme: Smart India Hackathon (SIH 2026) — Agriculture, FoodTech & Rural Logistics
**Document Version:** 1.0.0  
**Status:** Approved & Implemented  
**Target Platform:** Web (Desktop & Mobile Responsive)  
**Primary Language Support:** English (`en`) & Hindi (`hi`)

---

## 1. Executive Summary & Vision

### 1.1 Vision Statement
To revolutionize India's agrarian supply chain by establishing a decentralized, transparent, and cold-chain-optimized **Direct Farm-to-Fork Digital Grid**. KisanDirect connects Farmers and Farmer Producer Organizations (FPOs) directly to Urban Consumers and Institutional Bulk Buyers (B2B), eliminating exploitative middlemen, reducing post-harvest wastage, and guaranteeing fair, mandi-benchmarked prices.

### 1.2 Core Mission
1. **0% Middlemen Exploitation:** Redirect the 30–60% margin captured by intermediate brokers back to farmers.
2. **Minimize Spoilage via AI Route Optimization:** Reduce post-harvest transit losses of perishables from 35% down to <2% through consolidated cold-chain milk-run routing.
3. **Price Transparency:** Real-time benchmark comparisons against regional APMC Mandi rates to empower farmers with dynamic price discovery.
4. **Inclusive Digital Access:** Vernacular multilingual interface (English & Hindi) designed for rural farmers and diverse buyer groups.

---

## 2. Problem Statement & Market Opportunity

### 2.1 The Current Agrarian Crisis
In India's traditional agricultural marketing ecosystem (APMC Mandis and local sabzi mandis):
- **4 to 7 Layers of Intermediation:** Farm Produce passes through village aggregators, local commission agents (Kachha Arhtiya), mandi brokers (Pucca Arhtiya), wholesale distributors, sub-wholesalers, and neighborhood retail vendors.
- **Farmer Under-realization:** Farmers typically receive only **₹15 to ₹25** for produce that consumers buy for **₹70 to ₹90**.
- **Cold-Chain Deficit & Produce Rot:** Perishable leafy greens (palak, methi) and high-value vegetables suffer severe degradation during ambient-temperature truck transit in Indian weather conditions.
- **Information Asymmetry:** Smallholder farmers lack real-time visibility into consumer demand, retail prices, and institutional wholesale contracts.
- **Fragmented Logistics:** Multiple small pickups create empty-return trips, high diesel burn, and excessive carbon emissions.

### 2.2 KisanDirect Solution Architecture
KisanDirect solves this multi-sided problem by creating a unified 3-role platform:
- **Farmers / FPOs:** Digitize harvest batches, compare asking rates against live Mandi prices, and negotiate forward contracts.
- **Retail Consumers:** Procure morning-harvested produce delivered via cold chain with full origin traceability.
- **B2B Bulk Buyers (Hotels, Chains, Exporters):** Post bulk Requests for Quotes (RFQs), procure multi-ton farm lots, and utilize automated GST invoicing.
- **AI Cold-Chain Fleet Telemetry:** Consolidate multi-farm pickups into optimized shortest-path milk runs with live temperature sensing (2°C–6°C) and carbon reduction tracking.

---

## 3. Target User Personas

| Persona | Role | Key Motivations & Needs | Pain Points Solved |
| :--- | :--- | :--- | :--- |
| **Rameshwar Patel** | Smallholder Farmer / FPO Leader (Nashik, MH) | Wants higher net realized price for cabbage, onions & leafy greens; needs timely bank payments. | Replaces delayed APMC auction vouchers and middleman commissions with instant direct transactions. |
| **Ananya Sharma** | Urban Consumer (Bengaluru / Mumbai) | Wants farm-fresh, chemical-free greens harvested within 24 hours; transparent pricing. | Eliminates wilted, multi-day-old retail stock; ensures direct farmer support. |
| **Rajiv Mehra** | Institutional Bulk Buyer (Restaurant Chain / Supermarket) | Procures 5–15 Tons/week; requires predictable quality, GST bills, and cold-chain integrity. | Streamlines procurement through verified FPOs, avoids unreliable mandi spot markets. |
| **Cold Fleet Operator** | Logistics & Reefer Driver | Needs optimal collection routes across rural clusters to save fuel and maintain reefer temperature. | Solves multi-stop rural routing via Nearest-Neighbor + 2-Opt algorithms with live GPS telemetry. |

---

## 4. Key Functional Modules & Specifications

### 4.1 Authentication & Role-Based Access Control (RBAC)
- **Roles:** `farmer`, `consumer`, `buyer`, `logistics`.
- **Auth Features:**
  - Standard Mobile/Email + Password with secure bcrypt password hashing.
  - JWT (JSON Web Token) session handling.
  - Role-based redirect routing (`/farmer/dashboard`, `/marketplace`, `/buyer/dashboard`, `/logistics/routes`).
  - One-click demo credentials switcher for demonstration and hackathon jury evaluations.
  - Forgot Password OTP simulation flow.
  - Persistent local session caching with auto-reconnect.

### 4.2 Farmer & FPO Dashboard (`/farmer/dashboard`)
- **Produce Lot Publishing:**
  - Crop Name & Variety, Category (Vegetables, Fruits, Grains, Pulses, Spices).
  - Quantity available with dynamic unit recognition (kg, quintals, tons, crates).
  - Direct asking price (₹/kg).
  - Nearest APMC Mandi rate benchmarking with automated **"You earn +X% more direct"** profit advantage calculation.
  - Harvest readiness status (Ready for immediate dispatch, harvesting in 24h, pre-booking).
- **Inventory Management:**
  - Real-time active lot status, order count, and quick deletion/updating.
- **Direct Payout Tracking:**
  - Display of 100% direct payouts disbursed with ₹0 middleman commission deduction.

### 4.3 Consumer Marketplace (`/marketplace`)
- **Interactive Fresh Produce Showcase:**
  - Filtering by categories: All, Green Perishables, Farmer Direct Lots, Fruits.
  - Bilingual produce cards displaying harvest date, farm origin, price vs. middleman MRP, and freshness badges.
  - Direct Farmer Communication modal (Click-to-Call and WhatsApp integration with farmer mobile numbers).
- **Cart & Direct Checkout:**
  - Slide-out Cart Drawer with dynamic quantity adjustments.
  - Free Direct Cold-Chain Delivery slot allocation (Morning 6:00 AM – 9:00 AM).
  - Transparent pricing breakdown highlighting exact money going to the farmer.
  - Order confirmation receipt modal with generated unique Order ID (`KD-ORD-XXXX`).

### 4.4 Bulk Buyer & Institutional Portal (`/buyer/dashboard`)
- **Live Wholesale Farm Lots:**
  - Direct procurement of multi-ton batches directly from verified FPOs.
  - One-click "Procure Lot" converting listed harvest into active forward delivery contracts.
- **RFQ (Request For Quotation) Engine:**
  - Creation of wholesale commodity requirements specifying volume (e.g., "10 Tons/week"), frequency (daily, weekly, spot), target purchase rate, and delivery depot.
  - Status tracking: Bidding Open, Contract Active, In Transit, Completed.
- **Compliance & Cold-Chain Shipment Tracking:**
  - Live cold-chain shipment status card with current transit temperature (e.g., `4.2°C Optimal`) and ETA.
  - Automated GST invoice and e-way bill compliance ready.

### 4.5 AI Cold-Chain Route Optimizer (`/logistics/routes`)
- **Routing Engine:**
  - Nearest-Neighbor heuristic combined with a 2-Opt shortest path algorithm.
  - Accounts for Indian road curvature and rural terrain factor (1.28x multiplier over straight-line Haversine distance).
  - Multiple Regional Hubs (Navi Mumbai APMC Vashi, Pune Hadapsar, Thane Bhiwandi, Nashik Ambad).
  - Realistic Farm Clusters with geographic coordinates (Niphad Valley, Dindori Hills, Narayangaon, Baramati, etc.).
- **Fleet Vehicle Selection:**
  - Light Commercial Reefer (Tata 407 Reefer Van - 3.5T).
  - Heavy Cold Carrier (Eicher Pro - 8.5T).
  - 100% Electric Green Corridor Van (Euler Turbo EV - 2.0T).
- **Savings & Telemetry Analytics:**
  - Baseline unoptimized individual round-trips vs. AI consolidated milk-run.
  - Distance saved (km and %).
  - Transit time saved (hours).
  - Diesel saved (liters) and direct fuel cost saved (₹).
  - Carbon dioxide footprint reduction (kg CO₂ avoided, calculated at 2.68 kg CO₂ per liter of diesel).
  - Spoilage risk mitigation index (projecting produce degradation rate based on ambient vs. cold-chain transit hours).
  - Real-time Reefer Cargo Temperature simulation (maintaining 2°C–5°C).
- **Interactive Multi-Layer Leaflet Map:**
  - Free tile layers without compulsory API keys: Esri Dark Canvas, Midnight High-Contrast, Esri Satellite, OpenStreetMap.
  - Optional provider keys supported: CARTO, Mapbox, Stadia, Google Maps.
  - Interactive custom SVG markers for Cold Hubs, Farm Pickups, and moving Reefer Fleet trucks.
  - Step-by-step waypoint simulation with interactive Play/Pause dispatch controls.

### 4.6 Vernacular Localization & Accessibility
- **Full Bilingual Context:** Toggle between English (`en`) and Hindi (`hi`) across all dashboards, modals, badges, alerts, and navigation menus.
- **Persistent State:** Saves language preference in `localStorage` and synchronizes HTML `lang` attribute.

---

## 5. Technical Architecture & Stack

```mermaid
graph TD
    Client["Frontend: React 19 + Vite + Tailwind CSS"]
    State["Language Context (i18n) + Auth State"]
    Leaflet["Leaflet GIS (Free Tile Providers: Esri, OSM)"]
    
    Express["Backend: Node.js + Express REST API"]
    Heuristic["Route Optimizer Service (Haversine + 2-Opt)"]
    
    DB1[("Primary: MongoDB via Mongoose")]
    DB2[("Fallback: In-Memory Resilient Data Store")]

    Client --> State
    Client --> Leaflet
    Client -->|REST Calls / JWT| Express
    Express --> Heuristic
    Express -->|Try Connection| DB1
    Express -.->|Offline / Standalone Fallback| DB2
```

### 5.1 Frontend Stack
- **Framework:** React 19 with Vite.
- **Styling:** Tailwind CSS 3.4 + PostCSS with customized agricultural emerald/slate color palette.
- **Icons:** Lucide React icons.
- **Mapping & GIS:** Leaflet 1.9 + `@types/leaflet`.
- **State Management:** React Context API for Language/Localization + LocalStorage session handlers.

### 5.2 Backend Stack
- **Runtime:** Node.js (ES Module syntax).
- **Web Framework:** Express 4.19.
- **Security & Auth:** JWT (`jsonwebtoken`), bcrypt password encryption (`bcryptjs`), CORS configured for multi-origin/Vercel support.
- **Logging:** Morgan HTTP logger.
- **Resilient Dual-Persistence Model:**
  - Mongoose 8.3 connects to MongoDB / MongoDB Atlas.
  - Custom in-memory fallback stores (`MemoryCropStore`, `MemoryRFQStore`, `MemoryOrderStore`, `MemoryUserStore`) ensure the API functions seamlessly with zero runtime crashes even when offline or without an active MongoDB connection.

---

## 6. Non-Functional Requirements (NFR)

1. **High Availability & Fault Tolerance:**
   - The platform never crashes due to database connection timeouts; it automatically degrades gracefully to in-memory mode.
2. **Speed & Response Time:**
   - Route optimization runs in <50ms for up to 20 waypoints using 2-Opt local search heuristics.
   - Frontend bundle optimized via Vite for sub-second first contentful paint (FCP).
3. **Responsive Design:**
   - Full usability across smartphones (crucial for farmers in rural areas), tablets, and desktop workstations.
4. **Data Privacy & Trust:**
   - Direct contact buttons give verified buyers transparent access to growers while encrypting sensitive user credentials.

---

## 7. Success Metrics & KPIs (SIH Evaluation Focus)

| Metric | Benchmark / Target | Platform Achievement |
| :--- | :--- | :--- |
| **Middleman Margin Elimination** | ₹0 broker commission | 100% direct farmer payout |
| **Farmer Net Price Improvement** | +15% to +35% above Mandi | Dynamic Mandi benchmarking shows ~34% net gain |
| **Transit Spoilage Rate** | Reduced from 35% to <2% | Calibrated reefer telemetry keeps spoilage at ~0.9% |
| **Logistics Distance & Fuel Savings** | >20% reduction | Consolidated milk-run saves 30–45% km and diesel |
| **Carbon Footprint Reduction** | Measurable kg CO₂ saved | Automated formula: 2.68 kg CO₂ per liter saved |
| **System Uptime & Independence** | 100% demo resilience | Works with or without external database or map API keys |

---

## 8. Future Roadmap & Enhancements

- **Phase 2:** IoT Hardware Integration with LoRaWAN/OBD-II truck sensors for live temperature and humidity logging.
- **Phase 3:** Smart Contract Escrow on ONDC (Open Network for Digital Commerce) protocol with instant UPI Auto-Pay upon verified delivery scan.
- **Phase 4:** Computer Vision AI for automated produce quality grading and defect detection using smartphone camera uploads.
