import { List } from '../models/list.js'
import { Todo } from '../models/todo.js'

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
        const list = await List.findById(req.params.listId)
        res.send(list);
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const createList = async (req, res) => {
    try{
        let list = new List({
            name: req.body.name, 
            userId: req.user.id
        })
        list = await list.save()
        res.send((list))
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const updateListName = async (req, res) => {
    try{
        let currentList = await List.findById(req.params.listId)
        if(!currentList){
            return res.status(400).send('Invalid List ID')
        }
        if(req.user.id !== currentList.userId.toString()){
            return res.status(401).send('Invalid credentials')
        }
        currentList.name = req.body.name
        await currentList.save()
        return res.status(200).send(currentList)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const deleteList = async (req, res) => {
    try{
        const currentList = await List.findById(req.params.listId)
        if(!currentList){
            return res.status(400).send('Invalid List ID')
        }
        if(req.user.id !== currentList.userId.toString()){
            return res.status(401).send('Invalid credentials')
        }
        await Todo.deleteMany({listId: req.params.listId})
        await List.findByIdAndDelete(req.params.listId)
        res.status(200).send('List has been deleted')
    }
    catch(err){
        res.status(500).send(err.message)
    }
}