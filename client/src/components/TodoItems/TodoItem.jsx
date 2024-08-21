import { useEffect, useRef, useState } from 'react'
import { Checkbox, Label } from 'flowbite-react'
import axios from 'axios'
import EditItemForm from './EditItemForm'
import HoverOptions from './HoverOptions'

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

	useEffect(() => {
		//update hover options when todo has been updated
		setInQueue(todo.queue)
		setCompleted(todo.completed)
	}, [todo])

	const handleToggleCompleted = async () => {
		try {
			await axios.put(`/api/todos/${todo._id}`, {
				completed: !completed,
				queue: false,
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


	function formatDateToTime(date) {
		const options = {
		  month: 'long',
		  day: 'numeric',
		  hour: '2-digit',
		  minute: '2-digit',
		  hour12: true // Enables AM/PM format
		};
		return date.toLocaleString('en-US', options);
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
					<div className="flex items-center gap-2 w-1/2">
						<Checkbox
							className="focus:outline-none focus:ring-0 text-gray-700"
							style={{ boxShadow: 'none' }}
							checked={completed}
							onChange={handleToggleCompleted}
						/>
						<Label className='truncate text-wrap'>{todo.task}</Label>
					</div>
					{isHovered ? (
						<HoverOptions
							completed={completed}
							inQueue={inQueue}
							handleToggleQueue={handleToggleQueue}
							setEditing={setEditing}
							setIsHovered={setIsHovered}
							handleDelete={handleDelete}
							todo={todo}
						/>
					) : (
						<div className="flex gap-2">
							{todo.endDate && (
								todo.startDate ? (
									<span className='text-nowrap'>{formatDateToTime(new Date(todo.startDate))}</span>
								) : (
									<span className='text-nowrap'>{formatDateToMonthDay(new Date(todo.endDate))}</span>
								)
							)}
							<span className="opacity-75">
								{convertMinutesToTime(todo.duration)}
							</span>
						</div>
					)}
				</div>
			)}
		</li>
	)
}
