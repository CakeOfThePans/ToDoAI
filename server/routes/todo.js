import express from 'express'
import { createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js'

const router = express.Router()

router.post('/create', createTodo)
router.put('/:todoId', updateTodo)
router.delete('/:todoId', deleteTodo)

export default router
