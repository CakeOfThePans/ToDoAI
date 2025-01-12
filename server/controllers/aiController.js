import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'
import { List } from '../models/list.js'
import { Todo } from '../models/todo.js'

const model = new ChatGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_API_KEY,
	model: 'gemini-1.5-pro',
	temperature: 0,
	maxRetries: 1,
})

const prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful assistant that will perform an action based on the user's request.
    You must format your output as a JSON value that follows the formatting instructions.
    Formatting Instructions: {format_instructions}.

    If the user specifies a list name then please set the listName to the given name and listId to null.
    If the user doesn't specify a list name then please set listId to {current_list} and listName to null.

    You are also given the current date: {current_date}.
    If the user doesn't ask to set a time or date then keep the startDate and endDate to null.
    If the user asks to set a todo to a specific time or set a due date then you will do so based off the current date.
    If the user provides a time of day (in the format HH:MM), set both startDate and endDate. 
    If no time is provided but the date is, set endDate to 11:59.999pm based on the timezone of that date and set startDate to null.
    Adjust duration accordingly if the length is mentioned.
    Note that the start date should only be set if a time of day is provided. 
    Make sure all time frames are within 15-minute intervals unless it's 11:59.999pm.
    Ensure that all datetimes are in ISO 8601 format and set based on the timezone.

    Some example word mappings to actions: 
    Words for create are "create", "add"
    Words for update are "update", "edit", "complete"
    Words for delete are "delete", "remove"

    Interpret the following user request and return the action and todo details: {input}.
`)

const parser = StructuredOutputParser.fromZodSchema(
	z.object({
		action: z.enum(['create', 'update', 'delete', 'unrecognized']),
		todo: z.object({
			listName: z
				.string()
				.nullable()
				.describe('name of the list given if given'),
			listId: z
				.string()
				.nullable()
				.describe('id of the list that the todo is in'),
			task: z.string().describe('task name for old task'),
			newTask: z
				.string()
				.nullable()
				.describe(
					'new task name if given when action is update, otherwise null'
				),
			completed: z
				.boolean()
				.describe('whether or not the todo has been completed'),
			duration: z
				.number()
				.nullable()
				.describe('duration of the event in minutes, null if not specified'),
			startDate: z
				.string()
				.datetime({ offset: true })
				.nullable()
				.describe('start date of event if time of day is given, null if time of day is not stated and must be within 15 minute intervals'),
			endDate: z
				.string()
				.datetime({ offset: true })
				.nullable()
				.describe('end date or due date of event'),
		}),
	})
)

const chain = prompt.pipe(model).pipe(parser)

export const handleMessage = async (req, res) => {
	try {
		const output = await chain.invoke({
			format_instructions: parser.getFormatInstructions(),
			lists: JSON.stringify(req.body.lists),
			input: req.body.input,
			current_date: roundToNearest15Minutes(new Date()),
			current_list: req.body.current_list,
		})
		// console.log(output)
		const message = await validateOutput(req, output)
		return res.send(message)
	} catch (err) {
        console.log(err.message)
		return res.send('Something went wrong. Please try again later.')
	}
}

const validateOutput = async (req, output) => {
	try {
		const data = output.todo
		let list
		let todo
		//if given list name check that the user has a list with that list name
		if (data.listName) {
			list = await List.findOne({ userId: req.user.id, name: data.listName })
			if (!list)
				return {valid: false, message: `I'm sorry but I cannot find the list named '${data.listName}'`}
		}
		//otherwise default to current list
		else {
			list = await List.findById(data.listId)
			if (!list || list.userId != req.user.id)
				return {valid: false, message: `I'm sorry but I cannot find the specified list. Please reselect a list or input a list name.`}
		}
		output.todo.listName = list.name

		switch (output.action) {
			case 'unrecognized':
				return {valid: false, message: `I'm sorry but I cannot assist you with that request. Please specify to create, update, or delete a todo.`}
			case 'create':
				//no checks needed for creating a todo
				break
			case 'update':
				todo = await Todo.findOne({
					userId: req.user.id,
					listId: list._id,
					task: data.task,
				})
				if (!todo) {
					return {valid: false, message: `I'm sorry but I cannot find the todo with task '${data.task}' in #${list.name}`}
				}
				break
			case 'delete':
				todo = await Todo.findOne({
					userId: req.user.id,
					listId: list.id,
					task: data.task,
				})
				if (!todo) {
					return {valid: false, message: `I'm sorry but I cannot find the todo with task '${data.task}' in #${list.name}`}
				}
				break
		}
		return {valid: true, output: output}
	} catch (err) {
		console.log(err.message)
		return {valid: false, message: 'Something went wrong. Please try again later.'}
	}
}

export const confirm = async (req, res) => {
	try{
		const message = await doAction(req.body.info, req)
		return res.send(message)
	}
	catch(err){
		console.log(err.message)
	}
}

const doAction = async (info, req) => {
	try {
		const data = info.todo
		let list
		let todo
		//if given list name check that the user has a list with that list name
		if (data.listName) {
			list = await List.findOne({ userId: req.user.id, name: data.listName })
			if (!list)
				return `I'm sorry but I cannot find the list named '${data.listName}'`
		}
		//otherwise default to current list
		else {
			list = await List.findById(data.listId)
			if (!list || list.userId != req.user.id)
				return `I'm sorry but I cannot find the specified list. Please reselect a list or input a list name.`
		}

		switch (info.action) {
			case 'unrecognized':
				return `I'm sorry but I cannot assist you with that request. Please specify to create, update, or delete a todo.`
			case 'create':
				todo = new Todo({
					userId: req.user.id,
					listId: list._id,
					task: data.task,
					completed: data.completed,
					order: list.count,
					duration: data.duration ? data.duration : 30,
					startDate: data.startDate,
					endDate: data.endDate,
					scheduled: data.startDate ? true : false,
					color: list.color,
				})
				todo = await todo.save()

				//add +1 to the list's count
				list.count++
				list = await list.save()

				return `The todo '${data.task}' has been successfully added to #${list.name}`
			case 'update':
				todo = await Todo.findOne({
					userId: req.user.id,
					listId: list._id,
					task: data.task,
				})
				if (!todo) {
					return `I'm sorry but I cannot find the todo with task '${data.task}' in #${list.name}`
				}

				//update todo
				if (data.newTask) {
					todo.task = data.newTask
				}
				todo.completed = data.completed
				if (data.endDate) {
					todo.endDate = data.endDate
				}
                if (data.startDate) {
					todo.startDate = data.startDate
					todo.scheduled = true
				}
                //special case where we want to remove scheduled if endDate exists when startDate doesn't
                else if(data.endDate){
                    todo.startDate = null
                    todo.scheduled = false
                }
				if (data.duration) {
					todo.duration = data.duration
					if (todo.scheduled) {
						todo.endDate = new Date(todo.startDate)
						todo.endDate.setMinutes(todo.startDate.getMinutes() + data.duration) //set endDate bc ai doesn't update it sometimes
					}
				}

				await Todo.findByIdAndUpdate(todo._id, todo, {
					new: true,
				})

				return `The todo '${data.task}' has been successfully updated in #${list.name}`
			case 'delete':
				todo = await Todo.findOne({
					userId: req.user.id,
					listId: list.id,
					task: data.task,
				})
				if (!todo) {
					return `I'm sorry but I cannot find the todo with task '${data.task}' in #${list.name}`
				}

				//decrement the list count
				await List.updateOne({ _id: todo.listId }, { $inc: { count: -1 } })

				await Todo.findByIdAndDelete(todo._id)
				await Todo.updateMany(
					{ listId: todo.listId, order: { $gt: todo.order } },
					{ $inc: { order: -1 } }
				)

				return `The todo '${data.task}' has been successfully deleted from #${list.name}`
		}
	} catch (err) {
		console.log(err.message)
		return 'Something went wrong. Please try again later.'
	}
}

function roundToNearest15Minutes(date) {
    const roundedDate = new Date(date); // Copy the input date to avoid modifying it directly
    const minutes = roundedDate.getMinutes();
    
    // Calculate the nearest 15-minute interval
    const roundedMinutes = Math.round(minutes / 15) * 15;
    
    // Set the rounded minutes
    roundedDate.setMinutes(roundedMinutes);
    
    // Reset seconds and milliseconds
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);
    
    return roundedDate;
}