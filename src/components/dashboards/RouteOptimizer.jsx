import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  TrendingDown,
  Navigation,
  Thermometer,
  Zap,
  Leaf,
  DollarSign,
  Clock,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  Layers,
  Building2,
  Calendar,
  Cpu,
} from 'lucide-react';
import { logisticsService, FALLBACK_HUBS, FALLBACK_FARMS, FALLBACK_VEHICLES } from '../../services/logisticsService';
import { useLanguage } from '../../context/LanguageContext';

export const RouteOptimizer = () => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [hubs, setHubs] = useState(FALLBACK_HUBS);
  const [farms, setFarms] = useState(FALLBACK_FARMS);
  const [vehicles, setVehicles] = useState(FALLBACK_VEHICLES);

  const [selectedHubId, setSelectedHubId] = useState('hub_mumbai');
  const [selectedVehicleId, setSelectedVehicleId] = useState('reefer_3_5');
  const [selectedFarmIds, setSelectedFarmIds] = useState(['farm_niphad_1', 'farm_niphad_2', 'farm_pune_valley']);
  const [priority, setPriority] = useState('freshness'); // 'freshness' | 'cost' | 'eco'

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routeSolution, setRouteSolution] = useState(null);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeLegIndex, setActiveLegIndex] = useState(0);

  // Load logistics data on mount
  useEffect(() => {
    Promise.all([
      logisticsService.getHubs(),
      logisticsService.getFarms(),
      logisticsService.getFleet(),
    ]).then(([h, f, v]) => {
      if (h?.length) setHubs(h);
      if (f?.length) setFarms(f);
      if (v?.length) setVehicles(v);
    });
  }, []);

  // Compute initial route optimization
  const runOptimization = async () => {
    setIsOptimizing(true);
    setIsSimulating(false);
    setActiveLegIndex(0);

    const solution = await logisticsService.optimizeRoute({
      farmStopIds: selectedFarmIds,
      destinationHubId: selectedHubId,
      vehicleId: selectedVehicleId,
      priority,
    });

    setRouteSolution(solution);
    setIsOptimizing(false);
  };

  useEffect(() => {
    runOptimization();
  }, [selectedHubId, selectedVehicleId, priority]);

  // Simulation timer loop
  useEffect(() => {
    let interval = null;
    if (isSimulating && routeSolution?.legs?.length) {
      interval = setInterval(() => {
        setActiveLegIndex((prev) => {
          if (prev >= routeSolution.legs.length - 1) {
            setIsSimulating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isSimulating, routeSolution]);

  const toggleFarmSelection = (id) => {
    setSelectedFarmIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        if (prev.length <= 1) return prev; // keep at least one stop
        return prev.filter((fId) => fId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedFarmIds(farms.map((f) => f.id));
  };

  const handleClearAll = () => {
    setSelectedFarmIds([farms[0].id]);
  };

  const currentHub = hubs.find((h) => h.id === selectedHubId) || hubs[0];
  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const summary = routeSolution?.summary || {};
  const legs = routeSolution?.legs || [];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      {/* Route Optimizer Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-500/30">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-emerald-400/30 backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t('routeOptimizerBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {t('routeOptimizerTitle')}
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm max-w-3xl leading-relaxed">
            {t('routeOptimizerSub')}
          </p>
        </div>
      </div>

      {/* Control Panel: Destination Hub, Fleet Vehicle & Optimization Priority */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Destination Hub Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>{t('destinationHubLabel')}</span>
            </label>
            <select
              value={selectedHubId}
              onChange={(e) => setSelectedHubId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              {hubs.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.shortName} • {hub.coldStorageCapacity}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{t('vehicleTypeLabel')}</span>
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.capacityTons}T Cap)
                </option>
              ))}
            </select>
          </div>

          {/* Optimization Priority Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t('optimizationPriorityLabel')}</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPriority('freshness')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                  priority === 'freshness'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ {isHindi ? 'ताज़गी' : 'Freshness'}
              </button>
              <button
                type="button"
                onClick={() => setPriority('cost')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                  priority === 'cost'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💰 {isHindi ? 'किफायती' : 'Fuel Cost'}
              </button>
              <button
                type="button"
                onClick={() => setPriority('eco')}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all text-center cursor-pointer ${
                  priority === 'eco'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌱 {isHindi ? 'पर्यावरण' : 'Eco-Green'}
              </button>
            </div>
          </div>
        </div>

        {/* Farm Stops Checkbox Selector Grid */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{t('selectedFarmPickups')} ({selectedFarmIds.length}/{farms.length})</span>
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                {t('selectAllFarms')}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-slate-400 font-semibold hover:text-slate-600 cursor-pointer"
              >
                {t('clearAllFarms')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {farms.map((farm) => {
              const isChecked = selectedFarmIds.includes(farm.id);
              return (
                <button
                  key={farm.id}
                  type="button"
                  onClick={() => toggleFarmSelection(farm.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{farm.farmName}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold truncate">
                      {farm.crop} ({farm.quantity})
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{farm.location}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Optimize CTA Button */}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={runOptimization}
              disabled={isOptimizing}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-extrabold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isOptimizing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>{t('optimizingState')}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 stroke-[3]" />
                  <span>{t('runOptimizationBtn')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Telemetry & Savings Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Route Distance Comparison */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {t('distanceComparison')}
            </span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
              -{summary.distanceSavedPercent || 0}%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {summary.optimizedDistanceKm || 0} km
            </span>
            <span className="text-xs text-slate-400 line-through">
              {summary.unoptimizedDistanceKm || 0} km
            </span>
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Saved {summary.distanceSavedKm || 0} km road transit</span>
          </p>
        </div>

        {/* Transit Time & Spoilage */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {t('spoilageRiskLabel')}
            </span>
            <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
              {summary.spoilageRiskPercent || '1.8%'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {summary.optimizedDurationHours || 0} hrs
            </span>
            <span className="text-xs text-slate-400 line-through">
              {summary.unoptimizedDurationHours || 0} hrs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Saved {summary.hoursSaved || 0} hrs transit freshness</span>
          </p>
        </div>

        {/* Diesel Fuel & INR Saved */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {t('fuelSavingsLabel')}
            </span>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
              ₹ Saved
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-800">
              ₹{summary.fuelCostSavedINR ? summary.fuelCostSavedINR.toLocaleString('en-IN') : 0}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2 flex items-center gap-1 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>{summary.litersSaved || 0} Liters Diesel Saved</span>
          </p>
        </div>

        {/* Cold-Chain Temp & CO2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {t('co2AvoidedLabel')}
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Eco-Corridor
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-900">
              {summary.co2ReductionKg || 0} kg
            </span>
            <span className="text-xs font-bold text-emerald-600">CO₂</span>
          </div>
          <p className="text-xs text-emerald-800 mt-2 flex items-center gap-1 font-semibold">
            <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reefer Temp: {summary.avgReeferTemp || '4.1°C'} (Optimal)</span>
          </p>
        </div>
      </div>

      {/* Visual Route Canvas & Animated Waypoint Map */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              <span>{isHindi ? 'इंटरएक्टिव रूट मैप व वे-पॉइंट विज़ुअलाइज़र' : 'Interactive Cold-Chain Waypoint Visualizer'}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {isHindi ? 'खेत से वितरण हब तक का सबसे छोटा सुरक्षित रूट' : 'Consolidated milk-run shortest path avoiding backtrack delays'}
            </p>
          </div>

          {/* Simulation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                isSimulating
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>{t('pauseSimulationBtn')}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t('startSimulationBtn')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSimulating(false);
                setActiveLegIndex(0);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Simulation Banner */}
        {isSimulating && legs[activeLegIndex] && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-semibold flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-300" />
              <span>
                {t('simulatingLeg')}: <strong>{legs[activeLegIndex].name}</strong> ({legs[activeLegIndex].location})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-300 font-mono">
                Temp: {legs[activeLegIndex].currentTemperatureC}
              </span>
              <span className="bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]">
                Leg {activeLegIndex + 1}/{legs.length}
              </span>
            </div>
          </div>
        )}

        {/* SVG Waypoint Graph Canvas */}
        <div className="relative bg-slate-900/80 rounded-2xl p-4 sm:p-6 border border-white/10 overflow-hidden min-h-[280px] flex flex-col justify-between">
          {/* Background Map Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Sequential Waypoint Nodes Display */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {legs.map((leg, idx) => {
              const isCurrent = activeLegIndex === idx;
              const isPassed = activeLegIndex > idx;

              return (
                <div
                  key={leg.id || idx}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 relative ${
                    isCurrent
                      ? 'bg-emerald-900/90 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.03]'
                      : isPassed
                      ? 'bg-emerald-950/40 border-emerald-600/40 opacity-80'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                        isCurrent
                          ? 'bg-emerald-400 text-slate-950 animate-bounce'
                          : isPassed
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">
                      {leg.estimatedArrival}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white line-clamp-1">
                    {leg.isDestination ? `🏢 ${leg.name}` : `🌾 ${leg.name}`}
                  </p>

                  <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                    {leg.crop ? `${leg.crop} (${leg.quantity})` : leg.location}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-300 font-mono font-semibold">
                      {leg.currentTemperatureC}
                    </span>
                    <span className="text-slate-400 font-medium">
                      +{leg.legDistanceKm} km
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Route Connection Pipeline Bar */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{isHindi ? 'कोल्ड-चेन सुरक्षा सक्रिय' : 'Cold-Chain Telemetry Active'}:</span>
              <strong className="text-white font-mono">2°C - 5°C Target</strong>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400">{isHindi ? 'लोड क्षमता' : 'Payload Capacity'}:</span>
              <div className="w-32 h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${summary.payloadUtilizationPercent || 60}%` }}
                />
              </div>
              <span className="font-bold text-white font-mono">
                {summary.payloadUtilizationPercent || 60}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leg-by-Leg Dispatch Itinerary Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              {t('dispatchTimelineHeading')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHindi ? 'प्रत्येक स्टॉप का समय, तापमान लॉग और ड्राइवर संपर्क' : 'Verified stop sequence, reefer temperature logs, and farmer contacts'}
            </p>
          </div>

          {/* Assigned Driver Badge */}
          {routeSolution?.driverInfo && (
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center">
                RS
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {routeSolution.driverInfo.name} ({routeSolution.driverInfo.vehicleNumber})
                </p>
                <p className="text-[11px] text-slate-500">
                  {routeSolution.driverInfo.mobile}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legs Table */}
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {legs.map((leg, idx) => (
            <div
              key={leg.id || idx}
              className={`py-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors rounded-xl ${
                activeLegIndex === idx && isSimulating ? 'bg-emerald-50/70 border border-emerald-200' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                    leg.isDestination
                      ? 'bg-slate-900 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {leg.isDestination ? '🏁' : idx + 1}
                </span>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {leg.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {leg.location}
                    {leg.crop && (
                      <span className="text-emerald-700 font-semibold"> • {leg.crop} ({leg.quantity})</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-slate-800 font-mono font-bold">{leg.estimatedArrival}</p>
                  <p className="text-[10px] text-slate-400 font-normal">
                    {idx === 0 ? 'Start' : `+${leg.legDistanceKm} km (${leg.legDurationMinutes}m)`}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-center min-w-[75px]">
                  <p className="text-[11px] font-bold text-emerald-800 font-mono">
                    {leg.currentTemperatureC}
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase font-semibold">
                    Optimal
                  </p>
                </div>

                {leg.farmerMobile && (
                  <a
                    href={`tel:${leg.farmerMobile.replace(/\s+/g, '')}`}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition-colors cursor-pointer border border-emerald-200"
                    title={`Call ${leg.farmerName}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
