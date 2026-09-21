/**
 * Professional Agricultural Trade & Logistics Advisory Engine for KisanDirect
 * Delivers executive, articulate, bilingual (Hindi & English) guidance for:
 * 1. Platform Architecture & Direct Trade Mechanism
 * 2. Producer Onboarding & Green Vegetable Listing Protocol
 * 3. Verified Direct Contact & Wholesale Procurement
 * 4. Active Cold-Chain Telemetry (2°C - 4°C) & Shortest-Path AI Routing
 * 5. Zero-Commission Economic Framework & Escrow Financial Settlement
 * 6. Post-Harvest Preservation & Agronomic Quality Standards
 */

export const QUICK_PROMPTS = {
  hi: [
    { id: 'how_works', text: '🏛️ मंच की कार्यप्रणाली क्या है?', tag: 'मंच संरचना' },
    { id: 'how_to_sell', text: '📋 उपज सूचीकरण व विक्रय प्रक्रिया', tag: 'विक्रय दिशानिर्देश' },
    { id: 'contact_farmer', text: '📞 किसानों से प्रत्यक्ष व्यापार संपर्क', tag: 'सीधा समन्वय' },
    { id: 'cold_chain', text: '🚚 शीत-श्रृंखला लॉजिस्टिक्स व रूटिंग', tag: 'कोल्ड-चेन' },
    { id: 'payments', text: '⚖️ मूल्य निर्धारण व एस्क्रो भुगतान', tag: 'वित्तीय निपटान' },
    { id: 'crops_guide', text: '🥬 हरी उपज भंडारण व गुणवत्ता मानक', tag: 'गुणवत्ता संरक्षण' },
  ],
  en: [
    { id: 'how_works', text: '🏛️ Platform Architecture & Direct Trade', tag: 'Overview' },
    { id: 'how_to_sell', text: '📋 Harvest Listing & Producer Onboarding', tag: 'Seller Protocol' },
    { id: 'contact_farmer', text: '📞 Direct Producer Contact & Negotiations', tag: 'Direct Trade' },
    { id: 'cold_chain', text: '🚚 Cold-Chain Logistics & AI Route Optimization', tag: 'Logistics' },
    { id: 'payments', text: '⚖️ Pricing Policy & Digital Escrow Settlement', tag: 'Payments' },
    { id: 'crops_guide', text: '🥬 Post-Harvest Handling & Quality Standards', tag: 'Agronomy' },
  ],
};

const KNOWLEDGE_BASE = [
  {
    id: 'how_works',
    keywords: [
      'how it works', 'how does this work', 'what is kisandirect', 'about platform',
      'kaise kaam karta hai', 'kisan direct kya hai', 'manch kaise chalaye', 'ye app kya hai',
      'platform ke baare me', 'kaam kaise hota hai', 'kaise use kare', 'start kaise kare', 'explain platform', 'architecture'
    ],
    answer: {
      hi: `🏛️ **किसानडायरेक्ट (KisanDirect) की कार्यप्रणाली व व्यापार संरचना:**

सादर नमस्कार। किसानडायरेक्ट भारत का आधुनिकतम **प्रत्यक्ष कृषि विपणन (Direct Farm-to-Market)** डिजिटल अवसंरचना मंच है, जो बिचौलियों व कमीशन एजेंटों को पूर्णतः समाप्त करता है।

1. **उत्पादक किसानों व एफपीओ (FPOs) के लिए**:
   - किसान भाई अपनी हरी सब्जियां (पालक, भिंडी, मेथी, शिमला मिर्च, धनिया) वास्तविक मंडी मूल्यों पर सीधे सूचीबद्ध करते हैं।
   - शून्य दलाली (0% Commission) नीति के तहत 100% लाभांश सीधे उत्पादक के खाते में जमा होता है।
   - सत्यापित क्रेताओं से सीधे फोन व व्हाट्सएप के माध्यम से व्यापारिक संवाद स्थापित होता है।

2. **थोक खरीदारों व उपभोक्ताओं के लिए (Institutional Buyers & Consumers)**:
   - महाराष्ट्र के प्रमुख उत्पादक क्लस्टरों (नासिक, निफाड, पुणे, नारायणगांव) से सीधे ताजी कटी हरी उपज की प्राप्ति।
   - पारदर्शी लॉट विवरण, कटाई का समय तथा सीधे कृषक संपर्क की सुविधा।
   - थोक क्रेताओं के लिए निविदा अनुरोध (RFQ) व डिजिटल अनुबंध की व्यवस्था।

3. **सक्रिय शीत-श्रृंखला लॉजिस्टिक्स (Refrigerated Logistics)**:
   - 2°C से 4°C नियंत्रित तापमान वाले रेफ्रिजरेटेड वैन द्वारा खेत से वितरण टर्मिनल तक सुरक्षित परिवहन, जिससे उपज की ताजगी अक्षुण्ण रहती है।`,
      en: `🏛️ **KisanDirect Platform Architecture & Operating Model:**

Greetings. KisanDirect is India's premier direct agricultural trade network, eliminating traditional intermediaries to connect certified vegetable growers with institutional buyers and households.

1. **For Agricultural Producers & FPOs**:
   - Direct digital listing of fresh green vegetables (Spinach, Okra, Fenugreek, Capsicum, Coriander).
   - Zero intermediary commission ensures that 100% of realized value is credited to the farmer.
   - Verified buyers initiate direct telephone and WhatsApp communications for trade execution.

2. **For Wholesale Buyers & Enterprises**:
   - Direct procurement access across key Maharashtra farm clusters (Nashik, Niphad, Pune, Narayangaon).
   - Real-time lot visibility, harvest timestamps, and direct verified producer coordinates.
   - Instant B2B Request for Quotation (RFQ) processing for commercial volume procurement.

3. **Active Cold-Chain Infrastructure**:
   - Temperature-regulated reefer transport (2°C - 4°C) aggregating harvest directly from farm clusters, ensuring near-zero transit degradation.`
    }
  },
  {
    id: 'how_to_sell',
    keywords: [
      'how to sell', 'add vegetable', 'list produce', 'sell crops', 'add green vegetable',
      'sabji kaise beche', 'sabji kaise jode', 'fasal kaise beche', 'listing kaise kare',
      'vegitables sell', 'kisan beche', 'sabzi bechna hai', 'sell vegetables', 'onboarding'
    ],
    answer: {
      hi: `📋 **उपज सूचीकरण व विक्रय दिशानिर्देश (Producer Selling Protocol):**

किसानडायरेक्ट पर अपनी हरी उपज को सूचीबद्ध व विक्रय करने की मानक प्रक्रिया निम्नलिखित है:

1. **खाता प्रमाणीकरण (Authentication)**:
   - अपने पंजीकृत 10-अंकीय मोबाइल नंबर द्वारा कृषक पोर्टल (Farmer Portal) में लॉगिन करें।
2. **उपज प्रविष्टि (Add Harvest Listing)**:
   - डैशबोर्ड पर **'Add Harvest / नई उपज जोड़ें'** विकल्प का चयन करें।
   - सब्जी की श्रेणी चुनें (जैसे बेबी पालक, कोमल भिंडी, मेथी, शिमला मिर्च)।
   - उपलब्ध मात्रा दर्ज करें (किलोग्राम अथवा क्विंटल में)।
   - अपना पारदर्शी थोक विक्रय मूल्य (रुपये प्रति किलोग्राम) निर्धारित करें।
   - प्रक्षेत्र क्लस्टर (जैसे निफाड पूर्व, नासिक अथवा जुन्नर, पुणे) का चयन करें।
3. **सार्वजनिक प्रकाशन (Live Publication)**:
   - 'Publish Listing' दबाते ही आपकी उपज थोक खरीदारों तथा उपभोक्ताओं के डैशबोर्ड पर प्रदर्शित हो जाती है।
4. **व्यापारिक समन्वय व प्रेषण (Trade Fulfillment)**:
   - खरीदार आपके पंजीकृत नंबर पर सीधे संपर्क करते हैं, जिसके उपरांत हमारे शीत-श्रृंखला वाहन पूर्व-निर्धारित समय पर प्रक्षेत्र से उपज प्राप्त करते हैं।`,
      en: `📋 **Harvest Listing & Trade Execution Protocol:**

Producers can onboard their daily harvest through the following structured workflow:

1. **Authentication**:
   - Access the Farmer Portal using your registered 10-digit mobile number.
2. **Produce Entry ('Add Harvest')**:
   - Select the target horticultural commodity (Baby Spinach, Tender Okra, Fresh Fenugreek, Green Capsicum).
   - Specify harvest volume (in Kilograms or Quintals).
   - Formulate your expected farmgate wholesale price (₹/kg).
   - Designate your farm aggregation cluster (e.g., Niphad East, Nashik).
3. **Market Activation**:
   - Upon submission, your verified listing becomes instantly accessible across B2B wholesale and consumer portals.
4. **Order Fulfillment**:
   - Commercial buyers reach out via direct dialing/messaging, and refrigerated collection is routed directly to your farm perimeter.`
    }
  },
  {
    id: 'contact_farmer',
    keywords: [
      'call farmer', 'contact farmer', 'farmer phone', 'phone number', 'whatsapp',
      'kisan ka number', 'farmer se baat', 'kisan se contact', 'phone kaise kare',
      'mobile number', 'direct call', 'sampark kaise kare', 'call', 'communication'
    ],
    answer: {
      hi: `📞 **प्रत्यक्ष कृषक संवाद नीति (Direct Producer Communication):**

किसानडायरेक्ट पूर्ण पारदर्शिता की नीति पर कार्य करता है। खरीदारों को कृषकों से सीधे संपर्क के सर्वाधिकार प्रदान किए जाते हैं:

1. **डैशबोर्ड से सीधा संपर्क**:
   - बाज़ार (Marketplace) अथवा खरीदार डैशबोर्ड (Buyer Dashboard) में प्रत्येक उपज लॉट के साथ कृषक का अधिकृत नाम, प्रक्षेत्र क्षेत्र तथा सत्यापित मोबाइल नंबर उपलब्ध है।
2. **तत्काल कॉलिंग सुविधा**:
   - '📞 Call Farmer' बटन पर क्लिक करते ही आपके फ़ोन का डायलर सीधे कृषक के नंबर से संयोजित हो जाता है।
3. **व्हाट्सएप व्यावसायिक संवाद**:
   - '💬 WhatsApp' बटन द्वारा आप सीधे मात्रा, अनुबंध तथा आपूर्ति समय का द्विपक्षीय निर्धारण कर सकते हैं।
4. **डायनामिक मैप एकीकरण**:
   - रूट ऑप्टिमाइज़र मैप पर स्थित किसी भी वे-पॉइंट पिन पर क्लिक करने पर कृषक का विवरण व संपर्क विकल्प प्रदर्शित हो जाता है।`,
      en: `📞 **Direct Producer Communication & Verification:**

KisanDirect adheres to strict trade transparency, enabling unimpeded communication between verified buyers and farmers:

1. **Listing-Level Contact Coordinates**:
   - Every commodity card on the Buyer Dashboard and Marketplace explicitly displays the producer's name, district, and mobile contact.
2. **1-Click Direct Telephony**:
   - Clicking '📞 Call Farmer' triggers instant mobile telephony directly to the farmer's registered handset.
3. **Commercial WhatsApp Negotiation**:
   - Clicking '💬 WhatsApp' establishes direct encrypted communication for volume negotiation and dispatch coordination.
4. **GIS Map Integration**:
   - Clicking any waypoint pin on the Dynamic GIS Route Map reveals detailed producer dossiers with direct dialing capabilities.`
    }
  },
  {
    id: 'cold_chain',
    keywords: [
      'cold chain', 'route optimization', 'route optimizer', 'map', 'dynamic map',
      'cold storage', 'reefer', 'truck', 'temperature', 'spoilage',
      'route kya hai', 'truck kaise aayega', 'map kaise dekhe', 'cooling', 'kharab nahi hogi', 'logistics'
    ],
    answer: {
      hi: `🚚 **शीत-श्रृंखला अवसंरचना व AI मार्ग अनुकूलन (Cold-Chain & Route Optimization):**

नाशवान हरी सब्जियों की ताजगी तथा पोषण मूल्य बनाए रखने हेतु किसानडायरेक्ट की तकनीकी प्रणाली:

1. **नियंत्रित प्रशीतित वाहन (Reefer Vehicles 2°C - 4°C)**:
   - कटाई के उपरांत सब्जियों को तत्काल सक्रिय प्रशीतित तापमान (2°C से 4°C) में स्थानांतरित किया जाता है, जिससे अपव्यय दर 1.8% से भी नीचे नियंत्रित रहती है।
2. **AI मल्टी-स्टॉप रूट ऑप्टिमाइज़र**:
   - हमारा एल्गोरिद्म प्रक्षेत्र क्लस्टरों (निफाड, पुणे घाटी, डिंडोरी) से केंद्रीय टर्मिनलों (नवी मुंबई, ठाणे, पुणे) तक का न्यूनतम दूरी वाला समेकित मार्ग तैयार करता है।
   - इसके द्वारा **68% तक यात्रा दूरी तथा ₹10,000+ प्रति फेरा ईंधन लागत की बचत** सुनिश्चित होती है।
3. **डायनामिक जीआईएस मैपिंग (Dynamic GIS Map)**:
   - प्रचालन नियंत्रण कक्ष (Operations Control) द्वारा वाहनों की वास्तविक स्थिति, चाल तथा प्रशीतन तापमान की सतत लाइव निगरानी की जाती है।`,
      en: `🚚 **Cold-Chain Logistics & AI Route Optimization Architecture:**

How KisanDirect guarantees maximum freshness and minimal economic loss for perishable produce:

1. **Active Reefer Telemetry (2°C - 4°C)**:
   - Produce is transferred into temperature-regulated refrigerated vehicles immediately post-harvest, capping spoilage risks below 1.8%.
2. **AI Consolidated Milk-Run Routing**:
   - Our routing heuristic sequences farm pickups across regional clusters (Niphad, Pune Valley, Dindori) toward distribution hubs (Navi Mumbai, Thane, Pune).
   - Achieves up to **68% road transit reduction** and saves substantial diesel expenditures.
3. **Dynamic GIS Mapping System**:
   - Offers real-time vehicle GPS tracking, speed monitoring, and reefer compartment temperature audit along the transit path.`
    }
  },
  {
    id: 'payments',
    keywords: [
      'payment', 'pricing', 'money', 'upi', 'bank account', 'cost', 'commission',
      'paise kaise milenge', 'daam kaise tay kare', 'bhugtan', 'rate kya hai',
      'commission kitna hai', 'paisa kab aayega', 'settlement', 'escrow'
    ],
    answer: {
      hi: `⚖️ **मूल्य निर्धारण, आर्थिक मॉडल व डिजिटल वित्तीय निपटान:**

1. **शून्य दलाली व स्वायत्त मूल्य निर्धारण**:
   - कृषक स्वयं अपनी उपज का थोक मूल्य प्रति किलोग्राम निर्धारित करते हैं। किसानडायरेक्ट किसानों से किसी भी प्रकार का कमीशन नहीं लेता।
2. **डिजिटल वित्तीय सुरक्षा (Settlement Framework)**:
   - **प्रत्यक्ष बैंक अंतरण (Direct NEFT/RTGS)**: प्रेषण सत्यापन के उपरांत धनराशि सीधे कृषक के बैंक खाते में स्थानांतरित की जाती है।
   - **तत्काल यूपीआई (Instant UPI)**: छोटे व मध्यम लेनदेनों के लिए त्वरित डिजिटल भुगतान सुविधा।
3. **थोक अनुबंधों हेतु डिजिटल एस्क्रो (Digital Escrow)**:
   - बड़े वाणिज्यिक ऑर्डरों के लिए खरीदार की धनराशि सुरक्षित एस्क्रो में संरक्षित रहती है तथा गुणवत्ता व मात्रा पुष्टि के उपरांत किसान को निर्गत की जाती है।`,
      en: `⚖️ **Pricing Governance, Economic Model & Financial Settlement:**

1. **Zero-Commission Autonomy**:
   - Farmers exercise complete sovereign control over pricing. KisanDirect levies zero brokerage fees on agricultural producers.
2. **Settlement Architecture**:
   - **Direct Bank Transfers (NEFT/RTGS)**: Dispatched lots trigger automated clearing directly into verified farmer accounts.
   - **Instant UPI Clearing**: Rapid settlements via official UPI channels for daily commercial transactions.
3. **Institutional Escrow Safeguards**:
   - Commercial wholesale RFQ orders operate under digital escrow protection, mitigating default risk for both grower and enterprise buyer.`
    }
  },
  {
    id: 'crops_guide',
    keywords: [
      'palak', 'spinach', 'bhindi', 'okra', 'methi', 'capsicum', 'coriander', 'dhaniya',
      'temperature', 'storage', 'crop care', 'harvest time',
      'sabji ka dhyan', 'kitne temperature', 'taaza kaise rakhe', 'agronomy', 'post harvest'
    ],
    answer: {
      hi: `🥬 **कटाई-उपरांत प्रबंधन व कृषि-जलवायु मानक (Post-Harvest Agronomy):**

हरी सब्जियों की गुणवत्ता व बाजार मूल्य सुरक्षित रखने हेतु अनुशंसित वैज्ञानिक मानक:

- **बेबी पालक व हरी मेथी (Spinach & Fenugreek)**:
  - आदर्श भंडारण तापमान: **2°C से 4°C**, आपेक्षिक आर्द्रता 95%।
  - कटाई का सर्वोत्तम समय: प्रातः 5:00 से 7:30 बजे, जिससे पत्तियों में प्राकृतिक नमी बनी रहे।
- **कोमल भिंडी (Tender Okra)**:
  - आदर्श तापमान: **7°C से 10°C** (अत्यधिक ठंड से शीत-क्षति / chilling injury से बचाएं)।
- **हरी शिमला मिर्च (Green Capsicum)**:
  - आदर्श तापमान: **4°C से 7°C**।
- **पैकेजिंग मानक**:
  - प्लास्टिक बोरियों के स्थान पर हमेशा छिद्रयुक्त हवादार प्लास्टिक क्रेट्स (Ventilated Crates) तथा नमी अवशोषक पैड का उपयोग करें।`,
      en: `🥬 **Post-Harvest Quality Standards & Agronomic Guidelines:**

Scientific handling protocols to ensure prime commercial valuation for high-respiration greens:

- **Baby Spinach & Fenugreek (पालक व मेथी)**:
  - Optimal Reefer Storage: **2°C to 4°C** with 95% relative humidity.
  - Optimal Harvest Window: 5:00 AM - 7:30 AM to minimize field heat.
- **Tender Okra (भिंडी)**:
  - Optimal Storage: **7°C to 10°C** to avoid chilling injury and blackening.
- **Green Capsicum (शिमला मिर्च)**:
  - Optimal Storage: **4°C to 7°C** under calibrated air circulation.
- **Packaging Protocol**:
  - Always utilize food-grade ventilated crates with moisture pads rather than non-breathable poly bags.`
    }
  },
  {
    id: 'login_help',
    keywords: [
      'login', 'register', 'sign in', 'account', 'password', 'forgot password',
      'login kaise kare', 'khata kaise banaye', 'registration kaise kare', 'password bhul gaya', 'portal'
    ],
    answer: {
      hi: `🔐 **पोर्टल प्रमाणीकरण व खाता पंजीकरण प्रक्रिया:**

1. **व्यापारिक भूमिका का चयन (Designate Role)**:
   - 🌾 **कृषक (Farmer / FPO)**: उपज सूचीकरण तथा प्रत्यक्ष विक्रय प्रबंधन हेतु।
   - 🏢 **थोक खरीदार (Institutional Buyer)**: थोक अधिप्राप्ति व शीत-श्रृंखला ऑर्डर हेतु।
   - 🛒 **उपभोक्ता (Retail Consumer)**: ताजी हरी सब्जियों की घरेलू खरीद हेतु।
2. **सुरक्षित लॉगिन**: अपने 10-अंकीय मोबाइल नंबर व अधिकृत पासवर्ड द्वारा प्रवेश करें।
3. **त्वरित डेमो परीक्षण (One-Click Demo)**: लॉगिन पृष्ठ पर 'Fill Demo Credentials' बटन द्वारा तत्काल सभी पोर्टलों का अवलोकन किया जा सकता है।
4. **नवीन पंजीकरण**: 'Create New Account' विकल्प द्वारा संस्थागत अथवा व्यक्तिगत विवरण दर्ज कर 1 मिनट में खाता प्रारंभ करें।`,
      en: `🔐 **Portal Authentication & Registration Guidelines:**

1. **Designate User Role**:
   - 🌾 **Agricultural Producer (Farmer/FPO)**: For commodity listing and farmgate dispatch.
   - 🏢 **Institutional Buyer**: For commercial RFQ contracts and cold-chain aggregation.
   - 🛒 **Retail Consumer**: For farm-fresh household procurement.
2. **Secure Sign-In**: Authenticate using your 10-digit mobile number and credentials.
3. **Demo Access**: Leverage the 1-click 'Fill Demo Credentials' feature on the login screen for instant evaluation.
4. **Registration**: Select 'Create New Account' to onboard your enterprise or farm within 60 seconds.`
    }
  }
];

export const aiAssistantService = {
  /**
   * Find matching answer from knowledge base
   */
  async askQuestion(query, lang = 'hi') {
    const cleanQuery = (query || '').toLowerCase().trim();

    if (!cleanQuery) {
      return {
        id: 'empty',
        response: lang === 'hi' 
          ? 'कृपया अपना प्रश्न वाक् (माइक) द्वारा कहें अथवा मुख्य विषयों में से किसी एक का चयन करें।' 
          : 'Please dictate your inquiry via microphone or select from the advisory topics below.',
        confidence: 1.0,
      };
    }

    // 1. Keyword & intent matching
    for (const item of KNOWLEDGE_BASE) {
      const match = item.keywords.some(kw => cleanQuery.includes(kw));
      if (match) {
        return {
          id: item.id,
          response: item.answer[lang] || item.answer.en,
          confidence: 0.95,
          source: 'knowledge_base'
        };
      }
    }

    // 2. Fuzzy fallback match for common question stems
    if (cleanQuery.includes('kisan') || cleanQuery.includes('farmer') || cleanQuery.includes('khet')) {
      return {
        id: 'farmer_general',
        response: lang === 'hi'
          ? '🌾 किसानडायरेक्ट पर उत्पादक कृषक अपनी हरी उपज बिना किसी बिचौलिये के सीधे पारदर्शी मूल्यों पर विक्रय कर सकते हैं। अपनी उपज दर्ज करने हेतु कृषक डैशबोर्ड में "Add Harvest" का उपयोग करें, अथवा किसी विशिष्ट विषय पर मुझसे परामर्श करें।'
          : '🌾 On KisanDirect, agricultural producers market their harvest directly with 0% middleman fees. To onboard your lot, navigate to the Farmer Dashboard and click "Add Harvest", or inquire for specific advisory support.',
        confidence: 0.8,
        source: 'fuzzy'
      };
    }

    if (cleanQuery.includes('buyer') || cleanQuery.includes('kharid') || cleanQuery.includes('buy') || cleanQuery.includes('order')) {
      return {
        id: 'buyer_general',
        response: lang === 'hi'
          ? '🏢 थोक एवं संस्थागत खरीदार सीधे किसान डैशबोर्ड पर लाइव उपज देख सकते हैं, सत्यापित कृषकों से सीधे फोन पर व्यापार तय कर सकते हैं, अथवा थोक RFQ निविदा जारी कर सकते हैं।'
          : '🏢 Institutional buyers can inspect live harvest availability on the Buyer Dashboard, establish direct telephonic negotiations with growers, or publish commercial volume RFQs.',
        confidence: 0.8,
        source: 'fuzzy'
      };
    }

    // 3. Graceful fallback with helpful pointers
    return {
      id: 'general_fallback',
      response: lang === 'hi'
        ? `🙏 आपके प्रश्न का संज्ञान लिया गया। किसानडायरेक्ट व्यापार व संचालन परामर्श के अंतर्गत आप निम्नलिखित विषयों पर परामर्श प्राप्त कर सकते हैं:

1. **मंच की कार्यप्रणाली व प्रत्यक्ष व्यापार संरचना**
2. **हरी सब्जियों का सूचीकरण व विक्रय दिशानिर्देश**
3. **किसानों से सीधा फोन व व्हाट्सएप व्यापार समन्वय**
4. **शीत-श्रृंखला लॉजिस्टिक्स (2°C-4°C) व AI मार्ग अनुकूलन**
5. **मूल्य निर्धारण, शून्य कमीशन व डिजिटल एस्क्रो भुगतान**

आप नीचे दिए गए माइक 🎙️ बटन को दबाकर सीधे बोलकर भी परामर्श प्राप्त कर सकते हैं।`
        : `🙏 Your inquiry has been noted. Under the KisanDirect Trade & Operations Advisory, you may seek guidance across the following domains:

1. **Platform Architecture & Direct Farmgate Trade**
2. **Produce Listing & Seller Onboarding Protocol**
3. **Direct Telephone & WhatsApp Trade Coordination**
4. **Cold-Chain Logistics (2°C-4°C) & AI Route Optimization**
5. **Pricing Autonomy, Zero Commission & Digital Escrow**

You may also dictate your question directly using the microphone 🎙️ control below.`,
      confidence: 0.6,
      source: 'fallback'
    };
  }
};
