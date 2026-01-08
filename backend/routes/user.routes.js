import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';

import { 
    getUserProfile, 
    getSuggestedUsers, 
    followUser, 
    unfollowUser, 
    updateUserProfile 
} from '../controllers/user.controller.js';

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);

router.post("/follow/:id", protectRoute, followUser);
router.post("/unfollow/:id", protectRoute, unfollowUser);
router.put("/update", protectRoute, updateUserProfile);

export default router;