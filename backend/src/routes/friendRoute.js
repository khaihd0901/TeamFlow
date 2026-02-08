import express from 'express';

import {acceptFriendRequest, declineFriendRequest, getAllFriendRequests, sendFriendRequest, getAllFriends} from '../controllers/friendController.js'

const router = express.Router();

router.post(`/requests`, sendFriendRequest);
router.post(`/requests/:requestId/accept`, acceptFriendRequest)
router.post(`/requests/:requestId/decline`, declineFriendRequest)
router.get(`/`, getAllFriends)
router.get(`/requests`, getAllFriendRequests);

export default router;