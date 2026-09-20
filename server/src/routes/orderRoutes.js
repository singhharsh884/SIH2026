import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  recordWeighingReconciliation,
  releaseOrderPayout,
  getRFQs,
  createRFQ,
  deleteRFQ,
} from '../controllers/orderController.js';
import { findMatchesForDemand } from '../controllers/matchingController.js';

const orderRouter = express.Router();
const rfqRouter = express.Router();

// Order routes
orderRouter.route('/')
  .get(getOrders)
  .post(createOrder);

orderRouter.route('/:id')
  .get(getOrderById);

orderRouter.route('/:id/status')
  .patch(updateOrderStatus);

orderRouter.route('/:id/weighing')
  .post(recordWeighingReconciliation);

orderRouter.route('/:id/payout/release')
  .post(releaseOrderPayout);

// RFQ routes
rfqRouter.route('/')
  .get(getRFQs)
  .post(createRFQ);

rfqRouter.route('/:id')
  .delete(deleteRFQ);

// PRD Section 12: GET /api/rfqs/:id/matches
rfqRouter.route('/:id/matches')
  .get(findMatchesForDemand);

export { orderRouter, rfqRouter };
