import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Sparkles,
  Tractor,
  ShoppingCart,
  Layers,
  Truck,
  Thermometer,
  QrCode,
  CheckCheck,
  TrendingUp,
  MapPin,
  ArrowRight,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useLanguage } from '../../context/LanguageContext';

export const SihDemoWalkthroughModal = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeStep, setActiveStep] = useState(1);
  const [isRunningLucknow, setIsRunningLucknow] = useState(false);
  const [lucknowResult, setLucknowResult] = useState(null);

  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: isHindi ? 'स्टेप 1: किसान 1 (500 kg टमाटर)' : 'Step 1: Farmer 1 Creates Lot',
      subtitle: 'Patel Green Farms publishes 500 kg Hybrid Tomatoes ready at 06:00 AM',
      icon: Tractor,
      tag: 'Demand-Side Supply Digitization',
    },
    {
      step: 2,
      title: isHindi ? 'स्टेप 2: दूसरा किसान (400 kg टमाटर)' : 'Step 2: Farmer 2 Publishes Lot',
      subtitle: 'Krishi Vikas Organic FPO adds 400 kg lot with farmgate GPS',
      icon: Tractor,
      tag: 'Cluster Geo-Tagging',
    },
    {
      step: 3,
      title: isHindi ? 'स्टेप 3: तीसरा किसान (600 kg टमाटर)' : 'Step 3: Farmer 3 Publishes Lot',
      subtitle: 'Vikas Sahakari adds 600 kg. Total available in cluster = 1,500 kg',
      icon: Tractor,
      tag: 'Smallholder Aggregation Pool',
    },
    {
      step: 4,
      title: isHindi ? 'स्टेप 4: बायर की मांग (1,500 kg)' : 'Step 4: Buyer Creates 1,500 kg RFQ',
      subtitle: 'Institutional Buyer (TastyGreens / Awadh Fresh) places requirement for 1.5T',
      icon: ShoppingCart,
      tag: 'Contract Escrow Lock',
    },
    {
      step: 5,
      title: isHindi ? 'स्टेप 5: मैचिंग इंजन' : 'Step 5: Demand-to-Supply Auto Match',
      subtitle: '500 kg + 400 kg + 600 kg = 1,500 kg exact match (98.4% Match Score)',
      icon: Sparkles,
      tag: 'Multi-Lot Matching Engine',
    },
    {
      step: 6,
      title: isHindi ? 'स्टेप 6: FPO एकत्रीकरण' : 'Step 6: FPO Consignment Formation',
      subtitle: '3 fragmented farm stops consolidated into 1 unified cold manifest',
      icon: Layers,
      tag: 'FPO Aggregation Console',
    },
    {
      step: 7,
      title: isHindi ? 'स्टेप 7: OSRM रूट ऑप्टिमाइज़र' : 'Step 7: Multi-Stop OSRM Routing',
      subtitle: 'Hub ➔ Farm A ➔ Farm B ➔ Farm C ➔ Destination Hub (28 km saved, 1.28x curvature)',
      icon: Truck,
      tag: 'OSRM Real Road Network',
    },
    {
      step: 8,
      title: isHindi ? 'स्टेप 8: हार्ड कैपेसिटी फीजिबिलिटी' : 'Step 8: Hard Constraints Feasibility',
      subtitle: 'Capacity ✓ (1.5T in 4.2T Reefer), Time Window ✓, Chilling Regime ✓',
      icon: CheckCheck,
      tag: 'Zero Overload Guarantee',
    },
    {
      step: 9,
      title: isHindi ? 'स्टेप 9: IoT रीफर टेलीमेट्री' : 'Step 9: Reefer IoT Telemetry',
      subtitle: 'Live 3.6°C Chilled Status. Active compressor + breach mitigation alert',
      icon: Thermometer,
      tag: 'Cold-Chain Integrity',
    },
    {
      step: 10,
      title: isHindi ? 'स्टेप 10: 4-स्टेज वजन मिलान' : 'Step 10: 4-Stage Weighing Reconciliation',
      subtitle: 'Declared 1,000kg ➔ Farmgate 996kg ➔ Hub 990kg ➔ Buyer 988kg (1.2% Moisture)',
      icon: CheckCircle2,
      tag: 'Dispute-Free Weight Audit',
    },
    {
      step: 11,
      title: isHindi ? 'स्टेप 11: QR ट्रेसिबिलिटी' : 'Step 11: Lot QR Traceability',
      subtitle: 'Scan QR -> Farm GPS coordinates, harvest time, cold-chain history & audit trail',
      icon: QrCode,
      tag: 'Farm-to-Fork Audit Trail',
    },
    {
      step: 12,
      title: isHindi ? 'स्टेप 12: पारदर्शी पेआउट व प्रभाव' : 'Step 12: Transparent Farmer Payout & Impact',
      subtitle: 'Gross ₹ - 8.5% Logistics - 1.5% Platform = 90% Net Farmer Realization settled via UPI!',
      icon: TrendingUp,
      tag: 'Measured vs Modelled Impact',
    },
  ];

  const handleRunLucknowLive = async () => {
    setIsRunningLucknow(true);
    const res = await orderService.runLucknowSimulation({
      buyerBusinessName: 'Awadh Fresh Hypermarket & Cloud Kitchen',
      deliveryAddress: 'Shop #14, Rohtas Presidential Arcade, Vibhuti Khand, Gomti Nagar, Lucknow, UP',
      volumeKg: 1500,
    });
    setIsRunningLucknow(false);
    setLucknowResult(res);
    setActiveStep(12);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300">
              <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {isHindi ? 'SIH 2026 12-स्टेप लाइव डेमो वॉकथ्रू' : 'SIH 2026 Official 12-Step Pitch Walkthrough'}
                <span className="text-xs bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-medium">
                  PRD Section 47
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">
                {isHindi
                  ? 'जजों के सामने 5 मिनट में पूरा फार्म-टू-फोर्क आर्किटेक्चर प्रदर्शित करें'
                  : 'Demonstrate the exact 5-7 minute winning pitch flow specified in the PRD'}
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Fast Simulation Action */}
        <div className="bg-emerald-900/10 border-b border-emerald-100 px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-emerald-950 font-semibold">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>{isHindi ? '1-क्लिक लाइव लखनऊ सिमुलेशन (गोमती नगर व मलिहाबाद कॉरिडोर):' : '1-Click End-to-End Live Simulation (Lucknow Corridor):'}</span>
          </div>

          <button
            type="button"
            disabled={isRunningLucknow}
            onClick={handleRunLucknowLive}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isRunningLucknow
                ? 'bg-gray-400 text-white cursor-wait'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
            }`}
          >
            {isRunningLucknow ? (
              <span>Simulating...</span>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Live Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {lucknowResult ? (
            /* Live Simulation Result Display */
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                    Live Simulation Executed Successfully
                  </span>
                  <h4 className="text-base font-bold text-emerald-950">
                    {lucknowResult.stage1_orderAndDemand?.buyerName}
                  </h4>
                  <p className="text-xs text-emerald-700 font-medium">
                    📍 {lucknowResult.stage1_orderAndDemand?.deliveryAddress}
                  </p>
                </div>
                <span className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-full font-bold">
                  {lucknowResult.simulationId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <span className="text-gray-500 block mb-0.5">Matched Farms</span>
                  <strong className="text-gray-900 text-sm">{lucknowResult.stage2_farmSupplyMatching?.totalLotsMatched} Clusters</strong>
                  <span className="block text-[11px] text-emerald-700 font-semibold mt-1">98.4% Match Score</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <span className="text-gray-500 block mb-0.5">Vehicle Assigned</span>
                  <strong className="text-gray-900 text-sm">UP-32-LN-5026</strong>
                  <span className="block text-[11px] text-emerald-700 font-semibold mt-1">100% Feasible (No Overload)</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <span className="text-gray-500 block mb-0.5">Net Farmer Payout</span>
                  <strong className="text-emerald-800 text-sm font-bold">
                    {lucknowResult.stage7_farmerPayoutSettlement?.netFarmerRealization}
                  </strong>
                  <span className="block text-[11px] text-emerald-700 font-semibold mt-1">90% Direct UPI Realization</span>
                </div>
              </div>

              <div className="bg-gray-900 text-white rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-semibold">📡 Live Reefer GPS (Shaheed Path, Lucknow):</span>
                  <span className="text-emerald-300 font-mono">Temp: 3.6°C (COMPLIANT)</span>
                </div>
                <p className="text-xs text-gray-300">
                  {lucknowResult.stage5_liveIotTelemetry?.currentLocation?.landmark}
                </p>
                <div className="flex justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800">
                  <span>Transit Shrinkage: {lucknowResult.stage6_weighingReconciliation?.shrinkagePercent} (Within Tolerance)</span>
                  <span className="text-emerald-400">Status: DELIVERED & PAID</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLucknowResult(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Back to 12-Step Step-by-Step Flow
              </button>
            </div>
          ) : (
            /* Interactive 12-Step Flow */
            <>
              {/* Step Progress Bar */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 border-b border-gray-100">
                {demoSteps.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveStep(s.step)}
                    className={`flex flex-col items-center min-w-[50px] p-1.5 rounded-lg transition-all cursor-pointer ${
                      activeStep === s.step
                        ? 'bg-emerald-100 text-emerald-900 font-bold'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="text-xs font-bold">#{s.step}</span>
                    <span className="text-[9px] truncate max-w-[45px]">
                      {s.step <= 3 ? 'Farm' : s.step === 4 ? 'Buyer' : s.step === 5 ? 'Match' : s.step === 7 ? 'Route' : s.step === 9 ? 'Temp' : s.step === 12 ? 'Pay' : 'Step'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Step Card */}
              {(() => {
                const stepObj = demoSteps.find((s) => s.step === activeStep) || demoSteps[0];
                const IconComponent = stepObj.icon;

                return (
                  <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border-2 border-emerald-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="p-3 bg-emerald-600 text-white rounded-xl shadow-md">
                          <IconComponent className="w-6 h-6" />
                        </span>
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {stepObj.tag}
                          </span>
                          <h4 className="text-lg font-black text-gray-900 mt-1">
                            {stepObj.title}
                          </h4>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-emerald-300">
                        {String(stepObj.step).padStart(2, '0')}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 bg-white/80 p-3.5 rounded-xl border border-emerald-100 leading-relaxed font-medium">
                      {stepObj.subtitle}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        disabled={activeStep <= 1}
                        onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                      >
                        Previous Step
                      </button>

                      <button
                        onClick={() => {
                          if (activeStep < 12) {
                            setActiveStep((p) => p + 1);
                          } else {
                            handleRunLucknowLive();
                          }
                        }}
                        className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                      >
                        <span>{activeStep === 12 ? 'Execute Lucknow Live Simulation' : 'Next Step'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
