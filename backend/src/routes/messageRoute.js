import express from 'express'
import {sendPrivateMessage,sendGroupMessage} from '../controllers/messageController.js'
import { checkGroupMemberShip } from '../middlewares/checkGroupMemberShip.js';

const router = express.Router();

router.post(`/private`, sendPrivateMessage)
router.post(`/group`,checkGroupMemberShip, sendGroupMessage)

export default router