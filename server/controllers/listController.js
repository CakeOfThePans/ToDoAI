import { List } from '../models/list.js'
import { Todo } from '../models/todo.js'
import mongoose from 'mongoose'

export const getLists = async (req, res) => {
    try{
        const lists = await List.find({ userId: req.user.id })
        res.send(lists);
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const getList = async (req, res) => {
    try{
        const lists = await List.findById(req.user.id).populate()
        res.send(lists);
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const createList = async (req, res) => {
    try{
        if(req.body.name.length > 20){
            return res.status(400).send('List name must be less than 20 characters')
        }
        let list = new List({
            ...req.body, userId: req.user.id, todos: []
        })
        list = await list.save()
        req.send((list))
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const updateListName = async (req, res) => {
    try{
        const currentList = List.findById(req.params.listId)
        if(req.user.id !== currentList.userId){
            return res.status(401).send('Invalid credentials')
        }
        if(req.body.name.length > 20){
            return res.status(400).send('List name must be less than 20 characters')
        }
        const list = await List.findByIdAndUpdate(req.params.listId, {name: req.body.name}, {new: true})
        return res.status(200).send(list)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const updateTodos = async (req, res) => {
    try{
        const currentList = List.findById(req.params.listId)
        if(req.user.id !== currentList.userId){
            return res.status(401).send('Invalid credentials')
        }
        if(!Array.isArray(req.body.todos)){
            return res.status(400).send('Todos must be an array')
        }
        for(const id of req.body.todos){
            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).send('You must pass valid ObjectsIds')
            }
        }
        const list = await List.findByIdAndUpdate(req.params.listId, {todos: req.body.todos}, {new: true})
        res.send(list)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const deleteList = async (req, res) => {
    try{
        const currentList = List.findById(req.params.listId)
        if(req.user.id !== currentList.userId){
            return res.status(401).send('Invalid credentials')
        }
        const list = await List.findById(req.params.listId)
        for(const todoId of list.todos){
            await Todo.findByIdAndDelete(todoId)
        }
        await List.findByIdAndDelete(req.params.listId)
        res.status(200).send('List has been deleted')
    }
    catch(err){
        res.status(500).send(err.message)
    }
}