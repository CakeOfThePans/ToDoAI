import { useState, useRef, useEffect } from 'react'
import { Dropdown, DropdownItem, Modal, Button, DropdownHeader } from 'flowbite-react'
import { HiDotsHorizontal } from 'react-icons/hi'
import axios from 'axios'
import EditListForm from './EditListForm'
import { useDispatch, useSelector } from 'react-redux'
import { setList } from '../../redux/listSlice'
import { CirclePicker } from 'react-color'

export default function TodoList({
	list,
	fetchData,
	fetchTodoData,
	handleClick,
	currentList,
	editing,
	setEditing,
	inputRef,
}) {
	const { currentUser } = useSelector((state) => state.user)
	const [isHovered, setIsHovered] = useState(false)
	const [isClicked, setIsClicked] = useState(false)
	const dropdownRef = useRef(null)
	const [showModal, setShowModal] = useState(false)
	const dispatch = useDispatch()

	const calendarColors = [
		"#7986CB", // Lavender
		"#33B679", // Sage
		"#8E24AA", // Grape
		"#E67C73", // Flamingo
		"#F6BF26", // Banana
		"#F4511E", // Tangerine
		"#039BE5", // Peacock
		"#616161", // Graphite
		"#3F51B5", // Blueberry
		"#0B8043", // Basil
		"#D50000", // Tomato
	];

	const handleClickOutside = (e) => {
		if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
			setIsClicked(false)
		}
	}

	useEffect(() => {
		if (isClicked) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isClicked])

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/lists/${list._id}`)
			setShowModal(false)
			setIsHovered(false)
			if (currentList == list._id) dispatch(setList(currentUser.defaultList))
			fetchData()
		} catch (err) {
			console.log(err)
		}
	}

	const handleColorChange = async (color) => {
		try {
			await axios.put(`/api/lists/${list._id}/color`, {
				color: color.hex,
			})
			fetchData()
			fetchTodoData()
			setIsHovered(false) //for the options dropdown
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<li
			onClick={handleClick}
			className={
				'cursor-pointer rounded-xl mx-2 transition-all flex justify-between items-center' +
				(currentList == list._id ? ' bg-gray-100' : '') +
				(editing == list._id ? ' border' : '')
			}
			id={list._id}
		>
			{editing == list._id ? (
				<EditListForm
					list={list}
					setEditing={setEditing}
					fetchData={fetchData}
					inputRef={inputRef}
				/>
			) : (
				<div
					className="flex justify-between items-center w-full p-2"
					id={list._id}
					onMouseOver={() => {
						setIsHovered(true)
					}}
					onMouseLeave={() => {
						setIsHovered(false)
					}}
				>
					<div className="flex items-center gap-2">
						<Dropdown
							inline
							arrowIcon={false}
							label={
								<div className="w-4 h-4 bg-blue-500 rounded-full hover:w-5 hover:h-5 transition-all duration-200" style={{ 'backgroundColor': list.color}}></div>
							}
						>
							<DropdownItem
								style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
							>
								<CirclePicker 
								circleSize={20}
								colors={calendarColors}
								onChange={handleColorChange}
								/>
							</DropdownItem>
						</Dropdown>

						<span className="truncate" id={list._id}>
							{list.name}
						</span>
					</div>
					{isHovered || isClicked ? (
						<div
							ref={dropdownRef}
							onClick={() => {
								//only set clicked to true when the dropdown hasn't been open
								//this is to stop propagation since e doesn't exist in the onclick function for the dropdown item
								if (
									!document.querySelector('[data-testid="flowbite-dropdown"]')
								) {
									setIsClicked(true)
								}
							}}
						>
							<Dropdown inline arrowIcon={false} label={<HiDotsHorizontal />}>
								<DropdownItem
									onClick={() => {
										setEditing(list._id)
										setIsHovered(false)
										setIsClicked(false)
									}}
								>
									Edit
								</DropdownItem>
								<DropdownItem
									onClick={() => {
										setShowModal(true)
										setIsHovered(false)
										setIsClicked(false)
									}}
								>
									Delete
								</DropdownItem>
							</Dropdown>
						</div>
					) : (
						<div className="text-gray-400">{list.count}</div>
					)}
				</div>
			)}
			<Modal
				show={showModal}
				size="md"
				onClose={() => setShowModal(false)}
				popup
			>
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						<h3 className="mb-5 text-lg">
							Are you sure you want to delete "
							<span className="font-bold">{list.name}</span>" and all its todos?
						</h3>
						<div className="flex justify-center gap-4">
							<Button color="light" onClick={() => setShowModal(false)}>
								Cancel
							</Button>
							<Button color="failure" onClick={handleDelete}>
								Delete
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</li>
	)
}
