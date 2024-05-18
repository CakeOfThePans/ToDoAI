import express from 'express'
import {
  getLists,
  getList,
  createList,
  updateListName,
  deleteList,
  changeListOrder,
} from '../controllers/listController.js'

const router = express.Router()

router.get('/:userId', getLists)
router.get('/listName/:listId', getList)
router.post('/create', createList)
router.post('/changeListOrder', changeListOrder)
router.put('/:listId', updateListName)
router.delete('/:listId', deleteList)

export default router
