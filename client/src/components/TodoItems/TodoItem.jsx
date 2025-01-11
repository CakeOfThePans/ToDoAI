import { useEffect, useRef, useState } from 'react'
import { Checkbox, Label } from 'flowbite-react'
import axios from 'axios'
import EditItemForm from './EditItemForm'
import TodoOptions from './TodoOptions'
import { AiOutlineDownCircle } from 'react-icons/ai'
import { Tooltip, Whisper } from 'rsuite'

export default function TodoItem({
	todo,
	selectedTodo,
	setSelectedTodo,
	fetchData,
	editing,
	setEditing,
	currentList,
	inputRef,
}) {
	const [completed, setCompleted] = useState(todo.completed)

	useEffect(() => {
		setCompleted(todo.completed)
	}, [todo])

	const handleToggleCompleted = async () => {
		try {
			await axios.put(`/api/todos/${todo._id}`, {
				completed: !completed,
			})
			setCompleted(!completed)
			fetchData()
		} catch (err) {
			console.log(err)
		}
	}

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/todos/${todo._id}`)
			fetchData()
		} catch (err) {
			console.log(err)
		}
	}

	function convertMinutesToTime(minutes) {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60

		if (hours > 0) {
			return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
		} else {
			return `${mins}m`
		}
	}

	function formatDateToMonthDay(date) {
		const options = { month: 'long', day: 'numeric' }
		return date.toLocaleDateString('en-US', options)
	}

	function formatDateToTime(date) {
		const options = {
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true, // Enables AM/PM format
		}
		return date.toLocaleString('en-US', options)
	}

	return (
		<li className="cursor-pointer rounded-xl mx-2 transition-all flex justify-between items-center border min-h-11">
			{editing == todo._id ? (
				<EditItemForm
					todo={todo}
					setEditing={setEditing}
					currentList={currentList}
					fetchData={fetchData}
					inputRef={inputRef}
				/>
			) : (
				<div className="flex flex-col w-full p-2 gap-1">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2 min-w-0">
							<Checkbox
								className="focus:outline-none focus:ring-0 text-gray-700"
								style={{ boxShadow: 'none' }}
								checked={completed}
								onChange={handleToggleCompleted}
							/>
							<Label className="truncate text-wrap">{todo.task}</Label>
						</div>
						{selectedTodo == todo._id ? (
							<TodoOptions
								completed={completed}
								setEditing={setEditing}
								setSelectedTodo={setSelectedTodo}
								handleDelete={handleDelete}
								todo={todo}
							/>
						) : (
							<div className="flex gap-2 items-center">
								{todo.endDate &&
									(todo.startDate ? (
										<span className="text-nowrap">
											{formatDateToTime(new Date(todo.startDate))}
										</span>
									) : (
										<span className="text-nowrap">
											{formatDateToMonthDay(new Date(todo.endDate))}
										</span>
									))}
								<span className="opacity-75">
									{convertMinutesToTime(todo.duration)}
								</span>
								<Whisper
									placement="top"
									trigger="hover"
									speaker={
										<Tooltip className="bg-gray-800 text-xs p-2">
											Open todo options
										</Tooltip>
									}
								>
									<div>
										<AiOutlineDownCircle
											size={20}
											className="text-gray-600"
											onClick={() => setSelectedTodo(todo._id)}
										/>
									</div>
								</Whisper>
							</div>
						)}
					</div>
					{selectedTodo == todo._id && todo.notes && (
						// add transitions
						<div className="w-full overflow-hidden">
							<p className="text-sm text-gray-600 whitespace-pre-wrap">
								{todo.notes}
							</p>
						</div>
					)}
				</div>
			)}
		</li>
	)
}
