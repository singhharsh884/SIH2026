import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  Heart,
  CheckCircle,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { AgriSproutIcon } from '../common/AgriPattern';
import { useLanguage } from '../../context/LanguageContext';

export const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOrderPlaced,
  userDeliveryAddress = 'Indiranagar, Bengaluru - 560038',
  userName = 'Ananya Sharma',
}) => {
  const { t } = useLanguage();
  const [deliveryAddress, setDeliveryAddress] = useState(userDeliveryAddress);
  const [deliverySlot, setDeliverySlot] = useState('Tomorrow Morning: 6 AM - 9 AM Direct Farm Harvest');
  const [paymentMethod, setPaymentMethod] = useState('UPI / KisanPay Direct');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isOpen) return null;

  const totals = orderService.getCartTotals();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsPlacing(true);
    try {
      const orderPayload = {
        customerName: userName,
        deliveryAddress,
        deliverySlot,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.id.toString(),
          name: item.name,
          farm: item.farm,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
        })),
        totalAmount: totals.total,
        orderType: 'consumer',
      };

      const placedOrder = await orderService.placeOrder(orderPayload);
      setIsPlacing(false);
      onOrderPlaced(placedOrder);
    } catch (err) {
      setIsPlacing(false);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">{t('cartDrawerTitle')}</h2>
                <p className="text-xs text-slate-500">
                  {totals.count} {t('cartItemsDirect')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{t('cartEmptyHeading')}</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {t('cartEmptyText')}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer hover:bg-emerald-700"
                >
                  {t('exploreMarketBtn')}
                </button>
              </div>
            ) : (
              <>
                {/* 100% Direct Farmer Payout Banner */}
                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 flex items-start gap-2.5">
                  <Heart className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    <strong>{t('zeroMiddlemenBadge')}:</strong> {t('zeroMiddlemenNotice')} (₹{totals.directFarmerShare})
                  </p>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3.5 flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-emerald-700 font-medium truncate">
                          {item.farm}
                        </p>
                        <p className="text-xs font-black text-slate-800 mt-0.5">
                          ₹{item.price}{' '}
                          <span className="text-[10px] font-normal text-slate-400">
                            / {item.unit}
                          </span>
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center shadow-xs hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center shadow-xs hover:bg-slate-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Delivery Address & Time Slot */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      {t('deliveryLocationLabel')}
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder={t('deliveryAddressPlaceholder') || 'Enter flat / house no., street & pincode'}
                      className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      {t('deliverySlotLabel')}
                    </label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                    >
                      <option value="Tomorrow Morning: 6 AM - 9 AM Direct Farm Harvest">
                        {t('slotMorning')}
                      </option>
                      <option value="Tomorrow Evening: 4 PM - 7 PM Fresh Dispatch">
                        {t('slotEvening')}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      {t('paymentModeHeading')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI / KisanPay Direct')}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          paymentMethod === 'UPI / KisanPay Direct'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {t('instantUpiBtn')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Cash on Farm Delivery')}
                        className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          paymentMethod === 'Cash on Farm Delivery'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {t('codBtn')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex justify-between text-slate-600">
                    <span>{t('produceSubtotalLabel')}</span>
                    <span className="font-semibold text-slate-900">₹{totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>{t('middlemenSavedLabel')}</span>
                    <span>₹0 ({t('savedLabel')} ₹{totals.middlemanSavings})</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t('coldDeliveryLabel')}</span>
                    <span>
                      {totals.deliveryFee === 0 ? (
                        <strong className="text-emerald-700">{t('freeText')}</strong>
                      ) : (
                        `₹${totals.deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                    <span>{t('totalPayoutLabel')}</span>
                    <span className="text-emerald-700">₹{totals.total}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/70">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isPlacing}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-extrabold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isPlacing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>{t('confirmingOrderState')}</span>
                  </span>
                ) : (
                  <>
                    <span>{t('placeOrderCTA')} (₹{totals.total})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
