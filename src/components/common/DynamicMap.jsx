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
} from 'lucide-react';

const TILE_PROVIDERS = {
  streets: {
    name: 'Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  dark: {
    name: 'Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
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

  const [activeLayer, setActiveLayer] = useState('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(48);

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
    const tileConf = TILE_PROVIDERS[activeLayer] || TILE_PROVIDERS.dark;
    tileLayerRef.current = L.tileLayer(tileConf.url, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

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

  // Update tile provider when activeLayer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConf = TILE_PROVIDERS[activeLayer] || TILE_PROVIDERS.dark;
    tileLayerRef.current = L.tileLayer(tileConf.url, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
  }, [activeLayer]);

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

      {/* Top Map Toolbar: Layer Selector, Recenter, Fullscreen */}
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
          >
            🌙 Dark
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeLayer === 'satellite'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
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
          >
            🗺️ Street
          </button>
        </div>

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
