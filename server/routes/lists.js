import express from 'express'
import {
  getLists,
  getList,
  createList,
  updateListName,
  updateColor,
  deleteList,
  updateOrder,
} from '../controllers/listController.js'

const router = express.Router()

router.get('/', getLists)
router.get('/:listId', getList)
router.post('/', createList)
router.post('/updateOrder', updateOrder)
router.put('/:listId', updateListName)
router.put('/:listId/color', updateColor)
router.delete('/:listId', deleteList)

export default router
