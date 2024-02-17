import express from 'express'
import { updateUser, deleteUser } from '../controllers/userController.js'

const router = express.Router()

router.put('/update/:userId', updateUser)
router.delete('/delete/:userId', deleteUser)

export default router
