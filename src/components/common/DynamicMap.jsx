import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  Maximize2,
  Minimize2,
  Navigation,
  Thermometer,
  Truck,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Key,
  Info,
  ExternalLink,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

const TILE_PROVIDERS = {
  dark: {
    id: 'dark',
    name: 'Dark Canvas',
    shortName: '🌙 Dark',
    badge: '100% Free • No Key',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    referenceUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16,
    subdomains: [],
    requiresKey: false,
    description: 'High-contrast dark GIS canvas by Esri. No watermark, no API key needed.',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Neon',
    shortName: '🌌 Midnight',
    badge: '100% Free • No Key',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors (Midnight CSS Filter)',
    maxZoom: 19,
    subdomains: 'abc',
    isCssDark: true,
    requiresKey: false,
    description: 'OpenStreetMap styled with midnight high-contrast CSS neon filter. 100% free.',
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    shortName: '🛰️ Satellite',
    badge: '100% Free • No Key',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS',
    maxZoom: 18,
    subdomains: [],
    requiresKey: false,
    description: 'High-resolution global satellite photography by Esri. Free public GIS access.',
  },
  streets: {
    id: 'streets',
    name: 'Street Map',
    shortName: '🗺️ Street',
    badge: '100% Free • No Key',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
    subdomains: 'abc',
    requiresKey: false,
    description: 'Global community-driven road and highway network. 100% free open data.',
  },
  carto: {
    id: 'carto',
    name: 'CARTO Dark Matter',
    shortName: '⚡ CARTO',
    badge: 'Optional Key',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO',
    maxZoom: 19,
    subdomains: 'abcd',
    requiresKey: true,
    description: 'CARTO raster basemaps. Unregistered requests show an API watermark.',
  },
};

export const DynamicMap = ({
  legs = [],
  activeLegIndex = 0,
  isSimulating = false,
  vehicleName = 'Tata 407 Reefer Van',
  onStopClick,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const haloPolylineRef = useRef(null);
  const truckMarkerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const referenceLayerRef = useRef(null);

  const [activeLayer, setActiveLayer] = useState('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(48);

  // Optional User API Keys
  const [cartoApiKey, setCartoApiKey] = useState(() => {
    return localStorage.getItem('kd_carto_api_key') || (import.meta.env?.VITE_CARTO_API_KEY || '');
  });
  const [mapboxToken, setMapboxToken] = useState(() => {
    return localStorage.getItem('kd_mapbox_token') || (import.meta.env?.VITE_MAPBOX_TOKEN || '');
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keySavedToast, setKeySavedToast] = useState(false);

  // Helper to attach/update Leaflet tile layer
  const applyTileLayer = (map, layerId, cKey) => {
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }
    if (referenceLayerRef.current) {
      map.removeLayer(referenceLayerRef.current);
      referenceLayerRef.current = null;
    }

    const tileConf = TILE_PROVIDERS[layerId] || TILE_PROVIDERS.dark;
    let targetUrl = tileConf.url;

    // Attach API Key if CARTO
    if (tileConf.id === 'carto' && cKey) {
      targetUrl = `${tileConf.url}?api_key=${encodeURIComponent(cKey)}`;
    }

    const tileOpts = {
      maxZoom: tileConf.maxZoom || 19,
      attribution: tileConf.attribution,
    };
    if (tileConf.subdomains && tileConf.subdomains.length > 0) {
      tileOpts.subdomains = tileConf.subdomains;
    }

    const layer = L.tileLayer(targetUrl, tileOpts).addTo(map);
    tileLayerRef.current = layer;

    // Apply Midnight CSS filter if requested
    if (tileConf.isCssDark) {
      layer.on('tileload', (e) => {
        if (e?.tile) {
          e.tile.style.filter = 'invert(100%) hue-rotate(180deg) brightness(92%) contrast(90%)';
        }
      });
    }

    // Add reference labels layer if configured (e.g. for Esri Dark Gray)
    if (tileConf.referenceUrl) {
      const refOpts = {
        maxZoom: tileConf.maxZoom || 16,
      };
      referenceLayerRef.current = L.tileLayer(tileConf.referenceUrl, refOpts).addTo(map);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialLat = legs.length > 0 ? legs[0].lat : 19.5;
    const initialLng = legs.length > 0 ? legs[0].lng : 73.5;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
    });

    // Add zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial tile layer
    applyTileLayer(map, activeLayer, cartoApiKey);

    mapInstanceRef.current = map;

    // Handle container resize
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile provider when activeLayer or cartoApiKey changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      applyTileLayer(mapInstanceRef.current, activeLayer, cartoApiKey);
    }
  }, [activeLayer, cartoApiKey]);

  // Render Waypoint Markers & Polyline Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !legs || legs.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    if (polylineRef.current) map.removeLayer(polylineRef.current);
    if (haloPolylineRef.current) map.removeLayer(haloPolylineRef.current);
    if (truckMarkerRef.current) map.removeLayer(truckMarkerRef.current);

    const latLngs = legs.map((leg) => [leg.lat, leg.lng]);

    // 1. Draw Polyline Glow Halo
    haloPolylineRef.current = L.polyline(latLngs, {
      color: '#10b981',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // 2. Draw Main Animated Route Polyline
    polylineRef.current = L.polyline(latLngs, {
      color: '#34d399',
      weight: 4,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round',
      opacity: 0.95,
    }).addTo(map);

    // 3. Add Custom Markers for Each Waypoint
    legs.forEach((leg, idx) => {
      const isDestination = leg.isDestination;
      const isActive = idx === activeLegIndex;

      // Custom HTML Pin Icon
      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
          ${
            isActive
              ? '<span class="absolute -inset-2 rounded-full bg-emerald-400/60 animate-ping"></span>'
              : ''
          }
          <div class="w-8 h-8 rounded-2xl flex items-center justify-center font-black text-xs shadow-lg border-2 ${
            isDestination
              ? 'bg-blue-600 text-white border-white'
              : 'bg-emerald-600 text-white border-white'
          }">
            ${isDestination ? '🏢' : idx + 1}
          </div>
          <div class="absolute -bottom-5 bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap border border-slate-700 pointer-events-none">
            ${leg.name.split(' ')[0]}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([leg.lat, leg.lng], { icon: customIcon }).addTo(map);

      // Rich interactive popup
      const popupHtml = `
        <div class="p-2 text-slate-800 font-sans max-w-[240px]">
          <div class="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-emerald-800">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Stop ${idx + 1} of ${legs.length}</span>
          </div>
          <h4 class="font-extrabold text-sm text-slate-900 leading-tight">${leg.name}</h4>
          <p class="text-xs text-slate-500 mt-0.5">${leg.location}</p>
          ${
            leg.crop
              ? `<p class="text-xs font-semibold text-emerald-700 mt-1">🌾 ${leg.crop} (${leg.quantity})</p>`
              : ''
          }
          <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
            <span class="text-slate-600">ETA: ${leg.estimatedArrival}</span>
            <span class="font-bold text-emerald-700">${leg.currentTemperatureC}</span>
          </div>
          ${
            leg.farmerMobile
              ? `
            <div class="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <a href="tel:${leg.farmerMobile.replace(/\s+/g, '')}" class="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg text-[10px] font-bold no-underline">
                📞 Call Farmer
              </a>
              <a href="https://wa.me/${leg.farmerMobile.replace(/[^\d]/g, '')}" target="_blank" class="flex-1 py-1 px-2 bg-teal-800 hover:bg-teal-900 text-white text-center rounded-lg text-[10px] font-bold no-underline">
                💬 WhatsApp
              </a>
            </div>`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260 });

      marker.on('click', () => {
        if (onStopClick) onStopClick(leg, idx);
      });

      markersRef.current.push(marker);
    });

    // 4. Create Moving Reefer Truck Marker
    const activeLeg = legs[activeLegIndex] || legs[0];
    const truckHtml = `
      <div class="relative flex items-center justify-center pointer-events-none">
        <span class="absolute -inset-3 rounded-full bg-emerald-400/40 animate-pulse"></span>
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-xl border-2 border-white shadow-emerald-500/50">
          <span class="text-lg">🚚</span>
        </div>
        <div class="absolute -top-6 bg-emerald-950 text-emerald-300 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow border border-emerald-400/50 whitespace-nowrap">
          ${activeLeg.currentTemperatureC || '4.1°C'}
        </div>
      </div>
    `;

    const truckIcon = L.divIcon({
      html: truckHtml,
      className: 'truck-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    truckMarkerRef.current = L.marker([activeLeg.lat, activeLeg.lng], {
      icon: truckIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Fit map to show all bounds smoothly
    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
  }, [legs]);

  // Animate truck movement when activeLegIndex changes during simulation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !truckMarkerRef.current || !legs[activeLegIndex]) return;

    const targetLeg = legs[activeLegIndex];
    const targetLatLng = L.latLng(targetLeg.lat, targetLeg.lng);

    // Smoothly pan map and move truck
    truckMarkerRef.current.setLatLng(targetLatLng);

    // Fluctuate speed realistically during simulation
    setCurrentSpeed(Math.floor(45 + Math.random() * 15));

    if (isSimulating) {
      map.panTo(targetLatLng, { animate: true, duration: 1.2 });
    }
  }, [activeLegIndex, isSimulating]);

  const handleFitBounds = () => {
    const map = mapInstanceRef.current;
    if (!map || legs.length === 0) return;
    const latLngs = legs.map((l) => [l.lat, l.lng]);
    map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
  };

  const currentLeg = legs[activeLegIndex] || legs[0] || {};

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[480px]'
      }`}
    >
      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-950" />

      {/* Top Map Toolbar: Layer Selector, API Keys Guide, Recenter, Fullscreen */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2">
        {/* Layer Selector Chips */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-white/15 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveLayer('dark')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeLayer === 'dark'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Esri World Dark Gray Canvas (100% Free • No Key Required)"
          >
            🌙 Dark
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('midnight')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeLayer === 'midnight'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            title="OpenStreetMap Midnight Neon CSS Filter (100% Free • No Key Required)"
          >
            🌌 Midnight
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeLayer === 'satellite'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Esri World Satellite Imagery (100% Free • No Key Required)"
          >
            🛰️ Satellite
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('streets')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeLayer === 'streets'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
            title="OpenStreetMap Standard (100% Free • No Key Required)"
          >
            🗺️ Street
          </button>
        </div>

        {/* API Keys Guide & Settings Button */}
        <button
          type="button"
          onClick={() => setShowKeyModal(true)}
          className="px-2.5 py-1.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-white rounded-2xl border border-amber-500/30 hover:border-amber-400 shadow-lg transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
          title="Map Providers & API Keys Info"
        >
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">API Keys</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Default layers 100% Free" />
        </button>

        {/* Fit Route Bounds Button */}
        <button
          type="button"
          onClick={handleFitBounds}
          className="p-2 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-white rounded-2xl border border-white/15 shadow-lg transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
          title="Fit Route to Viewport"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Fit Route</span>
        </button>

        {/* Fullscreen Toggle Button */}
        <button
          type="button"
          onClick={() => {
            setIsFullscreen(!isFullscreen);
            setTimeout(() => {
              if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
            }, 200);
          }}
          className="p-2 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-white rounded-2xl border border-white/15 shadow-lg transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Interactive API Keys & Provider Guide Modal */}
      {showKeyModal && (
        <div className="absolute inset-0 z-[500] bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto flex items-center justify-center">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 max-w-xl w-full text-white shadow-2xl relative space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Map Providers & API Keys</h3>
                  <p className="text-xs text-slate-400">Why keys were needed and how to use 100% free layers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Why API Key Required Explainer Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Info className="w-4 h-4" />
                <span>Why did Dark Mode show "API Key Required"?</span>
              </div>
              <p>
                The third-party service <strong>CARTO Dark Matter</strong> (<code>basemaps.cartocdn.com</code>) recently updated its policy to require registered developer API keys. When called without a key, it prints a visual <em>"API KEY REQUIRED"</em> watermark directly onto the tile imagery.
              </p>
              <p className="text-emerald-300 font-semibold pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Fixed!</strong> KisanDirect now uses <strong>Esri World Dark Gray Canvas</strong> and <strong>Midnight Neon</strong> by default — which are <strong>100% FREE with ZERO API keys or watermarks required!</strong>
                </span>
              </p>
            </div>

            {/* Provider Comparison Status */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Default 100% Free Providers (No Keys Needed)</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white/5 border border-emerald-500/30 rounded-xl flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">🌙</span>
                  <div>
                    <p className="font-bold text-white">Esri Dark Gray Canvas</p>
                    <p className="text-[11px] text-slate-400">ArcGIS global dark tiles. No key, no watermark.</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Active Default
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">🌌</span>
                  <div>
                    <p className="font-bold text-white">OSM Midnight Neon</p>
                    <p className="text-[11px] text-slate-400">OpenStreetMap with high-contrast CSS dark filter.</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      100% Free Open Data
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">🛰️</span>
                  <div>
                    <p className="font-bold text-white">Esri World Satellite</p>
                    <p className="text-[11px] text-slate-400">High-res aerial imagery for Maharashtra farm roads.</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Free GIS Access
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">🗺️</span>
                  <div>
                    <p className="font-bold text-white">OpenStreetMap Standard</p>
                    <p className="text-[11px] text-slate-400">Community street grid & highway numbering.</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Free & Open Source
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Custom API Key Inputs */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Optional: Enter Your Own API Key</p>
                <span className="text-[11px] text-slate-500">Only needed for proprietary tiles</span>
              </div>

              {/* CARTO Key Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span>CARTO API Key</span>
                    <a
                      href="https://carto.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      <span>Get Free Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  {cartoApiKey && (
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Key Stored
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Enter CARTO API Key (e.g. default_public...)"
                    value={cartoApiKey}
                    onChange={(e) => setCartoApiKey(e.target.value)}
                    className="flex-1 bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (cartoApiKey.trim()) {
                        localStorage.setItem('kd_carto_api_key', cartoApiKey.trim());
                      } else {
                        localStorage.removeItem('kd_carto_api_key');
                      }
                      setKeySavedToast(true);
                      setTimeout(() => setKeySavedToast(false), 3000);
                      if (mapInstanceRef.current) {
                        applyTileLayer(mapInstanceRef.current, activeLayer, cartoApiKey.trim());
                      }
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Mapbox Token Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span>Mapbox Access Token</span>
                    <a
                      href="https://account.mapbox.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      <span>Get Free Token (50k loads)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </label>
                  {mapboxToken && (
                    <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Token Stored
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="pk.eyJ1..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="flex-1 bg-slate-950 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (mapboxToken.trim()) {
                        localStorage.setItem('kd_mapbox_token', mapboxToken.trim());
                      } else {
                        localStorage.removeItem('kd_mapbox_token');
                      }
                      setKeySavedToast(true);
                      setTimeout(() => setKeySavedToast(false), 3000);
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              {keySavedToast && (
                <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>API Key configuration saved successfully!</span>
                </p>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('kd_carto_api_key');
                  localStorage.removeItem('kd_mapbox_token');
                  setCartoApiKey('');
                  setMapboxToken('');
                  setActiveLayer('dark');
                  if (mapInstanceRef.current) {
                    applyTileLayer(mapInstanceRef.current, 'dark', '');
                  }
                  setShowKeyModal(false);
                }}
                className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer underline"
              >
                Clear Keys & Use 100% Free Default
              </button>

              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Real-Time Telemetry HUD Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        {/* Left Telemetry Card */}
        <div className="bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/30 text-white shadow-2xl pointer-events-auto flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Truck className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-xs font-bold text-emerald-300">
                {isSimulating ? 'Live En-Route Simulation' : 'AI Cold-Chain Dispatch Ready'}
              </p>
            </div>
            <h4 className="text-sm font-black text-white line-clamp-1">
              {currentLeg.name ? `${currentLeg.name} (${currentLeg.location})` : vehicleName}
            </h4>
          </div>

          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/10 font-mono text-xs">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase font-sans">Speed</span>
              <p className="font-bold text-white">{isSimulating ? `${currentSpeed} km/h` : '0 km/h'}</p>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase font-sans">Reefer Temp</span>
              <p className="font-bold text-emerald-400 flex items-center gap-0.5">
                <Thermometer className="w-3 h-3 text-emerald-400" />
                <span>{currentLeg.currentTemperatureC || '4.1°C'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Active Waypoint Pill */}
        <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-white shadow-2xl pointer-events-auto flex items-center justify-between sm:justify-end gap-3 text-xs">
          <span className="text-slate-400">
            Waypoint {activeLegIndex + 1} / {legs.length}
          </span>
          <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px]">
            {legs[activeLegIndex]?.isDestination ? 'Terminal Delivery' : 'Farm Pickup'}
          </span>
        </div>
      </div>
    </div>
  );
};
