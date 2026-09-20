import React, { useState } from 'react';
import {
  X,
  Layers,
  CheckCircle2,
  Truck,
  Building2,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useLanguage } from '../../context/LanguageContext';

export const FpoAggregationModal = ({ isOpen, onClose, onConsignmentCreated }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const defaultLots = [
    { id: 'lot_farm_1', farmerName: 'Rameshwar Patel', farmName: 'Patel Green Farms', crop: 'Baby Spinach (पालक)', weightKg: 500, qualityGrade: 'Grade A', selected: true },
    { id: 'lot_farm_2', farmerName: 'Santosh Deshmukh', farmName: 'Krishi Vikas Organic', crop: 'Tender Okra / Bhindi (भिंडी)', weightKg: 400, qualityGrade: 'Grade A', selected: true },
    { id: 'lot_farm_3', farmerName: 'Balasaheb Shinde', farmName: 'Vikas Sahakari FPO', crop: 'Crisp Cucumbers (खीरा)', weightKg: 600, qualityGrade: 'Grade A', selected: true },
    { id: 'lot_farm_4', farmerName: 'Ramprasad Maurya', farmName: 'Awadh Krishi FPO (Malihabad)', crop: 'Malihabad Organic Greens', weightKg: 600, qualityGrade: 'Grade A', selected: false },
  ];

  const [availableLots, setAvailableLots] = useState(defaultLots);
  const [fpoName, setFpoName] = useState('Krishi Vikas Sahakari FPO (Nashik & Awadh Federation)');
  const [destinationHub, setDestinationHub] = useState('Navi Mumbai Central Cold Terminal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdConsignment, setCreatedConsignment] = useState(null);

  if (!isOpen) return null;

  const toggleLot = (id) => {
    setAvailableLots((prev) =>
      prev.map((lot) => (lot.id === id ? { ...lot, selected: !lot.selected } : lot))
    );
  };

  const selectedLots = availableLots.filter((l) => l.selected);
  const totalAggregatedKg = selectedLots.reduce((sum, l) => sum + l.weightKg, 0);
  const totalTons = (totalAggregatedKg / 1000).toFixed(2);

  const handleAggregate = async () => {
    if (selectedLots.length === 0) return;
    setIsProcessing(true);

    const payload = {
      fpoName,
      sourceFarmLots: selectedLots.map((l) => ({
        farmId: l.id,
        farmName: l.farmName,
        farmerName: l.farmerName,
        crop: l.crop,
        weightKg: l.weightKg,
        qualityGrade: l.qualityGrade,
      })),
      destinationHub,
    };

    const result = await orderService.aggregateFpoLots(payload);
    setIsProcessing(false);

    const consignmentData = result || {
      consignmentId: 'KD-FPO-AGGR-' + Math.floor(100000 + Math.random() * 900000),
      fpoName,
      totalWeightKg: totalAggregatedKg,
      totalWeightTons: Number(totalTons),
      status: 'CONSOLIDATED_AT_COLLECTION_CENTER',
      assignedColdHub: destinationHub,
      createdAt: new Date().toISOString(),
      sourceFarmLots: selectedLots,
    };

    setCreatedConsignment(consignmentData);
    if (onConsignmentCreated) {
      onConsignmentCreated(consignmentData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300">
              <Layers className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {isHindi ? 'FPO लॉट एकत्रीकरण कंसोल' : 'FPO Multi-Lot Aggregation Console'}
                <span className="text-xs bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-medium">
                  PRD Section 9
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80">
                {isHindi
                  ? 'छोटे किसानों के विखंडित लॉट्स को 1 बड़े थोक कन्साइनमेंट में ग्रुप करें'
                  : 'Group fragmented smallholder lots into 1 consolidated wholesale reefer shipment'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {createdConsignment ? (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-9 h-9 animate-bounce" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  {isHindi ? 'FPO कन्साइनमेंट सफलतापूर्वक बनाया गया!' : 'FPO Consignment Successfully Formed!'}
                </h4>
                <p className="text-xs text-emerald-700 font-mono mt-1 font-semibold">
                  Manifest ID: {createdConsignment.consignmentId}
                </p>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-xs py-1 border-b border-emerald-200/60">
                  <span className="text-gray-600">{isHindi ? 'कुल किसान लॉट्स:' : 'Aggregated Farm Lots:'}</span>
                  <strong className="text-gray-900">{createdConsignment.sourceFarmLots?.length || selectedLots.length} Farms</strong>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-emerald-200/60">
                  <span className="text-gray-600">{isHindi ? 'कुल वजन:' : 'Total Manifest Payload:'}</span>
                  <strong className="text-emerald-800 text-sm font-bold">
                    {createdConsignment.totalWeightKg || totalAggregatedKg} kg ({totalTons} Tons)
                  </strong>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-emerald-200/60">
                  <span className="text-gray-600">{isHindi ? 'गंतव्य कोल्ड हब:' : 'Destination Cold Hub:'}</span>
                  <strong className="text-gray-900">{createdConsignment.assignedColdHub}</strong>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-gray-600">{isHindi ? 'लॉजिस्टिक्स स्थिति:' : 'Status:'}</span>
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    READY_FOR_COLD_FLEET_PICKUP
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer"
              >
                {isHindi ? 'कंसोल बंद करें और डैशबोर्ड देखें' : 'Done • View Consignment in Dashboard'}
              </button>
            </div>
          ) : (
            /* Lot Selection State */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isHindi ? 'FPO / संग्रह केंद्र का नाम' : 'FPO Federation / Collection Center'}
                  </label>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800">
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      type="text"
                      value={fpoName}
                      onChange={(e) => setFpoName(e.target.value)}
                      className="bg-transparent w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isHindi ? 'गंतव्य कोल्ड हब' : 'Target Cold-Chain Terminal'}
                  </label>
                  <select
                    value={destinationHub}
                    onChange={(e) => setDestinationHub(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Navi Mumbai Central Cold Terminal">Navi Mumbai Central Cold Terminal (APMC Vashi)</option>
                    <option value="Lucknow KisanDirect Cold-Chain Terminal">Lucknow Cold Terminal (Transport Nagar)</option>
                    <option value="Pune Agri-Logistics Terminal">Pune Agri Terminal (Hadapsar)</option>
                    <option value="Thane Bhiwandi Fulfillment Depot">Thane Cold Depot (Bhiwandi)</option>
                  </select>
                </div>
              </div>

              {/* Farmer Lots Multi-Select Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    {isHindi ? 'एकत्रीकरण के लिए तैयार किसान लॉट्स चुनें:' : 'Select Verified Farm Lots for Consolidation:'}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {selectedLots.length} of {availableLots.length} Selected
                  </span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {availableLots.map((lot) => (
                    <div
                      key={lot.id}
                      onClick={() => toggleLot(lot.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        lot.selected
                          ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-400/50'
                          : 'bg-white border-gray-200 hover:border-gray-300 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={lot.selected}
                          onChange={() => {}}
                          className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">{lot.farmName}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded font-mono">
                              {lot.qualityGrade}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600">
                            {lot.farmerName} • <span className="text-emerald-700 font-medium">{lot.crop}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-900">{lot.weightKg} kg</span>
                        <span className="block text-[10px] text-gray-500">{(lot.weightKg / 1000).toFixed(2)} Tons</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aggregation Summary Banner */}
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-xl p-4 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                    {isHindi ? 'कुल एकीकृत शिपमेंट वजन' : 'Aggregated Consignment Payload'}
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline gap-2">
                    {totalAggregatedKg.toLocaleString('en-IN')} <span className="text-sm font-normal text-emerald-200">kg</span>
                    <span className="text-xs text-emerald-300 font-normal">({totalTons} Tons)</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 mt-0.5">
                    {totalTons <= 3.5 ? '✓ 1x Tata 407 Reefer (3.5T) capacity optimal' : '✓ 1x Eicher Pro (4.2T) capacity assigned'}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={selectedLots.length === 0 || isProcessing}
                  onClick={handleAggregate}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                    selectedLots.length === 0 || isProcessing
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 cursor-pointer scale-100 hover:scale-[1.02]'
                  }`}
                >
                  {isProcessing ? (
                    isHindi ? 'एकत्रीकरण हो रहा है...' : 'Consolidating...'
                  ) : (
                    <>
                      <span>{isHindi ? 'कन्साइनमेंट बनाएं' : 'Group Into Consignment'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
