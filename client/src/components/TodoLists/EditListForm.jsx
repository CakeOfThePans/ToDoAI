import { useEffect, useState } from 'react'
import { TextInput, Button } from 'flowbite-react'
import axios from 'axios'

export default function EditListForm({ list, setEditing, fetchData, inputRef }) {
	const [newList, setNewList] = useState(list.name)
	const [clicked, setClicked] = useState(false)

	useEffect(() => {
		if(inputRef && inputRef.current){
		  inputRef.current.focus()
		}
	}, [])

	const handleEdit = async (e) => {
		e.preventDefault()
		setClicked(true)
		try {
			await axios.put(`/api/lists/${list._id}`, {
				name: newList,
			})
			setNewList('')
			setEditing(null)
			setClicked(false)
      		fetchData()
		} catch (err) {
			console.log(err)
			setClicked(false)
		}
	}

	return (
		<form className="w-full p-2" onSubmit={handleEdit}>
			<TextInput
				ref={inputRef}
				type="text"
				value={newList}
				onChange={(e) => setNewList(e.target.value)}
			/>
			<div className="mt-2 flex gap-2 justify-center items-center">
				<Button
					color="gray"
					className="w-full focus:ring-0"
					onClick={() => {
						setEditing(null)
						setNewList('')
					}}
				>
					Cancel
				</Button>
				<Button color="gray" className="w-full focus:ring-0" onClick={!clicked ? handleEdit : null}>
					Update
				</Button>
			</div>
		</form>
	)
}
