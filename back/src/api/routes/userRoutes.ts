import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userControlles';

const router = express.Router();

router.route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile);

export default router;