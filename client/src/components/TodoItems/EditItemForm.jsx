import { useEffect, useState } from 'react'
import { TextInput, Button, Dropdown, DropdownItem } from 'flowbite-react'
import { DatePicker } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import axios from 'axios'

export default function EditItemForm({
	todo,
	setEditing,
	fetchData,
	inputRef,
}) {
	const [newTodo, setNewTodo] = useState(todo.task)
	const [selectedDate, setSelectedDate] = useState(todo.date)
	const [selectedDuration, setSelectedDuration] = useState(todo.duration)

	const durationOptions = [
		...Array.from({ length: 25 }, (_, i) => i * 15)
			.map((minutes) => {
				const hours = Math.floor(minutes / 60)
				const mins = minutes % 60
				if (hours === 0 && mins === 0) return null
				return {
					label: `${hours ? `${hours}h ` : ''}${mins ? `${mins}m` : ''}`,
					value: minutes,
				}
			})
			.filter((option) => option !== null), // Filter out null options
		{ label: '12h', value: 720 },
		{ label: '1 day', value: 1440 },
	]

	useEffect(() => {
		if (inputRef && inputRef.current) {
			inputRef.current.focus()
		}
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			if (!newTodo) return
			await axios.put(`/api/todos/${todo._id}`, {
				task: newTodo,
				duration: selectedDuration,
				date: selectedDate,
			})
			setNewTodo('')
			setEditing(null)
			fetchData()
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<form className="w-full p-2 space-y-2" onSubmit={handleSubmit}>
			<TextInput
				ref={inputRef}
				type="text"
				placeholder="New Todo"
				value={newTodo}
				onChange={(e) => setNewTodo(e.target.value)}
			/>
			<div className="flex justify-between gap-2 w-full">
				<DatePicker
					oneTap
					placeholder="Select Due Date"
					defaultValue={selectedDate ? new Date(selectedDate) : null}
					className="w-3/6"
					onSelect={(date) => {
						date.setHours(23, 59, 59, 999) //set date to latest possible time
						setSelectedDate(date)
					}}
					onClean={() => {
						setSelectedDate(null)
					}}
				/>
				<div className="w-1/2 border rounded-md p-2 hover:bg-gray-50 flex justify-center">
					<Dropdown
						className="h-80 overflow-y-auto"
						inline
						color="light"
						label={`Duration: ${
							durationOptions.find(
								(option) => option.value === selectedDuration
							)?.label
						}`}
					>
						{durationOptions.map((option) => (
							<DropdownItem
								key={option.value}
								onClick={() => setSelectedDuration(option.value)}
							>
								{option.label}
							</DropdownItem>
						))}
					</Dropdown>
				</div>
			</div>

			<div className="mt-2 flex gap-2 justify-center items-center">
				<Button
					color="gray"
					className="w-full"
					onClick={() => {
						setEditing(null)
						setNewTodo('')
					}}
				>
					Cancel
				</Button>
				<Button color="gray" className="w-full" onClick={handleSubmit}>
					Submit
				</Button>
			</div>
		</form>
	)
}