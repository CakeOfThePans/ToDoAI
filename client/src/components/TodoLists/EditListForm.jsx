import { useEffect, useState } from 'react'
import { TextInput, Button } from 'flowbite-react'
import axios from 'axios'

export default function EditListForm({ list, setEditing, fetchData, inputRef }) {
	const [newList, setNewList] = useState(list.name)

	useEffect(() => {
		if(inputRef && inputRef.current){
		  inputRef.current.focus()
		}
	}, [])

	const handleEdit = async (e) => {
		e.preventDefault()
		try {
			await axios.put(`/api/lists/${list._id}`, {
				name: newList,
			})
			setNewList('')
			setEditing(null)
      fetchData()
		} catch (err) {
			console.log(err)
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
					className="w-full"
					onClick={() => {
						setEditing(null)
						setNewList('')
					}}
				>
					Cancel
				</Button>
				<Button color="gray" className="w-full" onClick={handleEdit}>
					Submit
				</Button>
			</div>
		</form>
	)
}
