import { Avatar, Button, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { BiSend, BiSolidTrash } from 'react-icons/bi'
import axios from 'axios'
import { useSelector } from 'react-redux'

export default function Chatbox({ fetchData }) {
	const { currentList } = useSelector((state) => state.list)
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState([
		{
			text: `
				Hello! I'm your AI assistant here to help you manage your todos. You can ask me to create, update, or delete tasks from your todo list. For example: \n
				To create a task, you can say: "Add 'Read a book' to the list 'Inbox' at 2:00pm tomorrow for 45 minutes". You can also leave out details like the list, time, date, or duration—they're optional! 
				Let's get started! What would you like to do?
				`,
			sender: 'ai',
		}
	])
	const [input, setInput] = useState('')
	const inputRef = useRef(null)

	useEffect(() => {
		if (isOpen && inputRef) {
			inputRef.current.focus()
		}
	}, [isOpen])

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (input) {
			const text = input
			setInput('')
			setMessages([
				...messages,
				{ text: text, sender: 'user' },
				{ text: 'Loading...', sender: 'ai' },
			])

			try {
				//call ai
				const res = await axios.post('/api/ai', {
					current_list: currentList,
					input: text,
				})
				//use new messages
				setMessages((previousMessages) => [
					...previousMessages.slice(0, -1),	//remove loading
					{ text: res.data, sender: 'ai' },
				])
				fetchData()
			} catch (err) {
				console.log(err)
			}
		}
	}

	const handleClear = () => {
		//reset messages
		setMessages([
			{
				text: `
					Hello! I'm your AI assistant here to help you manage your todos. You can ask me to create, update, or delete tasks from your todo list. For example: \n
					To create a task, you can say: "Add 'Read a book' to the list 'Inbox' at 2:00pm tomorrow for 45 minutes". You can also leave out details like the list, time, date, or duration—they're optional! 
					Let's get started! What would you like to do?
					`,
				sender: 'ai',
			},
		])
	}

	return (
		<div className="fixed bottom-6 right-6 z-40 h-3/5">
			<div className="flex flex-col items-end h-full justify-end">
				{isOpen && (
					<div className="flex flex-col justify-between shadow-md bg-gray-100 border-2 border-gray-200 w-[500px] h-full m-2 rounded-xl p-3">
						<div className="overflow-y-auto flex flex-col">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`max-w-[75%] py-2 px-3 rounded-xl mb-2 text-wrap overflow-ellipsis whitespace-nowrap text-base border ${
										message.sender === 'user'
											? 'self-end bg-white text-black'
											: 'self-start bg-blue-600 text-white'
									}`}
								>
									{message.text}
								</div>
							))}
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
								placeholder=""
								value={input}
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
						(isOpen ? ' bg-gray-300' : ' bg-gray-200')
					}
					onClick={() => setIsOpen(!isOpen)}
				>
					<Avatar alt="Toggle Chat" img="/chatbox.svg" size="sm" />
				</div>
			</div>
		</div>
	)
}
