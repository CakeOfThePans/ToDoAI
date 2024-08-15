import express from 'express'
import {
  getLists,
  getList,
  createList,
  updateListName,
  deleteList,
  updateOrder,
} from '../controllers/listController.js'

const router = express.Router()

router.get('/', getLists)
router.get('/:listId', getList)
router.post('/', createList)
router.post('/updateOrder', updateOrder)
router.put('/:listId', updateListName)
router.delete('/:listId', deleteList)

export default router
