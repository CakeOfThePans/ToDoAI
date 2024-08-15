import TodoListView from '../components/TodoLists/TodoListView'
import TodoItemView from '../components/TodoItems/TodoItemView'
import TodoCalendarView from '../components/TodoCalendar/TodoCalendarView'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

export default function Todos() {
	const [todos, setTodos] = useState([])
	const { currentList } = useSelector((state) => state.list)
	const { currentUser } = useSelector((state) => state.user)
	const [listName, setListName] = useState('')
	const [showInQueueOnly, setShowInQueueOnly] = useState(false)
	const [hideCompleted, setHideCompleted] = useState(true)
	const [showOverdueOnly, setShowOverdueOnly] = useState(false)

	useEffect(() => {
		fetchData()
	}, [currentList, showInQueueOnly, hideCompleted, showOverdueOnly])

	const fetchData = async (task) => {
		try {
			let res
			let query = `showInQueueOnly=${showInQueueOnly}&hideCompleted=${hideCompleted}&showOverdueOnly=${showOverdueOnly}`
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
			} else if (currentList === 'In Queue') {
				res = await axios.get(`/api/todos?inQueue=true&${query}`)
				setListName('In Queue')
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
		<div className="flex h-full">
			<TodoListView todos={todos} />
			<TodoItemView
				todos={todos}
				setTodos={setTodos}
				fetchData={fetchData}
				currentList={currentList}
				listName={listName}
				showInQueueOnly={showInQueueOnly}
				setShowInQueueOnly={setShowInQueueOnly}
				hideCompleted={hideCompleted}
				setHideCompleted={setHideCompleted}
				showOverdueOnly={showOverdueOnly}
				setShowOverdueOnly={setShowOverdueOnly}
			/>
			<TodoCalendarView />
		</div>
	)
}
