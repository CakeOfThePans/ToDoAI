import { Tooltip } from 'flowbite-react'
import { BiCalendarPlus, BiPencil, BiTrash } from 'react-icons/bi'

export default function HoverOptions({
	completed,
	inQueue,
	handleToggleQueue,
	setEditing,
	setIsHovered,
	handleDelete,
    todo
}) {
	return (
		<div className="flex items-center gap-2">
			{(!completed && !todo.scheduled) && (
				<Tooltip
					content={
						inQueue ? 'Remove from scheduling queue' : 'Add to scheduling queue'
					}
					style="dark"
					animation="duration-300"
					arrow={false}
					className="bg-gray-800 text-xs"
				>
					<div
						className={
							'hover:bg-gray-200 rounded-lg' + (!inQueue && ' opacity-50')
						}
					>
						<BiCalendarPlus size={21} onClick={handleToggleQueue} />
					</div>
				</Tooltip>
			)}
			{!completed && (
				<Tooltip
					content="Edit todo"
					style="dark"
					animation="duration-300"
					arrow={false}
					className="bg-gray-800 text-xs"
				>
					<div className="hover:bg-gray-200 rounded-lg">
						<BiPencil
							size={21}
							onClick={() => {
								setEditing(todo._id)
								setIsHovered(false)
							}}
						/>
					</div>
				</Tooltip>
			)}
			<Tooltip
				content="Delete todo"
				style="dark"
				animation="duration-300"
				arrow={false}
				className="bg-gray-800 text-xs"
			>
				<div className="hover:bg-gray-200 rounded-lg">
					<BiTrash size={21} onClick={handleDelete} />
				</div>
			</Tooltip>
		</div>
	)
}
