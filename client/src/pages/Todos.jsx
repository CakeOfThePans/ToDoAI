import TodoListView from '../components/TodoLists/TodoListView'
import TodoItemView from '../components/TodoItems/TodoItemView'
import TodoCalendarView from '../components/TodoCalendar/TodoCalendarView'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Chatbox from '../components/Chatbox/Chatbox'

export default function Todos() {
	const { currentList } = useSelector((state) => state.list)
	const { currentUser } = useSelector((state) => state.user)
	const [todos, setTodos] = useState([])
	const [listName, setListName] = useState('')
	// const [showInQueueOnly, setShowInQueueOnly] = useState(false)
	const [hideCompleted, setHideCompleted] = useState(true)
	const [showOverdueOnly, setShowOverdueOnly] = useState(false)
	const [showScheduledOnly, setShowScheduledOnly] = useState(false)
	const [dragging, setDragging] = useState(false)	//for calendar dragging to unschedule
	const dropZoneRef = useRef(null)

	useEffect(() => {
		fetchData()
	// }, [currentList, showInQueueOnly, hideCompleted, showOverdueOnly, showScheduledOnly])
	}, [currentList, hideCompleted, showOverdueOnly, showScheduledOnly])


	const fetchData = async (task) => {
		try {
			let res
			// let query = `showInQueueOnly=${showInQueueOnly}&hideCompleted=${hideCompleted}&showOverdueOnly=${showOverdueOnly}&showScheduledOnly=${showScheduledOnly}`
			let query = `hideCompleted=${hideCompleted}&showOverdueOnly=${showOverdueOnly}&showScheduledOnly=${showScheduledOnly}`
			if(task != undefined) query += `&task=${task}`
			
			if (currentList === 'Inbox') {
				res = await axios.get(`/api/todos/${currentUser.defaultList}?${query}`)
				setListName('Inbox')
			} else if (currentList === 'Today') {
				res = await axios.get(`/api/todos?today=true&${query}`)
				setListName('Today')
			} else if (currentList === 'Upcoming') {
				res = await axios.get(`/api/todos?upcoming=true&${query}`)
				setListName('Upcoming')
			// } else if (currentList === 'In Queue') {
			// 	res = await axios.get(`/api/todos?inQueue=true&${query}`)
			// 	setListName('In Queue')
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
			<TodoListView todos={todos} />
			<TodoItemView
				todos={todos}
				setTodos={setTodos}
				fetchData={fetchData}
				currentList={currentList}
				listName={listName}
				// showInQueueOnly={showInQueueOnly}
				// setShowInQueueOnly={setShowInQueueOnly}
				hideCompleted={hideCompleted}
				setHideCompleted={setHideCompleted}
				showOverdueOnly={showOverdueOnly}
				setShowOverdueOnly={setShowOverdueOnly}
				showScheduledOnly={showScheduledOnly}
				setShowScheduledOnly={setShowScheduledOnly}
				dragging={dragging}
				dropZoneRef={dropZoneRef}
			/>
			<TodoCalendarView todos={todos} fetchData={fetchData} dragging={dragging} setDragging={setDragging} dropZoneRef={dropZoneRef}/>
			<Chatbox fetchData={fetchData}/>
		</div>
	)
}
