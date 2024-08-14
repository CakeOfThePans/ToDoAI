import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setList } from '../../redux/listSlice'
import { Button } from 'flowbite-react'
import CreateListForm from './CreateListForm'
import TodoList from './TodoList'
import DefaultTodoList from './DefaultTodoList'

export default function TodoListView({ todos }) {
	const { currentList } = useSelector((state) => state.list)
	const [defaultLists, setDefaultLists] = useState([])
	const [lists, setLists] = useState([])
	const [creating, setCreating] = useState(false)
	const [editing, setEditing] = useState(null) //only one list can be edited at a time
	const inputRef = useRef(null)
	const dispatch = useDispatch()

	useEffect(() => {
		//reset states when todos/list changes
		setCreating(false)
		setEditing(null)
		fetchData()
	}, [todos, currentList])

	const fetchData = async () => {
		try {
			const res = await axios.get(`/api/lists`)
			//ignore the first list which is Inbox
			const [inbox, ...rest] = res.data
			setLists(rest)

			//todo count for default lists
			const res2 = await axios.get('/api/todos/defaultCount')
			setDefaultLists(res2.data)
		} catch (err) {
			console.log(err)
		}
	}

	const handleClick = (e) => {
		if (e.target.id && currentList != e.target.id) {
			dispatch(setList(e.target.id))
		}
	}

	return (
		<div className="flex flex-col bg-white border-r border-gray-200 w-64">
			<div className="flex flex-col overflow-y-auto">
				<ul className="list-none border-b border-gray-200 gap-2 py-2">
					{defaultLists.map((defaultList, i) => {
						return (
							<DefaultTodoList
								list={defaultList}
								handleClick={handleClick}
								key={defaultList.name}
								currentList={currentList}
							/>
						)
					})}
				</ul>
				<ul className="list-none py-2 gap-2">
					{lists.map((list) => {
						return (
							<TodoList
								list={list}
								fetchData={fetchData}
								handleClick={handleClick}
								key={list._id}
								currentList={currentList}
								editing={editing}
								setEditing={setEditing}
								inputRef={inputRef}
							/>
						)
					})}
				</ul>
			</div>
			{creating ? (
				<CreateListForm setCreating={setCreating} fetchData={fetchData} inputRef={inputRef}/>
			) : (
				<Button
					color="light"
					className="mx-2 mb-4"
					onClick={() => setCreating(true)}
				>
					+ Create New List
				</Button>
			)}
		</div>
	)
}
