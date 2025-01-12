import express from 'express'
import { handleMessage, confirm } from '../controllers/aiController.js'

const router = express.Router()

router.post('/message', handleMessage)
router.post('/confirm', confirm)

export default router