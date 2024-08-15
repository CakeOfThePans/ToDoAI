import { useEffect, useState } from 'react'
import { TextInput, Button } from 'flowbite-react'
import axios from 'axios'

export default function CreateListForm({ setCreating, fetchData, inputRef }) {
    const [newList, setNewList] = useState('')

    useEffect(() => {
      if(inputRef && inputRef.current){
        inputRef.current.focus()
      }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          if (!newList) return
          await axios.post('/api/lists', {
            name: newList,
          })
          setNewList('')
          setCreating(false)
          fetchData()
        } catch (err) {
          console.log(err)
        }
      }

    return (
      <div className="rounded-xl p-2 mx-2 border">
        <form className="w-full" onSubmit={handleSubmit}>
            <TextInput
                ref={inputRef}
                type="text"
                placeholder="New List"
                value={newList}
                onChange={(e) => setNewList(e.target.value)}
            />
            <div className="mt-2 flex gap-2 justify-center items-center">
                <Button color="gray" className="w-full" onClick={() => {setCreating(false); setNewList('')}}>Cancel</Button>
                <Button color="gray" className="w-full" onClick={handleSubmit}>Create</Button>
            </div>
        </form>
      </div>
    )
}
