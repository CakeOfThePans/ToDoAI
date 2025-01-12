import { Avatar, Button, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { BiSend, BiSolidTrash } from 'react-icons/bi'
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
			text: `	Hello! I'm your AI assistant here to help you manage your todos. You can ask me to create, update, or delete tasks from your todo list. For example: \n
					To create a task, you can say: "Add 'Read a book' to the list 'Inbox' at 2:00pm tomorrow for 45 minutes". You can also leave out details like the list, time, date, or duration—they're optional! 
					
					Let's get started! What would you like to do?
				`,
			sender: 'ai',
		},
	])
	const lastMessageRef = useRef(null);
	const [input, setInput] = useState('')
	const inputRef = useRef(null)

	useEffect(() => {
		if (isOpen && inputRef) {
			inputRef.current.focus()
		}
	}, [isOpen])

	//auto scroll to the lowest message
	useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (input && !loading) {
			const text = input
			setInput('')
			setMessages([
				...messages,
				{ text: text, sender: 'user' },
				{ text: 'Loading...', sender: 'ai' },
			])
			setLoading(true)

			try {
				//call ai
				const res = await axios.post('/api/ai/message', {
					current_list: currentList,
					input: text,
				})
				//use new messages both fail and success
				if (res.data.valid === false) {
					setMessages((previousMessages) => [
						...previousMessages.slice(0, -1), //remove loading
						{ text: res.data.message, sender: 'ai' },
					])
				} else {
					setConfirm(true)
					setData(res.data.output)
					setMessages((previousMessages) => [
						...previousMessages.slice(0, -1), //remove loading
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
				text+= ` to: \n\n'${todo.newTask}'`
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
        const date = new Date(dateString);

        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'America/New_York',
            timeZoneName: 'short',
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

	const handleConfirm = async () => {
		try {
			setMessages([...messages, { text: 'Loading...', sender: 'ai' }])
			setLoading(true)
			const res = await axios.post('/api/ai/confirm', {
				info: data,
			})
			setData(null)
			setConfirm(false)
			setMessages((previousMessages) => [
				...previousMessages.slice(0, -1), //remove loading
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

	const handleClear = () => {
		//reset messages
		setMessages([
			{
				text: `	Hello! I'm your AI assistant here to help you manage your todos. You can ask me to create, update, or delete tasks from your todo list. For example: \n
					To create a task, you can say: "Add 'Read a book' to the list 'Inbox' at 2:00pm tomorrow for 45 minutes". You can also leave out details like the list, time, date, or duration—they're optional! 
					
					Let's get started! What would you like to do?
				`,
				sender: 'ai',
			},
		])
		setConfirm(false)
	}

	return (
		<div className="fixed bottom-6 right-6 z-40 h-3/5">
			<div className="flex flex-col items-end h-full justify-end">
				{isOpen && (
					<div className="flex flex-col justify-between shadow-md bg-gray-100 border-2 border-gray-200 w-[500px] h-full m-2 rounded-xl p-3">
						<div className="overflow-y-auto flex flex-col mb-2">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`max-w-[75%] py-2 px-3 rounded-xl mb-2 text-wrap overflow-ellipsis whitespace-pre-line text-base border ${
										message.sender === 'user'
											? 'self-end bg-white text-black'
											: 'self-start bg-blue-600 text-white'
									}`}
									ref={index === messages.length - 1 ? lastMessageRef : null}
								>
									{message.text}
								</div>
							))}
							{confirm && (
								<div className="flex gap-2 items-center">
									<Button
										fullSized
										color="failure"
										onClick={handleCancel}
										className="focus:ring-0 text-white"
									>
										Cancel
									</Button>
									<Button
										fullSized
										color="success"
										onClick={handleConfirm}
										className="focus:ring-0 text-white"
									>
										Confirm
									</Button>
								</div>
							)}
						</div>
						<form
							className="flex justify-between items-center gap-2"
							onSubmit={handleSubmit}
						>
							<Button
								color="gray"
								onClick={handleClear}
								className="focus:ring-0 focus:text-inherit enabled:hover:text-inherit"
							>
								<BiSolidTrash size={20} />
							</Button>
							<TextInput
								className="w-full"
								ref={inputRef}
								type="text"
								placeholder="New request"
								value={input}
								disabled={confirm}
								onChange={(e) => setInput(e.target.value)}
							/>
							<Button
								color="gray"
								onClick={handleSubmit}
								className="focus:ring-0 focus:text-inherit enabled:hover:text-inherit"
							>
								<BiSend size={20} />
							</Button>
						</form>
					</div>
				)}
				<div
					className={
						'rounded-2xl p-3 cursor-pointer' +
						(isOpen ? ' bg-blue-300' : ' bg-blue-200')
					}
					onClick={() => setIsOpen(!isOpen)}
				>
					<Avatar alt="Toggle Chat" img="/chatbox.svg" size="sm" />
				</div>
			</div>
		</div>
	)
}
