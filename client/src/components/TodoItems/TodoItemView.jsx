import { useEffect, useRef, useState } from 'react'
import { Button, TextInput, Tooltip } from 'flowbite-react'
import TodoItem from './TodoItem'
import CreateItemForm from './CreateItemForm'
import { BiCalendar, BiCheckCircle, BiSearchAlt2, BiTime } from 'react-icons/bi'

export default function TodoItemView({
	todos,
	fetchData,
	currentList,
	listName,
	showInQueueOnly,
	setShowInQueueOnly,
	hideCompleted,
	setHideCompleted,
	showOverdueOnly,
	setShowOverdueOnly,
}) {
	const defaultLists = ['Today', 'Upcoming', 'In Queue']
	const [searching, setSearching] = useState(false)
	const [creating, setCreating] = useState(false)
	const [editing, setEditing] = useState(null) //only one todo can be edited at a time
	const inputRef = useRef(null)
	const searchRef = useRef(null)

	useEffect(() => {
		//reset states when list changes
		setSearching(false)
		setCreating(false)
		setEditing(null)
	}, [currentList])

	useEffect(() => {
		if(searching){
			searchRef.current.focus()
		}
		//if searching is toggled off refetch data
		else{
			fetchData()
		}
	}, [searching])

	return (
		<div className="flex flex-col bg-white border border-gray-200 w-96 m-4 rounded-xl">
			<div className="flex items-center justify-between border-b px-4 py-4 shadow-sm h-16">
				{searching ? (
					<TextInput 
						sizing="md"
						placeholder='Search todos'
						className='w-full mr-2'
						onChange={(e) => {
							fetchData(e.target.value)
						}}
						ref={searchRef}
					/>
				) : (
					<span className="font-medium underline text-xl truncate"># {listName}</span>
				)}
				<div className="flex items-center gap-1">
					<Tooltip
						content="Search"
						style="dark"
						animation="duration-300"
						arrow={false}
						className="bg-gray-800 text-xs"
					>
						<div
							className="hover:bg-gray-200 p-1 rounded-lg"
							onClick={() => {
								setSearching(!searching)
							}}
						>
							<BiSearchAlt2
								size={22}
								className={
									"cursor-pointer text-gray-700" + 
									(searching ? ' text-opacity-100' : ' text-opacity-50')
								}
							/>
						</div>
					</Tooltip>
					<Tooltip
						content="Show in queue todos only"
						style="dark"
						animation="duration-300"
						arrow={false}
						className="bg-gray-800 text-xs"
					>
						<div
							className="hover:bg-gray-200 p-1 rounded-lg"
							onClick={() => {
								setShowInQueueOnly(!showInQueueOnly)
							}}
						>
							<BiCalendar
								size={22}
								className={
									'cursor-pointer text-gray-700' +
									(showInQueueOnly ? ' text-opacity-100' : ' text-opacity-50')
								}
							/>
						</div>
					</Tooltip>
					<Tooltip
						content="Show completed todos"
						style="dark"
						animation="duration-300"
						arrow={false}
						className="bg-gray-800 text-xs"
					>
						<div
							className="hover:bg-gray-200 p-1 rounded-lg"
							onClick={() => {
								setHideCompleted(!hideCompleted)
							}}
						>
							<BiCheckCircle
								size={22}
								className={
									'cursor-pointer text-gray-700' +
									(hideCompleted ? ' text-opacity-50' : ' text-opacity-100')
								}
							/>
						</div>
					</Tooltip>
					<Tooltip
						content="Show overdue todos only"
						style="dark"
						animation="duration-300"
						arrow={false}
						className="bg-gray-800 text-xs"
					>
						<div
							className="hover:bg-gray-200 p-1 rounded-lg"
							onClick={() => {
								setShowOverdueOnly(!showOverdueOnly)
							}}
						>
							<BiTime
								size={22}
								className={
									'cursor-pointer text-gray-700' +
									(showOverdueOnly ? ' text-opacity-100' : ' text-opacity-50')
								}
							/>
						</div>
					</Tooltip>
				</div>
			</div>
			<div className="flex flex-col overflow-y-auto">
				<ul className="list-none my-2 space-y-1">
					{todos.map((todo) => {
						return (
							<TodoItem
								todo={todo}
								fetchData={fetchData}
								key={todo._id}
								currentList={currentList}
								editing={editing}
								setEditing={setEditing}
								inputRef={inputRef}
							/>
						)
					})}
				</ul>
			</div>
			{!defaultLists.includes(currentList) &&
				(creating ? (
					<CreateItemForm
						setCreating={setCreating}
						fetchData={fetchData}
						currentList={currentList}
						inputRef={inputRef}
					/>
				) : (
					<Button
						color="light"
						className="mx-2 mb-4"
						onClick={() => setCreating(true)}
					>
						+ Create New Todo
					</Button>
				))}
		</div>
	)
}
