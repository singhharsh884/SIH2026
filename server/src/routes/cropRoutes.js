import express from 'express';
import { getCrops, addCrop, deleteCrop } from '../controllers/cropController.js';

const router = express.Router();

router.route('/')
  .get(getCrops)
  .post(addCrop);

router.route('/:id')
  .delete(deleteCrop);

export default router;
