import { Todo } from '../models/todo.js'

export const createTodo = async (req, res) => {
    try{
        let todo = new Todo({userId: req.user.id, ...req.body})
        todo = todo.save()
        res.send(todo);
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const updateTodo = async (req, res) => {
    try{
        const currentTodo = Todo.findById(req.params.todoId)
        if(req.user.id !== currentTodo.userId){
            return res.status(401).send('Invalid credentials')
        }
        const todo = await Todo.findByIdAndUpdate(req.params.todoId, req.body, {new: true})
        return res.status(200).send(todo)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const deleteTodo = async (req, res) => {
    try{
        const currentTodo = Todo.findById(req.params.todoId)
        if(req.user.id !== currentTodo.userId){
            return res.status(401).send('Invalid credentials')
        }
        await Todo.findByIdAndDelete(req.params.todoId)
        res.status(200).send('Todo has been deleted')
    }
    catch(err){
        res.status(500).send(err.message)
    }
}