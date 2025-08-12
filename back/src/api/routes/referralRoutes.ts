import express from 'express';
import { handleReferralClick } from '../controllers/statsController';

const router = express.Router();

// Путь должен быть с динамическим параметром :referralCode
router.get('/:referralCode', handleReferralClick);

export default router;