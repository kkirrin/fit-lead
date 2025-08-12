import express from 'express';
import { handleReferralClick } from '../controllers/statsController';

const router = express.Router();

router.get('/:referralCode', handleReferralClick);

export default router;