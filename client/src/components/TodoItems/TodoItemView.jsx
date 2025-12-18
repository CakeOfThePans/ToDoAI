import { useEffect, useRef, useState } from 'react'
import { Button } from 'flowbite-react'
import TodoItem from './TodoItem'
import CreateItemForm from './CreateItemForm'
import TodoItemHeader from './TodoItemHeader'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import axios from 'axios'
import DraggableEvent from '../TodoCalendar/DraggableEvent'

export default function TodoItemView({
	todos,
	setTodos,
	selectedTodo,
	setSelectedTodo,
	fetchData,
	currentList,
	listName,
	hideCompleted,
	setHideCompleted,
	showOverdueOnly,
	setShowOverdueOnly,
	showScheduledOnly,
	setShowScheduledOnly,
	dragging,
	dropZoneRef,
}) {
	const defaultLists = ['Today', 'Upcoming']
	const [searching, setSearching] = useState(false)
	const [creating, setCreating] = useState(false)
	const [editing, setEditing] = useState(null) //only one todo can be edited at a time
	const [isUpdatingOrder, setIsUpdatingOrder] = useState(false)
	const inputRef = useRef(null)

	useEffect(() => {
		//reset states when list changes
		setSearching(false)
		setCreating(false)
		setEditing(null)
	}, [currentList])

	const handleDragEnd = async (result) => {
		if (!result.destination) return

		const { source, destination } = result
		if (source.index == destination.index) return

		setIsUpdatingOrder(true)

		const items = Array.from(todos)
		const [movedList] = items.splice(source.index, 1)
		items.splice(destination.index, 0, movedList)
		setTodos(items)

		try {
			await axios.post(`/api/todos/updateOrder/${currentList}`, {
				sourceIndex: todos[source.index].order, //based on actual todo order in case of filters
				destinationIndex: todos[destination.index].order,
			})
			fetchData() //refetch data in case anything is off (mainly for any header options)
		} catch (err) {
			console.log(err)
		} finally {
			setIsUpdatingOrder(false)
		}
	}

	return (
		<>
			{dragging == true ? (
				<div
					className="z-50 flex items-center justify-center bg-gray-100 border border-gray-200 w-[500px] my-4 rounded-xl h-full"
					ref={dropZoneRef}
				>
					<p className="text-gray-600 text-xl">
						Drop todos here to unschedule them
					</p>
				</div>
			) : (
				<div
					className={`flex flex-col bg-white border border-gray-200 w-full my-4 rounded-xl h-full`}
				>
					<TodoItemHeader
						listName={listName}
						hideCompleted={hideCompleted}
						setHideCompleted={setHideCompleted}
						showOverdueOnly={showOverdueOnly}
						setShowOverdueOnly={setShowOverdueOnly}
						searching={searching}
						setSearching={setSearching}
						showScheduledOnly={showScheduledOnly}
						setShowScheduledOnly={setShowScheduledOnly}
						fetchData={fetchData}
					/>
					<div className="min-h-0 flex flex-col">
						<DragDropContext onDragEnd={handleDragEnd}>
							<Droppable droppableId="droppable">
								{(provided) => (
									<ul
										className="overflow-y-auto list-none flex-1 min-h-0 px-2 my-2"
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{todos.map((todo, index) => {
											return (
												<Draggable
													key={todo._id}
													draggableId={todo._id}
													index={index}
													isDragDisabled={
														defaultLists.includes(currentList) ||
														isUpdatingOrder
													}
												>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															className="mb-1 react-draggable custom-mirror"
														>
															<DraggableEvent
																id={todo._id}
																title={todo.task}
																duration={todo.duration}
																backgroundColor={todo.color}
															>
																<TodoItem
																	todo={todo}
																	selectedTodo={selectedTodo}
																	setSelectedTodo={setSelectedTodo}
																	fetchData={fetchData}
																	key={todo._id}
																	currentList={currentList}
																	editing={editing}
																	setEditing={setEditing}
																	inputRef={inputRef}
																/>
															</DraggableEvent>
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
				</div>
			)}
		</>
	)
}
