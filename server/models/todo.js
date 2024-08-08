import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
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
        required: true,
        default: false
    },
    queue: {
        type: Boolean,
        required: true,
        default: false
    },
    order: {
        type: Number,
        required: true
    }
    //due date/time/priority later
})

export const Todo = mongoose.model('Todo', todoSchema)