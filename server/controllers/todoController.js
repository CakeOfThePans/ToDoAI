import mongoose from 'mongoose'
import { List } from '../models/list.js'
import { Todo } from '../models/todo.js'


export const getTodos = async (req, res) => {
    try{
        const todos = await Todo.find({listId: req.params.listId})
        res.send(todos)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const createTodo = async (req, res) => {
    try{
        if(!mongoose.isValidObjectId(req.body.listId)){
            return res.status(400).send('Invalid List ID')
        }
        const list = await List.findById(req.body.listId)
        if(!list){
            return res.status(400).send('Invalid List ID')
        }
        let todo = new Todo(req.body)
        todo = await todo.save()
        res.send(todo);
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const updateTodo = async (req, res) => {
    try{
        const todo = await Todo.findByIdAndUpdate(req.params.todoId, req.body, {new: true})
        return res.send(todo)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const deleteTodo = async (req, res) => {
    try{
        await Todo.findByIdAndDelete(req.params.todoId)
        res.status(200).send('Todo has been deleted')
    }
    catch(err){
        res.status(500).send(err.message)
    }
}