import { AiOutlineCloseCircle } from 'react-icons/ai'
import { BiPencil, BiTrash, BiCopy } from 'react-icons/bi'
import { Tooltip, Whisper } from 'rsuite'

export default function TodoOptions({
	completed,
	setEditing,
	setSelectedTodo,
	handleDelete,
	handleDuplicate,
	todo,
}) {
	return (
		<div className="flex items-center gap-2">
			{!completed && (
				<Whisper
					placement="top"
					trigger="hover"
					speaker={
						<Tooltip className="bg-gray-800 text-xs p-2">Edit todo</Tooltip>
					}
				>
					<div className="hover:bg-gray-200 text-gray-600 rounded-lg">
						<BiPencil
							size={20}
							onClick={() => {
								setEditing(todo._id)
							}}
						/>
					</div>
				</Whisper>
			)}
			<Whisper
				placement="top"
				trigger="hover"
				speaker={
					<Tooltip className="bg-gray-800 text-xs p-2">Duplicate todo</Tooltip>
				}
			>
				<div className="hover:bg-gray-200 text-gray-600 rounded-lg">
					<BiCopy size={20} onClick={handleDuplicate} />
				</div>
			</Whisper>
			<Whisper
				placement="top"
				trigger="hover"
				speaker={
					<Tooltip className="bg-gray-800 text-xs p-2">Delete todo</Tooltip>
				}
			>
				<div className="hover:bg-gray-200 text-gray-600 rounded-lg">
					<BiTrash size={20} onClick={handleDelete} />
				</div>
			</Whisper>
			<Whisper
				placement="top"
				trigger="hover"
				speaker={
					<Tooltip className="bg-gray-800 text-xs p-2">
						Close todo options
					</Tooltip>
				}
			>
				<div className="flex gap-2 items-center">
					<AiOutlineCloseCircle
						size={20}
						className="text-gray-600"
						onClick={() => setSelectedTodo(null)}
					/>
				</div>
			</Whisper>
		</div>
	)
}
