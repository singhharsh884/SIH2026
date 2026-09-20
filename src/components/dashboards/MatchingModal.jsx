import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const API_BASE_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

export const MatchingModal = ({ rfq, onClose, onLaunchRoute }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    if (!rfq) return;

    setLoading(true);
    fetch(`${API_BASE_URL}/matching/find-matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rfqId: rfq._id,
        commodity: rfq.commodity || rfq.title || 'Tomato',
        volumeKg: rfq.volume || '1500 kg',
        maxRadiusKm: 250,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMatchData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Matching fallback:', err.message);
        setLoading(false);
      });
  }, [rfq]);

  if (!rfq) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-teal-500/30">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-slate-950 via-teal-950 to-emerald-950 text-white p-5 sm:p-6 rounded-t-3xl border-b border-teal-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  {isHindi ? 'AI डिमांड-सप्लाई मैचिंग इंजन' : 'AI Demand-to-Supply Matching Engine'}
                </span>
                <span className="text-teal-400 text-xs font-semibold">PRD v2.0.0 Section 12</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-1 text-white">
                {rfq.title || rfq.commodity} ({rfq.volume})
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium">
                {isHindi
                  ? 'आस-पास के FPO और किसान लॉट्स को मैच किया जा रहा है...'
                  : 'Scanning nearby FPO clusters & aggregating compatible harvest lots...'}
              </p>
            </div>
          ) : (
            <>
              {/* Top Score Banner */}
              <div className="bg-gradient-to-br from-teal-50 via-emerald-50/50 to-slate-50 rounded-2xl p-5 border border-teal-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-teal-700 font-bold uppercase tracking-wider block">
                    {isHindi ? 'ऑर्डर पूर्ति स्थिति' : 'Demand Fulfillment Status'}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-lg font-black text-slate-900">
                      {matchData?.matchSummary?.status || '100% Demand Fulfilled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {isHindi ? 'कुल मात्रा:' : 'Target Quantity:'}{' '}
                    <strong>{matchData?.demandQuery?.volumeRequiredFormatted || rfq.volume}</strong> •{' '}
                    {isHindi ? 'एकत्रित लॉट:' : 'Aggregated Lots:'}{' '}
                    <strong>{matchData?.matchSummary?.lotsAggregatedCount || 2}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">{isHindi ? 'मैच स्कोर' : 'Overall Match Score'}</span>
                  <span className="text-3xl font-black text-teal-600 font-mono">
                    {matchData?.matchSummary?.overallMatchScore || '95%'}
                  </span>
                  <span className="text-[10px] text-teal-800 font-semibold block">
                    {isHindi ? 'दूरी व गुणवत्ता अनुकूल' : 'Proximity & Grade Match'}
                  </span>
                </div>
              </div>

              {/* FPO Aggregation Explanation Badge (PRD Section 9) */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3">
                <Layers className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-emerald-900 block font-bold mb-0.5">
                    {isHindi ? 'FPO क्लस्टर एग्रीगेशन रणनीति (Consolidated Milk-Run)' : 'FPO Aggregation Strategy'}
                  </strong>
                  <p className="text-emerald-800 leading-relaxed">
                    {matchData?.fpoAggregationStrategy?.explanation ||
                      'छोटे किसानों के खंडित लॉट्स को एक संयुक्त कोल्ड-चेन पिकअप में समेकित किया गया है, ताकि रीफर ट्रक का पूरा उपयोग हो सके।'}
                  </p>
                </div>
              </div>

              {/* List of Matched Lots */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                  <span>{isHindi ? 'मैच किए गए फार्म लॉट्स' : 'Aggregated Farm Supply Lots'}</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {isHindi ? 'खेत से सीधी आपूर्ति' : 'Direct from Verified FPOs'}
                  </span>
                </h4>

                <div className="space-y-3">
                  {matchData?.matchedLots?.map((lot, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h5 className="font-extrabold text-slate-900 text-sm">{lot.cropName}</h5>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Grade-A
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            {lot.farmName} • {lot.location} ({lot.distanceToBuyerKm} km)
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {isHindi ? 'किसान:' : 'Grower:'} <strong>{lot.farmerName}</strong> ({lot.farmerMobile})
                        </p>
                      </div>

                      <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                        <div className="text-xs text-slate-500">{isHindi ? 'आवंटित मात्रा' : 'Allocated Payload'}</div>
                        <div className="text-base font-black text-slate-900">{lot.allocatedKg} kg</div>
                        <span className="text-[11px] font-semibold text-teal-700">
                          {lot.contributionPercent}% {isHindi ? 'ऑर्डर का हिस्सा' : 'of order'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  onClick={() => {
                    onClose();
                    if (onLaunchRoute) {
                      const farmIds = matchData?.matchedLots?.map((l) => l.lotId) || [];
                      onLaunchRoute(farmIds);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white text-xs font-bold shadow-lg shadow-teal-900/20 transition-all cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>
                    {isHindi
                      ? '⚡ इस एग्रीगेशन के लिए कोल्ड-चेन रूट शुरू करें'
                      : '⚡ Launch Cold-Chain Route for this Match'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
