import express from 'express'
import { listAbout, getAbout, createAbout, updateAbout, deleteAbout } from '../controller/about.js'
import { authMiddleware } from '../middleware/middleware.js'

const router = express.Router()

router.get('/about-posts', listAbout)
router.get('/about-posts/:id', getAbout)
router.post('/about-posts', authMiddleware, createAbout)
router.put('/about-posts/:id', authMiddleware, updateAbout)
router.delete('/about-posts/:id', authMiddleware, deleteAbout)

export default router


