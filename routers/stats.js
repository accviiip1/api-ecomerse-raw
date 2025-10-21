import express from 'express'
import { getAdminStats } from '../controller/stats.js'
import { authMiddleware } from '../middleware/middleware.js'

const router = express.Router()

router.get('/admin/stats', authMiddleware, getAdminStats)

export default router


