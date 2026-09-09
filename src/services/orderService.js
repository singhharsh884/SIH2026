/**
 * KisanDirect Orders & Cart Service
 * Supports Consumer Shopping Cart and Bulk Buyer RFQ Procurement
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
const CART_KEY = 'kisandirect_cart';
const ORDERS_KEY = 'kisandirect_orders';
const RFQ_KEY = 'kisandirect_rfqs';

const DEFAULT_RFQS = [
  {
    _id: 'rfq_1',
    title: 'Red Onions (Nashik Medium)',
    commodity: 'Red Onions',
    volume: '10 Tons / week',
    targetRate: '₹26/kg',
    supplierFPO: 'Krishi Vikas FPO',
    deliveryHub: 'Navi Mumbai Central Hub',
    status: 'Contract Active',
    coldChainRequired: false,
  },
  {
    _id: 'rfq_2',
    title: 'Fresh English Cucumbers',
    commodity: 'English Cucumbers',
    volume: '2.5 Tons / week',
    targetRate: '₹19/kg',
    supplierFPO: 'Sahyadri Agri Clusters',
    deliveryHub: 'Pune Logistics Depot',
    status: 'In Transit',
    coldChainRequired: true,
  },
  {
    _id: 'rfq_3',
    title: 'Organic Certified Wheat Flours',
    commodity: 'Wheat Flours',
    volume: '5 Tons / month',
    targetRate: '₹41/kg',
    supplierFPO: 'Malwa Organic Producers',
    deliveryHub: 'Bhiwandi Warehouse',
    status: 'Contract Signed',
    coldChainRequired: false,
  },
];

export const orderService = {
  // ================= CART OPERATIONS =================
  getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    return items;
  },

  addToCart(product) {
    const current = this.getCart();
    // Parse price numeric from string like "₹35" or 35
    const numericPrice = typeof product.price === 'number'
      ? product.price
      : parseFloat(product.price.toString().replace(/[^\d.]/g, '')) || 0;

    const existingIndex = current.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      current[existingIndex].quantity += 1;
    } else {
      current.push({
        id: product.id,
        name: product.name,
        farm: product.farm || 'Direct Farm Partner',
        price: numericPrice,
        unit: product.unit || 'pack',
        image: product.image,
        quantity: 1,
      });
    }

    return this.saveCart(current);
  },

  updateQuantity(productId, delta) {
    const current = this.getCart();
    const item = current.find((i) => i.id === productId);

    if (!item) return current;

    item.quantity += delta;

    if (item.quantity <= 0) {
      return this.removeFromCart(productId);
    }

    return this.saveCart(current);
  },

  removeFromCart(productId) {
    const current = this.getCart().filter((i) => i.id !== productId);
    return this.saveCart(current);
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
    return [];
  },

  getCartTotals() {
    const cart = this.getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 200 || subtotal === 0 ? 0 : 30;
    const directFarmerShare = subtotal; // 100% direct
    const middlemanSavings = Math.round(subtotal * 0.35); // Consumer saves 35% vs supermarket MRP
    const total = subtotal + deliveryFee;

    return {
      count,
      subtotal,
      deliveryFee,
      directFarmerShare,
      middlemanSavings,
      total,
    };
  },

  // ================= ORDER PLACEMENT =================
  async placeOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const json = await res.json();
        this.clearCart();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend orders API unreachable, using client store:', err.message);
    }

    // Client fallback
    const newOrder = {
      _id: 'ord_local_' + Date.now(),
      orderId: 'KD-' + Math.floor(100000 + Math.random() * 900000),
      ...orderData,
      status: 'Harvesting at Farm',
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...existing]));
    this.clearCart();
    return newOrder;
  },

  // ================= BULK BUYER RFQ OPERATIONS =================
  async getRFQs() {
    try {
      const res = await fetch(`${API_BASE_URL}/rfq`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          localStorage.setItem(RFQ_KEY, JSON.stringify(json.data));
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend RFQ API unreachable, using local cache:', err.message);
    }

    const cached = localStorage.getItem(RFQ_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    localStorage.setItem(RFQ_KEY, JSON.stringify(DEFAULT_RFQS));
    return DEFAULT_RFQS;
  },

  async createRFQ(rfqData) {
    try {
      const res = await fetch(`${API_BASE_URL}/rfq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rfqData),
      });

      if (res.ok) {
        const json = await res.json();
        const current = await this.getRFQs();
        const updated = [json.data, ...current.filter((r) => r._id !== json.data._id)];
        localStorage.setItem(RFQ_KEY, JSON.stringify(updated));
        return json.data;
      }
    } catch (err) {
      console.warn('Using client-side RFQ creation fallback:', err.message);
    }

    const newRFQ = {
      _id: 'rfq_local_' + Date.now(),
      ...rfqData,
      targetRate: rfqData.targetRate.includes('₹') ? rfqData.targetRate : `₹${rfqData.targetRate}/kg`,
      supplierFPO: 'Matched via AI Fleet',
      status: 'Contract Active',
      createdAt: new Date().toISOString(),
    };

    const current = await this.getRFQs();
    const updated = [newRFQ, ...current];
    localStorage.setItem(RFQ_KEY, JSON.stringify(updated));
    return newRFQ;
  },

  async deleteRFQ(id) {
    try {
      await fetch(`${API_BASE_URL}/rfq/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Using client-side RFQ deletion fallback:', err.message);
    }

    const current = await this.getRFQs();
    const updated = current.filter((r) => r._id !== id);
    localStorage.setItem(RFQ_KEY, JSON.stringify(updated));
    return true;
  },
};
