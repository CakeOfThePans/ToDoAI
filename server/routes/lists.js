import express from 'express'
import { getLists, getList, createList, updateListName, updateTodos, deleteList } from '../controllers/listController.js'

const router = express.Router()

router.get('/', getLists)
router.get('/:listId', getList)
router.post('/create', createList)
router.put('/name/:listId', updateListName)
router.put('/todos/:listId', updateTodos)
router.delete('/:listId', deleteList)

export default router
