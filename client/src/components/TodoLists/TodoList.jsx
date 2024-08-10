import { useState, useRef, useEffect } from 'react'
import { Dropdown, DropdownItem, Modal, Button } from 'flowbite-react'
import { HiDotsHorizontal } from 'react-icons/hi'
import axios from 'axios'
import EditListForm from './EditListForm'

export default function TodoList({ list, fetchData, handleClick, currentList }) {
	const [isHovered, setIsHovered] = useState(false)
    const dropdownRef = useRef(null)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(false)

    // const handleClickOutside = (event) => {
    //     console.log(currentList != list._id)
    //     if (currentList != list._id && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //         setIsHovered(false)
    //     }
    // }

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutside)
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside)
    //     }
    // }, [])

    const handleDelete = async () => {
		try {
			await axios.delete(`/api/lists/${list._id}`)
            setShowModal(false)
            setIsHovered(false)
			fetchData()
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<li
            onClick={handleClick}
            className={"cursor-pointer rounded-xl p-2 mx-2 transition-all flex justify-between items-center truncate"  + (currentList == list._id ? " bg-gray-100" : "")}
            onMouseOver={() => {
                if(!document.querySelector('[data-testid="flowbite-dropdown"]')) setIsHovered(true)}
            }
            onMouseLeave={() => {
                if(!document.querySelector('[data-testid="flowbite-dropdown"]')) setIsHovered(false)}
            }
        >
            {editing ? (
                <EditListForm list={list} setEditing={setEditing} fetchData={fetchData} />
            ) : (
                <div className="flex justify-between items-center w-full" id={list._id}>
				<span className="truncate" id={list._id}>
					{list.name}
				</span>
                {isHovered ? (
                    <div ref={dropdownRef}>
                        <Dropdown inline arrowIcon={false} label={<HiDotsHorizontal />}>
                            <DropdownItem
                                onClick={() => {
                                    setEditing(true)
                                    setIsHovered(false)
                                }}
                            >
                                Edit
                            </DropdownItem>
                            <DropdownItem onClick={() => setShowModal(true)}>
                                Delete
                            </DropdownItem>
                        </Dropdown>
                    </div>
                ) : (
                    <div className="text-gray-400">{list.count}</div>
                )}
			</div>
            )}
            <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg">
                            Are you sure you want to delete "
                            <span className='font-bold'>{list.name}</span>
                            " and all its todos?
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
