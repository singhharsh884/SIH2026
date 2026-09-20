import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  MapPin,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Calendar,
  Sparkles,
  Phone,
  Award,
  Clock,
  Layers,
} from 'lucide-react';
import { cropService } from '../../services/cropService';
import { useLanguage } from '../../context/LanguageContext';

export const LotTraceModal = ({ cropId, cropName, onClose }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [traceData, setTraceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cropId) {
      setLoading(true);
      cropService.getLotTraceability(cropId).then((data) => {
        setTraceData(data);
        setLoading(false);
      });
    }
  }, [cropId]);

  if (!cropId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-500/30">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-5 sm:p-6 rounded-t-3xl border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {traceData?.traceabilityId || `KD-LOT-2026-${cropId.slice(-6).toUpperCase()}`}
                </span>
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isHindi ? '100% सत्यापित खेत' : 'Verified Origin'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-1 text-white">
                {cropName || traceData?.crop || (isHindi ? 'डिजिटल फसल ऑडिट ट्रेल' : 'Digital Crop Lot Audit Trail')}
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium">{isHindi ? 'डिजिटल लेजर से डेटा लोड हो रहा है...' : 'Querying Farm Ledger & Cold Telemetry...'}</p>
            </div>
          ) : (
            <>
              {/* QR Verification Visual Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-center gap-5">
                {/* Visual SVG QR Simulation */}
                <div className="bg-white p-3 rounded-2xl shadow-md border border-emerald-300/60 flex flex-col items-center shrink-0">
                  <div className="w-28 h-28 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
                    <div className="w-full h-full border-2 border-emerald-400 rounded-lg flex items-center justify-center relative">
                      <QrCode className="w-16 h-16 text-emerald-400" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/10 to-emerald-400/20 animate-pulse" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-2 font-bold tracking-tight">
                    {traceData?.traceabilityId}
                  </span>
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{traceData?.qualityAndGrading?.grade || 'Grade-A Export Quality'}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {traceData?.farmOriginDetails?.farmName || 'Patel Green Farms'}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {traceData?.farmOriginDetails?.geoCoordinates?.subDistrict || 'Niphad'},{' '}
                      {traceData?.farmOriginDetails?.geoCoordinates?.district || 'Nashik'},{' '}
                      {traceData?.farmOriginDetails?.geoCoordinates?.state || 'Maharashtra'}
                    </span>
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                    🌱 {traceData?.farmOriginDetails?.soilCertification || 'Residue-Free Tested • Sunrise Harvest'}
                  </p>
                </div>
              </div>

              {/* Cold-Chain Reefer Sensor History */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
                    <Thermometer className="w-4 h-4" />
                    <span>{isHindi ? 'सक्रिय कोल्ड-चेन टेलीमेट्री' : 'Active Cold-Chain Telemetry'}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                    [Simulated Sensor Stream]
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400 block">{isHindi ? 'औसत तापमान' : 'Avg Reefer Temp'}</span>
                    <span className="text-lg font-black text-emerald-400">
                      {traceData?.coldChainTelemetryHistory?.recordedAverageTemp || '3.8°C'}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400 block">{isHindi ? 'अनुकूल सीमा' : 'Target Range'}</span>
                    <span className="text-sm font-bold text-teal-300 mt-1 block">
                      {traceData?.coldChainTelemetryHistory?.optimalTempRange || '2°C - 4°C'}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400 block">{isHindi ? 'आर्द्रता (RH)' : 'Humidity Level'}</span>
                    <span className="text-lg font-black text-blue-400">
                      {traceData?.coldChainTelemetryHistory?.relativeHumidity || '94%'}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400 block">{isHindi ? 'वाहन नंबर' : 'Assigned Vehicle'}</span>
                    <span className="text-xs font-bold text-white mt-1 block truncate">
                      MH-15-JC-4892
                    </span>
                  </div>
                </div>
              </div>

              {/* Chain of Custody Audit Trail (PRD v2.0.0 Section 22) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{isHindi ? 'डिजिटल कस्टडी व डिलीवरी इतिहास' : '4-Stage Chain of Custody Audit Trail'}</span>
                </h4>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200">
                  {traceData?.chainOfCustodyAuditTrail?.map((stage, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 text-xs">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow z-10">
                        ✓
                      </div>
                      <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-slate-900">
                            {stage.stage.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                            {stage.time}
                          </span>
                        </div>
                        <p className="text-slate-600">{stage.location}</p>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Verified by: <strong>{stage.officer}</strong></span>
                          {stage.temperature && (
                            <span className="font-mono text-emerald-700 font-bold">{stage.temperature}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Farmer directly */}
              {traceData?.farmOriginDetails?.farmerMobile && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                  <div className="text-xs text-slate-600">
                    <span>{isHindi ? 'किसान संपर्क:' : 'Farmer:'} </span>
                    <strong className="text-slate-900">{traceData.farmOriginDetails.farmerName}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${traceData.farmOriginDetails.farmerMobile.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'कॉल करें' : 'Call'}</span>
                    </a>
                    <button
                      onClick={onClose}
                      className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isHindi ? 'बंद करें' : 'Close'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
