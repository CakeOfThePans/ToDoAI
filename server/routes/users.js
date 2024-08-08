import express from 'express'
import { updateUser, deleteUser } from '../controllers/userController.js'

const router = express.Router()

router.put('/:userId', updateUser)
router.delete('/:userId', deleteUser)

export default router
