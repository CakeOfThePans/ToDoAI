import { Tooltip } from 'flowbite-react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BiPencil, BiTrash } from 'react-icons/bi'

export default function TodoOptions({
	completed,
	setEditing,
	setSelectedTodo,
	handleDelete,
	todo,
}) {
	return (
		<div className="flex items-center gap-2">
			{!completed && (
				<Tooltip
					content="Edit todo"
					style="dark"
					animation="duration-300"
					arrow={false}
					className="bg-gray-800 text-xs"
				>
					<div className="hover:bg-gray-200 text-gray-600 rounded-lg">
						<BiPencil
							size={20}
							onClick={() => {
								setEditing(todo._id)
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
				<div className="hover:bg-gray-200 text-gray-600 rounded-lg">
					<BiTrash size={20} onClick={handleDelete} />
				</div>
			</Tooltip>
			<Tooltip
				content="Close todo options"
				style="dark"
				animation="duration-300"
				arrow={false}
				className="bg-gray-800 text-xs"
			>
				<div className="flex gap-2 items-center">
					<AiOutlineCloseCircle
						size={20}
						className="text-gray-600"
						onClick={() => setSelectedTodo(null)}
					/>
				</div>
			</Tooltip>
		</div>
	)
}
