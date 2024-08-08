import { List } from '../models/list.js'
import { Todo } from '../models/todo.js'

export const getTodos = async (req, res) => {
	try {
        const list = await List.findById(req.params.listId)
        if(!list){
            return res.status(400).send("Invalid List ID")
        }
        if(list.userId != req.user.id){
            return res.status(400).send("User does not have access to this list")
        }

		const todos = await Todo.find({ listId: req.params.listId }).sort({
			order: 1,
		})
		res.send(todos)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const createTodo = async (req, res) => {
	try {
		let list = await List.findById(req.body.listId)
		if(!list) {
			return res.status(400).send('Invalid List ID')
		}
        if(list.userId != req.user.id){
            return res.status(400).send("User does not have access to this list")
        }

		//add +1 to the list's count
		list.count++
		list = await list.save()

		let todo = new Todo({
            listId: req.body.listId,
            task: req.body.task,
            notes: req.body.notes,
            completed: false,
            queue: false,
            order: list.count
        })
		todo = await todo.save()
		res.send(todo)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const changeTodoOrder = async (req, res) => {
    try {
      
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

export const updateTodo = async (req, res) => {
	try {
        //if the todo is switching to a different list
        if(req.body.listId){
            let list = await List.findById(req.body.listId)
            if(!list) {
                return res.status(400).send('Invalid List ID')
            }
            if(list.userId != req.user.id){
                return res.status(400).send("User does not have access to this list")
            }
        }

		const todo = await Todo.findByIdAndUpdate(req.params.todoId, req.body, {
			new: true,
		})
		return res.send(todo)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const deleteTodo = async (req, res) => {
	try {
        const currentTodo = await Todo.findById(req.params.todoId)
        if (!currentTodo) {
            return res.status(400).send('Invalid Todo ID')
        }

        //decrement the list count
        await List.updateOne(
            { _id: currentTodo.listId },
            { $inc: { count: -1 } }
        )

		await Todo.findByIdAndDelete(req.params.todoId)
        await Todo.updateMany(
            { listId: currentTodo.listId, order: { $gt: currentTodo.order } },
            { $inc: { order: -1 } }
        )
		res.status(200).send(currentTodo)
	} catch (err) {
		res.status(500).send(err.message)
	}
}
