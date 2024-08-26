import { User } from '../models/user.js'
import { List } from '../models/list.js'
import { Todo } from '../models/todo.js'

export const getTodos = async (req, res) => {
	try {
        // const { today, upcoming, inQueue, showInQueueOnly, hideCompleted, showOverdueOnly, showScheduledOnly, task } = req.query
        const { today, upcoming, hideCompleted, showOverdueOnly, showScheduledOnly, task } = req.query
        const query = {
            userId: req.user.id
        }

        //list page
        if(today === "true") {
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date()
            endOfDay.setHours(23, 59, 59, 999)

            query.endDate = { $gte: startOfDay, $lte: endOfDay }
        }
        else if(upcoming === "true") query.endDate = { $gte: new Date() }
        // else if(inQueue === "true") query.queue = true

        //extra query
        // if(showInQueueOnly === "true") query.queue = true
        if(hideCompleted === "true") query.completed = false
        if(showOverdueOnly === "true") query.endDate = { $lt: new Date() }
        if(showScheduledOnly === "true") query.scheduled = true
        if(task) query.task = { $regex: task, $options: 'i' }
        
		const todos = await Todo.find(query).sort({
            listId: 1,
            order: 1
		})
		res.send(todos)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const getDefaultLists = async (req, res) => {
	try {
        // const defaultLists = ['Inbox', 'Today', 'Upcoming', 'In Queue']
        const defaultLists = ['Inbox', 'Today', 'Upcoming']
        const lists = []
        for(const list of defaultLists){
            if(list === "Inbox"){
                const user = await User.findById(req.user.id)
                const inbox = await List.findById(user.defaultList)
                lists.push({
                    id: user.defaultList,
                    name: list,
                    count: inbox.count
                })
            }
            else if(list === "Today") {
                const startOfDay = new Date()
                startOfDay.setHours(0, 0, 0, 0)
                const endOfDay = new Date()
                endOfDay.setHours(23, 59, 59, 999)
    
                lists.push({
                    name: list,
                    count: await Todo.countDocuments({ endDate: { $gte: startOfDay, $lte: endOfDay } })
                })
            }
            else if(list === "Upcoming"){
                lists.push({
                    name: list,
                    count: await Todo.countDocuments({ endDate: { $gte: new Date() } })
                })
            }
            // else if(list === "In Queue") {
            //     lists.push({
            //         name: list,
            //         count: await Todo.countDocuments({ queue: true })
            //     })
            // }
        } 
		res.send(lists)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const getTodosFromList = async (req, res) => {
	try {
        const list = await List.findById(req.params.listId)
        if(!list){
            return res.status(400).send("Invalid List ID")
        }
        if(list.userId != req.user.id){
            return res.status(400).send("User does not have access to this list")
        }

        // const { showInQueueOnly, hideCompleted, showOverdueOnly, showScheduledOnly, task } = req.query
        const { hideCompleted, showOverdueOnly, showScheduledOnly, task } = req.query
        const query = {
            listId: req.params.listId
        }
        // if(showInQueueOnly === "true") query.queue = true
        if(hideCompleted === "true") query.completed = false
        if(showOverdueOnly === "true") query.endDate = { $lt: new Date() }
        if(showScheduledOnly === "true") query.scheduled = true
        if(task) query.task = { $regex: task, $options: 'i' }

		const todos = await Todo.find(query).sort({
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

		let todo = new Todo({
            userId: req.user.id,
            listId: req.body.listId,
            task: req.body.task,
            completed: false,
            // queue: false,
            order: list.count,
            duration: req.body.duration,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            scheduled: req.body.scheduled
        })
		todo = await todo.save()

        //add +1 to the list's count
		list.count++
		list = await list.save()

		res.send(todo)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const updateOrder = async (req, res) => {
	try {
        const list = await List.findById(req.params.listId)
        if(!list){
            return res.status(400).send("Invalid List ID")
        }
        if(list.userId != req.user.id){
            return res.status(400).send("User does not have access to this list")
        }

		const { sourceIndex, destinationIndex } = req.body
        const todos = await Todo.find({ listId: req.params.listId }).sort({ order: 1 })

		//reorder todos arr
		const [movedList] = todos.splice(sourceIndex, 1)
		todos.splice(destinationIndex, 0, movedList)

		//update db
		todos.forEach(async (todo, index) => {
			await Todo.findByIdAndUpdate(todo._id, { order: index })
		}) 
		
		res.send("Order updated")
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
