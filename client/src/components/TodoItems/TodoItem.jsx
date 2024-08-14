import { useEffect, useRef, useState } from 'react'
import { Checkbox, Label, Tooltip } from 'flowbite-react'
import axios from 'axios'
import EditItemForm from './EditItemForm'
import { BiCalendarPlus, BiPencil, BiTrash } from 'react-icons/bi'

export default function TodoItem({
	todo,
	fetchData,
	editing,
	setEditing,
	currentList,
	inputRef,
}) {
	const [isHovered, setIsHovered] = useState(false)
	const [inQueue, setInQueue] = useState(todo.queue)
	const [completed, setCompleted] = useState(todo.completed)
	const itemRef = useRef(null)

	//to handle bug where onMouseLeave doesn't trigger if you move too fast
	const handleHoverOutside = (e) => {
		if (itemRef.current && !itemRef.current.contains(e.target)) {
			setIsHovered(false)
		}
	}

	useEffect(() => {
		if (isHovered) {
			document.addEventListener('mouseover', handleHoverOutside)
		} else {
			document.removeEventListener('mouseover', handleHoverOutside)
		}

		return () => {
			document.removeEventListener('mouseover', handleHoverOutside)
		}
	}, [isHovered])

	const handleToggleCompleted = async () => {
		try {
			await axios.put(`/api/todos/${todo._id}`, {
				completed: !completed,
				queue: false
			})
			setCompleted(!completed)
			setInQueue(false)
			fetchData()
		} catch (err) {
			console.log(err)
		}
	}

	const handleToggleQueue = async () => {
		try {
			await axios.put(`/api/todos/${todo._id}`, {
				queue: !inQueue,
			})
			setInQueue(!inQueue)
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

	return (
		<li className="cursor-pointer rounded-xl mx-2 transition-all flex justify-between items-center border">
			{editing == todo._id ? (
				<EditItemForm
					todo={todo}
					setEditing={setEditing}
					currentList={currentList}
					fetchData={fetchData}
					inputRef={inputRef}
				/>
			) : (
				<div
					className="flex justify-between items-center w-full p-2"
					onMouseOver={() => {
						setIsHovered(true)
					}}
					onMouseLeave={() => {
						setIsHovered(false)
					}}
					ref={itemRef}
				>
					<div className="flex items-center gap-2">
						<Checkbox
							id="remember"
							className="focus:outline-none focus:ring-0 text-black"
							style={{ boxShadow: 'none' }}
							checked={completed}
							onChange={handleToggleCompleted}
						/>
						<Label htmlFor="remember">{todo.task}</Label>
					</div>
					{isHovered ? (
						<div className="flex items-center gap-2">
							{!completed && (
								<Tooltip
									content={
										inQueue
											? 'Remove from scheduling queue'
											: 'Add to scheduling queue'
									}
									style="dark"
									animation="duration-300"
									arrow={false}
									className="bg-gray-800 text-xs"
								>
									<div
										className={
											'hover:bg-gray-200 rounded-lg' +
											(!inQueue && ' opacity-50')
										}
									>
										<BiCalendarPlus size={21} onClick={handleToggleQueue} />
									</div>
								</Tooltip>
							)}
							{!completed && (
								<Tooltip
									content="Edit todo"
									style="dark"
									animation="duration-300"
									arrow={false}
									className="bg-gray-800 text-xs"
								>
									<div className="hover:bg-gray-200 rounded-lg">
										<BiPencil
											size={21}
											onClick={() => {
												setEditing(todo._id)
												setIsHovered(false)
											}}
										/>
									</div>
								</Tooltip>
							)}
							<Tooltip
								content="Delete todo"
								style="dark"
								animation="duration-300"
								arrow={false}
								className="bg-gray-800 text-xs"
							>
								<div className="hover:bg-gray-200 rounded-lg">
									<BiTrash size={21} onClick={handleDelete} />
								</div>
							</Tooltip>
						</div>
					) : (
						<div className="flex gap-2">
							<span className="opacity-75">
								{convertMinutesToTime(todo.duration)}
							</span>
							{todo.date && (
								<span>{formatDateToMonthDay(new Date(todo.date))}</span>
							)}
						</div>
					)}
				</div>
			)}
		</li>
	)
}
