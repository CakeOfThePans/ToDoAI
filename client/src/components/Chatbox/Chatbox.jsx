import { Button, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import {
	HiChat,
	HiX,
	HiPaperAirplane,
	HiInformationCircle,
} from 'react-icons/hi'
import axios from 'axios'
import { useSelector } from 'react-redux'

export default function Chatbox({ fetchData }) {
	const { currentList } = useSelector((state) => state.list)
	const [isOpen, setIsOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [confirm, setConfirm] = useState(false)
	const [data, setData] = useState(null)
	const [messages, setMessages] = useState([
		{
			text: `Hello! I'm your AI assistant here to help you manage your todos. You can ask me to create, update, or delete tasks from your todo list. For example: 

To create a task, you can say: "Add 'Read a book' to the list 'Inbox' at 2:00pm tomorrow for 45 minutes". You can also leave out details like the list, time, date, or duration—they're optional! 

Let's get started! What would you like to do?`,
			sender: 'ai',
		},
	])
	const scrollRef = useRef(null)
	const [input, setInput] = useState('')
	const inputRef = useRef(null)

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isOpen])

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (input && !loading) {
			const text = input
			setInput('')
			setMessages([
				...messages,
				{ text: text, sender: 'user' },
				{ text: 'Loading...', sender: 'ai', loading: true },
			])
			setLoading(true)

			try {
				const res = await axios.post('/api/ai/message', {
					current_list: currentList,
					input: text,
				})
				if (res.data && res.data.valid === false) {
					setMessages((previousMessages) => [
						...previousMessages.slice(0, -1),
						{ text: res.data.message, sender: 'ai' },
					])
				} else {
					setConfirm(true)
					setData(res.data.output)
					setMessages((previousMessages) => [
						...previousMessages.slice(0, -1),
						{
							text: outputToText(res.data.output),
							sender: 'ai',
						},
					])
				}
				setLoading(false)
			} catch (err) {
				console.log(err)
				setConfirm(false)
				setLoading(false)
			}
		}
	}

	const outputToText = (output) => {
		const todo = output.todo
		let text = ''
		switch (output.action) {
			case 'create':
				text = `Are you sure you want to create this task: \n\n'${todo.task}'`
				if (todo.listName) text += ` in the list '#${todo.listName}'`
				if (todo.startDate) text += ` on ${dateToWords(todo.startDate)}`
				if (todo.duration) text += ` for ${todo.duration} minutes`
				break
			case 'update':
				text = `Are you sure you want to update the task '${todo.task}'`
				if (todo.listName) text += ` in the list '#${todo.listName}'`
				text += ` to: \n\n'${todo.newTask}'`
				if (todo.startDate) text += ` on ${dateToWords(todo.startDate)}`
				if (todo.duration) text += ` for ${todo.duration} minutes`
				break
			case 'delete':
				text = `Are you sure you want to delete this task: \n\n'${todo.task}'`
				if (todo.listName) text += ` in the list '#${todo.listName}'`
				break
		}
		return text
	}

	const dateToWords = (dateString) => {
		const date = new Date(dateString)

		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			timeZone: 'America/New_York',
			timeZoneName: 'short',
		}

		return new Intl.DateTimeFormat('en-US', options).format(date)
	}

	const handleConfirm = async () => {
		try {
			setMessages([
				...messages,
				{ text: 'Loading...', sender: 'ai', loading: true },
			])
			setLoading(true)
			const res = await axios.post('/api/ai/confirm', {
				info: data,
			})
			setData(null)
			setConfirm(false)
			setMessages((previousMessages) => [
				...previousMessages.slice(0, -1),
				{ text: res.data, sender: 'ai' },
			])
			setLoading(false)
			fetchData()
		} catch (err) {
			console.log(err)
			setConfirm(false)
			setLoading(false)
		}
	}

	const handleCancel = () => {
		setData(null)
		setConfirm(false)
		setMessages((previousMessages) => [
			...previousMessages,
			{ text: 'Request cancelled', sender: 'ai' },
		])
	}

	const handleClose = () => {
		setIsOpen(false)
		setMessages([
			{
				text: `Hello! I'm your AI assistant here to help you manage your todos. You can ask me to create, update, or delete tasks from your todo list. For example: 

To create a task, you can say: "Add 'Read a book' to the list 'Inbox' at 2:00pm tomorrow for 45 minutes". You can also leave out details like the list, time, date, or duration—they're optional! 

Let's get started! What would you like to do?`,
				sender: 'ai',
			},
		])
		setConfirm(false)
		setData(null)
		setInput('')
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit(e)
		}
	}

	return (
		<>
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40 flex items-center justify-center focus:ring-0"
					aria-label="Open chatbot"
				>
					<HiChat className="w-6 h-6" />
				</button>
			)}

			{isOpen && (
				<div className="fixed bottom-6 right-6 w-full max-w-md h-96 sm:h-[500px] flex flex-col shadow-2xl z-50 bg-white border border-gray-200 rounded-xl">
					<div className="border-b border-gray-200 px-4 py-3 bg-blue-600 text-white rounded-t-xl flex items-center justify-between">
						<div className="flex items-center gap-2">
							<HiChat className="w-5 h-5" />
							<h3 className="font-semibold">ToDoAI Assistant</h3>
						</div>
						<button
							onClick={handleClose}
							className="p-1 hover:bg-white/20 rounded transition-colors focus:ring-0"
							aria-label="Close chatbot"
						>
							<HiX className="w-5 h-5" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-4">
						{messages.map((message, index) => (
							<div
								key={index}
								className={`flex ${
									message.sender === 'user' ? 'justify-end' : 'justify-start'
								}`}
							>
								<div
									className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
										message.sender === 'user'
											? 'bg-blue-600 text-white rounded-br-none'
											: 'bg-gray-100 text-gray-900 rounded-bl-none'
									}`}
								>
									{message.text}
								</div>
							</div>
						))}
						{loading && (
							<div className="flex justify-start">
								<div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
									<div className="flex gap-1">
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '0.1s' }}
										></div>
										<div
											className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
											style={{ animationDelay: '0.2s' }}
										></div>
									</div>
								</div>
							</div>
						)}
						{confirm && (
							<div className="flex gap-2 items-center mt-2">
								<Button
									color="failure"
									onClick={handleCancel}
									className="focus:ring-0 text-white flex-1"
								>
									Cancel
								</Button>
								<Button
									color="success"
									onClick={handleConfirm}
									className="focus:ring-0 text-white flex-1"
								>
									Confirm
								</Button>
							</div>
						)}
						<div ref={scrollRef} />
					</div>

					<div className="border-t border-gray-200 p-4 bg-white rounded-b-xl space-y-2">
						<div className="flex gap-2">
							<TextInput
								placeholder="Ask me anything..."
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={handleKeyPress}
								disabled={loading || confirm}
								className="flex-1 text-sm"
								ref={inputRef}
							/>
							<Button
								size="sm"
								color="blue"
								onClick={handleSubmit}
								disabled={loading || !input.trim() || confirm}
								className="focus:ring-0"
							>
								<HiPaperAirplane size={20} />
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
