import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false
    },
    queue: {
        type: Boolean,
        default: false
    },
    //due date/priority later
})

export const Todo = mongoose.model('Todo', todoSchema)