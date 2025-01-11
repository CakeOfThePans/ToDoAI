import {
	BiCalendarEvent,
	BiCheckCircle,
	BiSearchAlt2,
	BiTime,
} from 'react-icons/bi'
import { TextInput } from 'flowbite-react'
import { useEffect, useRef } from 'react'
import { Tooltip, Whisper } from 'rsuite'

export default function TodoItemHeader({
	listName,
	hideCompleted,
	setHideCompleted,
	showOverdueOnly,
	setShowOverdueOnly,
	searching,
	setSearching,
	showScheduledOnly,
	setShowScheduledOnly,
	fetchData,
}) {
	const searchRef = useRef(null)

	useEffect(() => {
		if (searching) {
			searchRef.current.focus()
		}
		//if searching is toggled off refetch data
		else {
			fetchData()
		}
	}, [searching])

	return (
		<div className="flex items-center justify-between border-b px-4 py-4 shadow-sm h-16">
			{searching ? (
				<TextInput
					sizing="md"
					placeholder="Search todos"
					className="w-full mr-2"
					onChange={(e) => {
						fetchData(e.target.value)
					}}
					ref={searchRef}
				/>
			) : (
				<span className="font-medium underline text-xl truncate">
					# {listName}
				</span>
			)}
			<div className="flex items-center gap-1">
				<Whisper
					placement="top"
					trigger="hover"
					speaker={
						<Tooltip className="bg-gray-800 text-xs p-2">Search</Tooltip>
					}
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
								'cursor-pointer text-gray-700' +
								(searching ? ' text-opacity-100' : ' text-opacity-50')
							}
						/>
					</div>
				</Whisper>
				<Whisper
					placement="top"
					trigger="hover"
					speaker={
						<Tooltip className="bg-gray-800 text-xs p-2">
							Show scheduled todos only
						</Tooltip>
					}
				>
					<div
						className="hover:bg-gray-200 p-1 rounded-lg"
						onClick={() => {
							setShowScheduledOnly(!showScheduledOnly)
						}}
					>
						<BiCalendarEvent
							size={22}
							className={
								'cursor-pointer text-gray-700' +
								(showScheduledOnly ? ' text-opacity-100' : ' text-opacity-50')
							}
						/>
					</div>
				</Whisper>
				<Whisper
					placement="top"
					trigger="hover"
					speaker={
						<Tooltip className="bg-gray-800 text-xs p-2">
							Show completed todos
						</Tooltip>
					}
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
				</Whisper>
				<Whisper
					placement="top"
					trigger="hover"
					speaker={
						<Tooltip className="bg-gray-800 text-xs p-2">
							Show overdue todos only
						</Tooltip>
					}
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
				</Whisper>
			</div>
		</div>
	)
}
