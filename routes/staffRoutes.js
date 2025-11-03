import express from 'express';
import {
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff
} from './controllers/staffController.js';

const router = express.Router();

router.get('/', getStaff);
router.post('/', addStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
