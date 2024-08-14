import express from 'express'
import { getTodos, getDefaultLists, getTodosFromList, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js'

const router = express.Router()

router.get('/', getTodos)
router.get('/defaultCount', getDefaultLists)
router.get('/:listId', getTodosFromList)
router.post('/', createTodo)
router.put('/:todoId', updateTodo)
router.delete('/:todoId', deleteTodo)

export default router