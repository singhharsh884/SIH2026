import express from 'express';
import { findMatchesForDemand } from '../controllers/matchingController.js';

const router = express.Router();

/**
 * @desc    Find matching farm lots for a wholesale buyer RFQ or volume requirement
 * @route   POST /api/matching/find-matches
 * @access  Public
 */
router.post('/find-matches', findMatchesForDemand);

/**
 * @desc    Get matches for a specific RFQ ID
 * @route   GET /api/matching/rfq/:rfqId
 * @access  Public
 */
router.get('/rfq/:rfqId', (req, res, next) => {
  req.body = { rfqId: req.params.rfqId };
  findMatchesForDemand(req, res, next);
});

export default router;
