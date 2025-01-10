import { useEffect, useState } from 'react'
import { TextInput, Button, Dropdown, DropdownItem, Textarea } from 'flowbite-react'
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
	const [selectedDate, setSelectedDate] = useState(todo.endDate ? new Date(todo.endDate) : null)
	const [selectedTime, setSelectedTime] = useState(todo.startDate ? new Date(todo.startDate) : null)
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

			let startDate = null
			let endDate = null
			let scheduled = false
			// let queue = todo.queue
			//if both date and time have been selected, the startDate and endDate are set
			if(selectedDate && selectedTime){
				startDate = combineDateAndTime(selectedDate, selectedTime)
				endDate = new Date(startDate)
				endDate.setMinutes(endDate.getMinutes() + selectedDuration)
				scheduled = true
				// queue = false
			}
			//if only date is selected, the startDate is null and the endDate is the end of the selected date
			else if(selectedDate){
				endDate = selectedDate
			}
			//if neither is selected, the startDate and endDate is null
			//note that if time is selected with no selected date, it will automatically set it to today

			await axios.put(`/api/todos/${todo._id}`, {
				task: newTodo,
				duration: selectedDuration,
				startDate: startDate,
				endDate: endDate,
				scheduled: scheduled,
				// queue: queue
			})
			setNewTodo('')
			setEditing(null)
			fetchData()
		} catch (err) {
			console.log(err)
		}
	}

	function combineDateAndTime(date, time) {
		const combined = new Date(
		  date.getFullYear(),
		  date.getMonth(),
		  date.getDate(),
		  time.getHours(),
		  time.getMinutes()
		);
		return combined;
	}

	return (
		<form className="w-full p-2 space-y-2" onSubmit={handleSubmit}>
			<Textarea
				ref={inputRef}
				type="text"
				placeholder="New Todo"
				value={newTodo}
				onChange={(e) => setNewTodo(e.target.value)}
			/>
			<div className="flex justify-between gap-2 w-full">
				<DatePicker
					oneTap
					format="MM/dd/yyyy"
					placeholder="Select Date"
					value={selectedDate}
					className="w-5/12"
					onSelect={(date) => {
						date.setHours(23, 59, 59, 999) //set date to latest possible time
						setSelectedDate(date)
					}}
					onClean={() => {
						setSelectedDate(null)
					}}
				/>
				<DatePicker
						format="hh:mm aa"
						showMeridian
						hideMinutes={(minute) => minute % 15 !== 0}
						placeholder="Select Time"
						value={selectedTime}
						className="w-5/12"
						onSelect={(date) => {
							//round the time to the nearest 15 mins
							const ms = 1000 * 60 * 15 // 15 minutes in milliseconds
							date = new Date(Math.round(date.getTime() / ms) * ms)
							setSelectedTime(date)

							//automatically set to today if date hasn't been selected
							setSelectedDate(new Date())
						}}
						onClean={() => {
							setSelectedTime(null)
						}}
					/>
				<div className="w-3/12 border rounded-md p-2 hover:bg-gray-50 flex justify-center">
					<Dropdown
						className="h-80 overflow-y-auto"
						inline
						color="light"
						label={
							durationOptions.find(
								(option) => option.value === selectedDuration
							)?.label
						}
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
					className="w-full focus:ring-0"
					onClick={() => {
						setEditing(null)
						setNewTodo('')
					}}
				>
					Cancel
				</Button>
				<Button color="gray" className="w-full focus:ring-0" onClick={handleSubmit}>
					Update
				</Button>
			</div>
		</form>
	)
}
