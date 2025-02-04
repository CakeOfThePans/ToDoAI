import express from 'express'
import { getTodos, getDefaultLists, getTodosFromList, createTodo, updateOrder, updateTodo, duplicateTodo, deleteTodo } from '../controllers/todoController.js'

const router = express.Router()

router.get('/', getTodos)
router.get('/defaultCount', getDefaultLists)
router.get('/:listId', getTodosFromList)
router.post('/', createTodo)
router.post('/updateOrder/:listId', updateOrder)
router.put('/:todoId', updateTodo)
router.post('/duplicate/:todoId', duplicateTodo)
router.delete('/:todoId', deleteTodo)

export default router