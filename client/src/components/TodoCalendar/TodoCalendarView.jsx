import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import './css/calendarStyles.css'
import { Checkbox, Label } from 'flowbite-react'

export default function TodoCalendarView({
	todos,
	fetchData,
	setDragging,
	dropZoneRef,
}) {
	// const defaultLists = ['Today', 'Upcoming', 'In Queue']
	const defaultLists = ['Today', 'Upcoming']
	const { currentList } = useSelector((state) => state.list)
	const { currentUser } = useSelector((state) => state.user)
	const [events, setEvents] = useState([])
	const [inputInfo, setInputInfo] = useState(null)
	const inputRef = useRef(null)
	const calendarRef = useRef(null)

	useEffect(() => {
		fetchEvents()
	}, [todos])

	const fetchEvents = async () => {
		try {
			const res = await axios.get('/api/todos?showScheduledOnly=true')
			const events = res.data.map((todo) => {
				return {
					id: todo._id,
					start: todo.startDate,
					end: todo.endDate,
					title: todo.task,
					completed: todo.completed,
				}
			})
			setEvents(events)
			setInputInfo(null)
		} catch (err) {
			console.log(err)
		}
	}

	const handleToggleCompleted = async (e, completed) => {
		try {
			await axios.put(`/api/todos/${e.target.id}`, {
				completed: !completed,
			})
			fetchData()
		} catch (err) {
			console.log(err)
		}
	}

	const renderEventContent = (eventContent) => {
		const { completed } = eventContent.event.extendedProps

		return (
			<div className="flex items-center px-1 gap-2 h-full">
				<Checkbox
					className="focus:outline-none focus:ring-0 text-gray-700"
					style={{ boxShadow: 'none' }}
					checked={completed || false}
					onClick={(e) => handleToggleCompleted(e, completed)}
					readOnly
					id={eventContent.event.id}
				/>
				<Label className="text-sm truncate text-wrap text-white overflow-hidden whitespace-normal max-h-full">
					{eventContent.event.title}
				</Label>
			</div>
		)
	}

	const handleEventDragStart = () => {
		setDragging(true)
	}

	const handleEventDragStop = async (info) => {
		setDragging(false)
		if (dropZoneRef.current) {
			const dropZoneRect = dropZoneRef.current.getBoundingClientRect()
			const { jsEvent } = info
			const dropX = jsEvent.clientX
			const dropY = jsEvent.clientY

			// Check if the drop position is within the drop zone
			if (
				dropX >= dropZoneRect.left &&
				dropX <= dropZoneRect.right &&
				dropY >= dropZoneRect.top &&
				dropY <= dropZoneRect.bottom
			) {
				try {
					const { event } = info
					await axios.put(`/api/todos/${event.id}`, {
						startDate: null,
						endDate: null,
						scheduled: false,
					})
					fetchData()
				} catch (err) {
					console.log(err)
				}
			}
		}
	}

	const handleSelect = (info) => {
		const { start, end, jsEvent } = info
		setInputInfo({
			start,
			end,
			position: {
				top: jsEvent.pageY,
				left: jsEvent.pageX < window.innerWidth - 185 ? jsEvent.pageX : jsEvent.pageX - 185,	//don't expand the width
			},
		})
		// Focus input field after render
		setTimeout(() => {
			if (inputRef.current) {
				inputRef.current.focus()
			}
		}, 0)
	}

	const handleInputBlur = () => {
		setInputInfo(null)
	}

	const handleEnter = async (event) => {
		if (event.key === 'Enter') {
			const eventName = event.target.value.trim()
			if (eventName) {
				const listId = defaultLists.includes(currentList)
					? currentUser.defaultList
					: currentList
				try {
					const res = await axios.post('/api/todos', {
						listId: listId,
						task: eventName,
						startDate: inputInfo.start,
						endDate: inputInfo.end,
						duration: Math.floor((inputInfo.end - inputInfo.start) / 1000 / 60),
						scheduled: true,
					})

					fetchData() // Refetch the data after adding the event
				} catch (err) {
					console.log(err)
				}
				setInputInfo(null)
			}
		}
	}

	const handleEventUpdate = async (info) => {
		const { event } = info
		try {
			await axios.put(`/api/todos/${event.id}`, {
				startDate: event.start,
				endDate: event.end,
				duration: Math.floor((event.end - event.start) / 1000 / 60),
				scheduled: true,
				// queue: false,
				completed: false,
			})
			fetchData()
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="bg-white border border-gray-200 flex-grow m-4 rounded-xl p-4 text-nowrap">
			<FullCalendar
				ref={calendarRef}
				plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
				initialView="timeGridWeek"
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'timeGridWeek,timeGridDay,listWeek',
				}}
				height="100%"
				slotDuration="00:15:00"
				slotLabelInterval="01:00:00"
				displayEventTime={false}
				allDaySlot={false}
				nowIndicator={true}
				eventContent={renderEventContent}
				editable
				selectable
				droppable
				events={events}
				select={handleSelect}
				eventChange={handleEventUpdate}
				eventReceive={handleEventUpdate}
				eventDragStart={handleEventDragStart}
				eventDragStop={handleEventDragStop}
			/>

			{inputInfo && (
				<input
					type="text"
					placeholder="New Todo"
					className="absolute bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
					style={{
						top: `${inputInfo.position.top}px`,
						left: `${inputInfo.position.left}px`,
						zIndex: 1000,
					}}
					ref={inputRef}
					onBlur={handleInputBlur}
					onKeyDown={handleEnter}
				/>
			)}
		</div>
	)
}
