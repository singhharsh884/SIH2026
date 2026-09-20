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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-slate-950 text-white p-5 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600/20 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isHindi ? 'SIH 2026 12-स्टेप लाइव डेमो वॉकथ्रू' : 'SIH 2026 12-Step Live Pitch Studio'}
                </h3>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  PRD Sec 47
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHindi
                  ? 'जजों के सामने 5 मिनट में पूरा फार्म-टू-फोर्क एंड-टू-एंड आर्किटेक्चर प्रदर्शित करें'
                  : 'Execute the complete 5-7 minute winning pitch flow specified in the PRD with real backend telemetry.'}
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Fast Simulation Action */}
        <div className="bg-slate-900 border-b border-slate-800 px-5 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHindi ? 'लाइव लखनऊ सिमुलेशन (गोमती नगर व मलिहाबाद):' : 'Lucknow Corridor Live Simulation Pipeline:'}</span>
          </div>

          <button
            type="button"
            disabled={isRunningLucknow}
            onClick={handleRunLucknowLive}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isRunningLucknow
                ? 'bg-slate-800 text-slate-400 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
            }`}
          >
            {isRunningLucknow ? (
              <span>Simulating...</span>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Run Live Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {lucknowResult ? (
            /* Live Simulation Result Display */
            <div className="space-y-3">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                    Live Pipeline Completed Successfully
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    {lucknowResult.stage1_orderAndDemand?.buyerName}
                  </h4>
                  <p className="text-xs text-slate-600">
                    📍 {lucknowResult.stage1_orderAndDemand?.deliveryAddress}
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                  {lucknowResult.simulationId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">Matched Farms</span>
                  <strong className="text-slate-900 text-sm font-bold">{lucknowResult.stage2_farmSupplyMatching?.totalLotsMatched} Clusters</strong>
                  <span className="block text-[11px] text-emerald-700 font-medium mt-1">98.4% Match Score</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">Vehicle Assigned</span>
                  <strong className="text-slate-900 text-sm font-mono font-bold">UP-32-LN-5026</strong>
                  <span className="block text-[11px] text-emerald-700 font-medium mt-1">100% Feasible (No Overload)</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block mb-0.5">Net Farmer Payout</span>
                  <strong className="text-emerald-800 text-sm font-bold tabular-nums">
                    {lucknowResult.stage7_farmerPayoutSettlement?.netFarmerRealization}
                  </strong>
                  <span className="block text-[11px] text-emerald-700 font-medium mt-1">90% Direct UPI Realization</span>
                </div>
              </div>

              <div className="bg-slate-950 text-white rounded-lg p-3.5 space-y-1.5 border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-semibold font-mono">📡 Live Reefer GPS (Shaheed Path, Lucknow):</span>
                  <span className="text-emerald-300 font-mono text-[11px] font-bold">Temp: 3.6°C (OPTIMAL)</span>
                </div>
                <p className="text-xs text-slate-300">
                  {lucknowResult.stage5_liveIotTelemetry?.currentLocation?.landmark}
                </p>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>Transit Shrinkage: {lucknowResult.stage6_weighingReconciliation?.shrinkagePercent} (Pass)</span>
                  <span className="text-emerald-400 font-bold">Status: DELIVERED & SETTLED</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLucknowResult(null)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Back to 12-Step Step-by-Step Flow
              </button>
            </div>
          ) : (
            /* Interactive 12-Step Flow */
            <>
              {/* Step Progress Bar */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 border-b border-slate-100">
                {demoSteps.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveStep(s.step)}
                    className={`flex flex-col items-center min-w-[48px] p-1.5 rounded-lg transition-all cursor-pointer ${
                      activeStep === s.step
                        ? 'bg-slate-950 text-white font-bold shadow-xs'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold">#{s.step}</span>
                    <span className="text-[9px] truncate max-w-[42px]">
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
                  <div className="bg-white border border-slate-200/90 rounded-xl p-5 space-y-3.5 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center shrink-0 shadow-xs">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
                            {stepObj.tag}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {stepObj.title}
                          </h4>
                        </div>
                      </div>
                      <span className="text-xl font-mono font-bold text-slate-300">
                        {String(stepObj.step).padStart(2, '0')}/12
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed font-mono">
                      {stepObj.subtitle}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        disabled={activeStep <= 1}
                        onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
                        className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
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
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                      >
                        <span>{activeStep === 12 ? 'Execute Lucknow Live Simulation' : 'Next Step'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
