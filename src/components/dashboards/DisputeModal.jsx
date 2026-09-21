import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Camera,
  FileText,
  DollarSign,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useLanguage } from '../../context/LanguageContext';

export const DisputeModal = ({ isOpen, onClose, order, onDisputeCreated }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [disputeType, setDisputeType] = useState('GRADE_MISMATCH');
  const [claimAmount, setClaimAmount] = useState(3500);
  const [description, setDescription] = useState(
    'Received Grade-B produce with visible bruising and undersized tomatoes instead of contracted Grade-A.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedDispute, setSubmittedDispute] = useState(null);
  const [resolvedStatus, setResolvedStatus] = useState(null);

  if (!isOpen) return null;

  const targetOrderId = order?.orderId || order?._id || 'KD-2026-7841';
  const totalAmount = order?.totalAmount || 14000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const disputePayload = {
      orderId: targetOrderId,
      raisedBy: 'TastyGreens Institutional Buyer',
      disputeType,
      claimAmount: Number(claimAmount) || 3500,
      description,
      evidencePhotos: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'],
    };

    const created = await orderService.raiseDispute(disputePayload);
    setIsSubmitting(false);

    const activeDispute = created || {
      _id: 'disp_' + Date.now(),
      disputeId: 'DISP-' + Math.floor(1000 + Math.random() * 9000),
      ...disputePayload,
      status: 'OPEN_UNDER_REVIEW',
      createdAt: new Date().toISOString(),
    };

    setSubmittedDispute(activeDispute);
    if (onDisputeCreated) {
      onDisputeCreated(activeDispute);
    }
  };

  const handleSimulateResolution = async () => {
    if (!submittedDispute) return;
    setIsSubmitting(true);

    const resolutionPayload = {
      resolution: 'PARTIAL_REFUND_APPROVED',
      refundAmount: Number(claimAmount) || 3500,
      adminNotes: 'Evidence verified via cold-chain timestamp audit. Grade variance compensated from escrow.',
    };

    await orderService.resolveDispute(submittedDispute._id || submittedDispute.disputeId, resolutionPayload);
    setIsSubmitting(false);
    setResolvedStatus(resolutionPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-rose-900 to-amber-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {isHindi ? 'गुणवत्ता विवाद एवं दावा समाधान' : 'Quality Dispute & Escrow Claim'}
                <span className="text-xs bg-red-400/20 text-red-300 border border-red-400/40 px-2 py-0.5 rounded-full font-medium">
                  PRD Section 27
                </span>
              </h3>
              <p className="text-xs text-red-200/80">
                {isHindi
                  ? 'पारदर्शी मध्यस्थता: गुणवत्ता असंगति या वजन कमी पर एस्क्रो से दावा'
                  : 'Automated arbitration for grade variance, moisture damage, or quantity loss'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {resolvedStatus ? (
            /* Resolved State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-9 h-9 animate-bounce" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  {isHindi ? 'विवाद समाधान: रिफंड स्वीकृत!' : 'Dispute Resolved: Escrow Refund Approved!'}
                </h4>
                <p className="text-xs text-emerald-700 font-mono mt-1 font-semibold">
                  Resolution Status: {resolvedStatus.resolution}
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-emerald-200/60">
                  <span className="text-gray-600">Order ID:</span>
                  <strong className="text-gray-900">{targetOrderId}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200/60">
                  <span className="text-gray-600">Original Gross Amount:</span>
                  <strong className="text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200/60">
                  <span className="text-gray-600">Claim Refund to Buyer:</span>
                  <strong className="text-emerald-800 font-bold">₹{resolvedStatus.refundAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Net Adjusted Farmer Payout:</span>
                  <strong className="text-emerald-900 font-bold">
                    ₹{(totalAmount - resolvedStatus.refundAmount).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 italic">
                "{resolvedStatus.adminNotes}"
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer"
              >
                {isHindi ? 'समाप्त • ऑर्डर डैशबोर्ड पर लौटें' : 'Close • Return to Orders'}
              </button>
            </div>
          ) : submittedDispute ? (
            /* Open Dispute Awaiting Action */
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {isHindi ? 'विवाद सफलतापूर्वक दर्ज हुआ (Under Review)' : 'Dispute Ticket Logged (Escrow Hold Active)'}
                  </h4>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Ticket #{submittedDispute.disputeId || submittedDispute._id} is linked with cold-chain telemetry logs. Farmer payout ₹{claimAmount} is temporarily frozen in escrow.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">{isHindi ? 'विवाद प्रकार:' : 'Dispute Category:'}</span>
                  <strong className="text-gray-900">{submittedDispute.disputeType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isHindi ? 'दावा राशि:' : 'Claimed Refund:'}</span>
                  <strong className="text-red-600 font-bold">₹{submittedDispute.claimAmount}</strong>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-gray-500 block mb-1">{isHindi ? 'दर्ज विवरण:' : 'Description:'}</span>
                  <p className="text-gray-800 bg-gray-50 p-2 rounded-lg font-mono text-[11px]">
                    {submittedDispute.description}
                  </p>
                </div>
              </div>

              {/* Instant Resolution Button for SIH Demo */}
              <button
                onClick={handleSimulateResolution}
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                {isSubmitting ? (
                  isHindi ? 'निर्णय हो रहा है...' : 'Arbitrating...'
                ) : (
                  <>
                    <span>{isHindi ? '⚡ जजों के लिए: तत्काल दावा स्वीकृत करें' : '⚡ Demo Action: Verify Evidence & Approve Refund'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Filing Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block">{isHindi ? 'संबंधित ऑर्डर ID:' : 'Target Order ID:'}</span>
                  <strong className="text-gray-900">{targetOrderId}</strong>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">{isHindi ? 'कुल ऑर्डर मूल्य:' : 'Order Total:'}</span>
                  <strong className="text-emerald-700 font-bold">₹{totalAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isHindi ? 'विवाद का प्रकार (PRD Section 23/27)' : 'Dispute Reason / Quality Defect'}
                </label>
                <select
                  value={disputeType}
                  onChange={(e) => setDisputeType(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:ring-2 focus:ring-red-500"
                >
                  <option value="GRADE_MISMATCH">Grade Mismatch (e.g. Grade B delivered vs Grade A contracted)</option>
                  <option value="EXCESS_SHRINKAGE">Excess Moisture Shrinkage (&gt; 2.5% Tolerance Breached)</option>
                  <option value="THERMAL_DECAY">Cold-Chain Thermal Abuse / Wilting Damage</option>
                  <option value="FOREIGN_MATTER">Packaging or Dirt / Sorting Defect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isHindi ? 'दावा की गई रिफंड राशि (₹)' : 'Claimed Refund Amount (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    max={totalAmount}
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-red-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  Max refundable from Escrow: ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isHindi ? 'विवरण व कारण' : 'Defect Observations'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Photo Evidence Simulation */}
              <div className="p-3 bg-red-50/50 border border-dashed border-red-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-red-800">
                  <Camera className="w-4 h-4 text-red-600" />
                  <span className="font-semibold">Inspection Evidence Attached (1 Photo)</span>
                </div>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono font-bold">
                  geo_lot_sample.jpg (GPS Verified)
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                {isSubmitting ? (
                  isHindi ? 'दावा दर्ज हो रहा है...' : 'Logging Dispute...'
                ) : (
                  <>
                    <span>{isHindi ? 'विवाद दर्ज करें और एस्क्रो होल्ड लगाएं' : 'Submit Dispute & Lock Escrow'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
