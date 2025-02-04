import { List } from '../models/list.js'
import { Todo } from '../models/todo.js'

export const getLists = async (req, res) => {
	try {
		const lists = await List.find({ userId: req.user.id }).sort({ order: 1 })
		res.send(lists)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const getList = async (req, res) => {
	try {
		const list = await List.findById(req.params.listId)
		if (list !== null && list.userId != req.user.id) {
      		return res.status(404).send("User does not have access to this list")
		}
		res.send(list)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const createList = async (req, res) => {
	try {
		const numLists = await List.countDocuments({ userId: req.user.id })
		let list = new List({
			name: req.body.name,
			userId: req.user.id,
			order: numLists + 1,
			color: "#039BE5"	//default color
		})
		list = await list.save()
		res.send(list)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const updateOrder = async (req, res) => {
	try {
		const { sourceIndex, destinationIndex } = req.body
		const lists = await List.find({ userId: req.user.id }).sort({ order: 1 })

		//reorder lists arr
		const [movedList] = lists.splice(sourceIndex, 1)
		lists.splice(destinationIndex, 0, movedList)

		//update db
		lists.forEach(async (list, index) => {
			await List.findByIdAndUpdate(list._id, { order: index })
		}) 
		
		res.send("Order updated")
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const updateListName = async (req, res) => {
	try {
		let currentList = await List.findById(req.params.listId)
		if (!req.body.name) {
			return res.status(400).send('Invalid list name')
		}
		if (!currentList) {
			return res.status(400).send('Invalid list ID')
		}
		currentList.name = req.body.name
		await currentList.save()
		return res.send(currentList)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const updateColor = async (req, res) => {
	try {
		let currentList = await List.findById(req.params.listId)
		if (!req.body.color) {
			return res.status(400).send('Invalid color')
		}
		if (!currentList) {
			return res.status(400).send('Invalid list ID')
		}
		//if it's a different color and a valid hex color
		if(currentList.color != req.body.color && /^#[0-9A-Fa-f]{6}$/.test(req.body.color)) {
			currentList.color = req.body.color
			await currentList.save()

			//now update the todos in the list
			await Todo.updateMany({ listId: req.params.listId }, { color : req.body.color })
		}
		return res.send(currentList)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const deleteList = async (req, res) => {
	try {
		const currentList = await List.findById(req.params.listId)
		if (!currentList) {
			return res.status(400).send('Invalid List ID')
		}
		await Todo.deleteMany({ listId: req.params.listId })
		await List.findByIdAndDelete(req.params.listId)
		//decrement all lists with higher order
		await List.updateMany(
			{ userId: req.user.id, order: { $gt: currentList.order } },
			{ $inc: { order: -1 } }
		)
		res.send(currentList)
	} catch (err) {
		res.status(500).send(err.message)
	}
}
