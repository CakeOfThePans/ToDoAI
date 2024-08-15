import { useEffect, useRef, useState } from 'react'
import { Button } from 'flowbite-react'
import TodoItem from './TodoItem'
import CreateItemForm from './CreateItemForm'
import TodoItemHeader from './TodoItemHeader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import axios from 'axios'

export default function TodoItemView({
	todos,
	setTodos,
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

	useEffect(() => {
		//reset states when list changes
		setSearching(false)
		setCreating(false)
		setEditing(null)
	}, [currentList])

	const handleDragEnd = async (result) => {
		if(!result.destination) return

		const { source, destination } = result
		if(source.index == destination.index) return

		const items = Array.from(todos)
		const [movedList] = items.splice(source.index, 1)
		items.splice(destination.index, 0, movedList)
		setTodos(items)

		try{
			await axios.post(`/api/todos/updateOrder/${currentList}`, {
				sourceIndex: todos[source.index].order,	//based on actual todo order in case of filters
				destinationIndex: todos[destination.index].order
			})
			fetchData() //refetch data in case anything is off (mainly for any header options)
		}
		catch(err){
			console.log(err)
		}
	}

	return (
		<div className="flex flex-col bg-white border border-gray-200 w-96 m-4 rounded-xl">
			<TodoItemHeader
				listName={listName}
				showInQueueOnly={showInQueueOnly}
				setShowInQueueOnly={setShowInQueueOnly}
				hideCompleted={hideCompleted}
				setHideCompleted={setHideCompleted}
				showOverdueOnly={showOverdueOnly}
				setShowOverdueOnly={setShowOverdueOnly}
				searching={searching}
				setSearching={setSearching}
				fetchData={fetchData}
			/>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="droppable">
					{(provided) => (
						<ul 
							className="overflow-y-auto list-none my-2"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{todos.map((todo, index) => {
								return (
									<Draggable key={todo._id} draggableId={todo._id} index={index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className='mb-1'
											>
												<TodoItem
													todo={todo}
													fetchData={fetchData}
													key={todo._id}
													currentList={currentList}
													editing={editing}
													setEditing={setEditing}
													inputRef={inputRef}
												/>
											</div>
										)}
									</Draggable>
								)
							})}
							{provided.placeholder}
						</ul>
						)}
				</Droppable>
			</DragDropContext>
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
