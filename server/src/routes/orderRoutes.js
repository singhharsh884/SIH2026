import express from 'express';
import {
  createOrder,
  getOrders,
  getRFQs,
  createRFQ,
  deleteRFQ,
} from '../controllers/orderController.js';

const orderRouter = express.Router();
const rfqRouter = express.Router();

// Order routes
orderRouter.route('/')
  .get(getOrders)
  .post(createOrder);

// RFQ routes
rfqRouter.route('/')
  .get(getRFQs)
  .post(createRFQ);

rfqRouter.route('/:id')
  .delete(deleteRFQ);

export { orderRouter, rfqRouter };
