import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setList } from '../redux/listSlice'
import { Button, TextInput } from 'flowbite-react'

export default function Lists() {
  const { currentUser } = useSelector((state) => state.user)
  const [lists, setLists] = useState([])
  const [newList, setNewList] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `http://localhost:3000/lists/${currentUser._id}`
        )
        setLists(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  const handleClick = (e) => {
    dispatch(setList(e.target.id))
  }

  const handleChange = (e) => {
    setNewList(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if(!newList) return 
      const res = await axios.post(
        'http://localhost:3000/lists/create',
        {name: newList}
      )
      setNewList('')
      setLists([...lists, res.data])
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="h-[7vh] border-b shadow-md p-2">___ Lists</div>
      <div className="flex flex-col h-[70vh] py-4 overflow-auto">
        <ul className="border-b cursor-pointer">
          <li onClick={handleClick} id="Scheduling Queue"># Scheduling Queue</li>
          <li onClick={handleClick} id="Today"># Today</li>
          <li onClick={handleClick} id="Tomorrow"># Tomorrow</li>
          <li onClick={handleClick} id="Next 7 Days"># Next 7 Days</li>
        </ul>
        <ul className="border-b cursor-pointer flex-grow mt-1">
          {lists.map((list) => {
            return <li onClick={handleClick} key={list._id} id={list._id}># {list.name}</li>
          })}
        </ul>
      </div>
      <form className="flex" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Create List"
          value={newList}
          className="w-60"
          onChange={handleChange}
        />
        <Button gradientDuoTone="purpleToBlue" type="submit" className="ml-2">
          Add
        </Button>
      </form>
    </div>
  )
}
