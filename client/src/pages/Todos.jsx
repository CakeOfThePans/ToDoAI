import TodoListView from '../components/TodoLists/TodoListView'
import TodoItemView from '../components/TodoItems/TodoItemView'
import TodoCalendarView from '../components/TodoCalendar/TodoCalendarView'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Chatbox from '../components/Chatbox/Chatbox'
import { useView } from '../contexts/ViewContext'

export default function Todos() {
	const { currentList } = useSelector((state) => state.list)
	const { currentUser } = useSelector((state) => state.user)
	const { view } = useView()
	const [todos, setTodos] = useState([])
	const [selectedTodo, setSelectedTodo] = useState(null)
	const [listName, setListName] = useState('')
	const [hideCompleted, setHideCompleted] = useState(true)
	const [showOverdueOnly, setShowOverdueOnly] = useState(false)
	const [showScheduledOnly, setShowScheduledOnly] = useState(false)
	const [dragging, setDragging] = useState(false) //for calendar dragging to unschedule
	const dropZoneRef = useRef(null)
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
	const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1320)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
			setIsSmallScreen(window.innerWidth < 1320)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		fetchData()
	}, [currentList, hideCompleted, showOverdueOnly, showScheduledOnly])

	const fetchData = async (task) => {
		try {
			let res
			let query = `hideCompleted=${hideCompleted}&showOverdueOnly=${showOverdueOnly}&showScheduledOnly=${showScheduledOnly}`
			if (task != undefined) query += `&task=${task}`

			if (currentList === 'Inbox') {
				res = await axios.get(`/api/todos/${currentUser.defaultList}?${query}`)
				setListName('Inbox')
			} else if (currentList === 'Today') {
				res = await axios.get(`/api/todos?today=true&${query}`)
				setListName('Today')
			} else if (currentList === 'Upcoming') {
				res = await axios.get(`/api/todos?upcoming=true&${query}`)
				setListName('Upcoming')
			} else {
				res = await axios.get(`/api/todos/${currentList}?${query}`)
				const res2 = await axios.get(`/api/lists/${currentList}`)
				setListName(res2.data.name)
			}
			setTodos(res.data)
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="flex h-full bg-gray-50">
			<TodoListView todos={todos} fetchTodoData={fetchData} />
			<div
				className={
					isSmallScreen && view !== 'todos'
						? 'hidden'
						: isSmallScreen
						? 'flex-grow flex-shrink min-w-0 flex flex-col h-full mx-4'
						: 'flex-shrink-0 flex flex-col h-full w-[500px] mx-4'
				}
			>
				<TodoItemView
					todos={todos}
					setTodos={setTodos}
					selectedTodo={selectedTodo}
					setSelectedTodo={setSelectedTodo}
					fetchData={fetchData}
					currentList={currentList}
					listName={listName}
					hideCompleted={hideCompleted}
					setHideCompleted={setHideCompleted}
					showOverdueOnly={showOverdueOnly}
					setShowOverdueOnly={setShowOverdueOnly}
					showScheduledOnly={showScheduledOnly}
					setShowScheduledOnly={setShowScheduledOnly}
					dragging={dragging}
					dropZoneRef={dropZoneRef}
					isCalendarVisible={
						!isSmallScreen || (isSmallScreen && view === 'calendar')
					}
				/>
			</div>
			{!isSmallScreen ? (
				<div className="flex-grow flex-shrink min-w-0 flex flex-col h-full overflow-hidden">
					<TodoCalendarView
						todos={todos}
						setSelectedTodo={setSelectedTodo}
						fetchData={fetchData}
						dragging={dragging}
						setDragging={setDragging}
						dropZoneRef={dropZoneRef}
					/>
				</div>
			) : view === 'calendar' ? (
				<div className="flex-grow flex-shrink min-w-0 flex flex-col h-full overflow-hidden ml-4">
					<TodoCalendarView
						todos={todos}
						setSelectedTodo={setSelectedTodo}
						fetchData={fetchData}
						dragging={dragging}
						setDragging={setDragging}
						dropZoneRef={dropZoneRef}
					/>
				</div>
			) : null}
			<Chatbox fetchData={fetchData} />
		</div>
	)
}
