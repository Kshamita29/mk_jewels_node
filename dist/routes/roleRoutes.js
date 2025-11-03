import express from 'express';
import { getRoles, addRole, updateRole, deleteRole } from './controllers/roleController.js';
const router = express.Router();
router.get('/', getRoles);
router.post('/', addRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);
export default router;