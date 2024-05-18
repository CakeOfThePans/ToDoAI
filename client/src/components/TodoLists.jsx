import axios from 'axios'
import { useRef } from 'react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setList } from '../redux/listSlice'
import { Dropdown, DropdownItem, TextInput } from 'flowbite-react'
import { HiDotsVertical } from 'react-icons/hi'

export default function TodoLists() {
  const { currentUser } = useSelector((state) => state.user)
  const { currentList } = useSelector((state) => state.list)
  const [lists, setLists] = useState([])
  const [newList, setNewList] = useState('')
  const [editingList, setEditingList] = useState('')
  const [editing, setEditing] = useState(null)
  const editingRef = useRef([])
  const dispatch = useDispatch()

  useEffect(() => {
    //auto focuses on editing textinput when we edit
    if (editing !== null) {
      editingRef.current[editing].focus()
    }
    //re-fetch lists when done (and on initial render)
    else {
      fetchData()
    }
  }, [editing])

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `/api/lists/${currentUser._id}`
      )
      setLists(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = (e) => {
    if (e.target.id) {
      dispatch(setList(e.target.id))
    }
  }

  const handleNewListChange = (e) => {
    setNewList(e.target.value)
  }

  const handleEditingListChange = (e) => {
    setEditingList(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!newList) return
      await axios.post('/api/lists/create', {
        name: newList,
      })
      setNewList('')
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/lists/${editing}`, {
        name: editingList,
      })
      setEditingList('')
      setEditing(null)
      //auto fetches data in useEffect
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/lists/${id}`)
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex flex-col bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 w-64">
      <div className="flex flex-col overflow-y-auto p-4">
        <ul className="list-none border-b border-gray-200 dark:border-gray-700 gap-2 pb-2">
          <li
            className={`cursor-pointer ${
              currentList === 'Today' ? 'bg-gray-200' : 'hover:bg-gray-50'
            } rounded-xl p-2 transition-all flex justify-between items-center group truncate`}
            onClick={handleClick}
            id="Today"
          >
            Today
          </li>
          <li
            className={`cursor-pointer ${
              currentList === 'Tomorrow' ? 'bg-gray-200' : 'hover:bg-gray-50'
            } rounded-xl p-2 transition-all flex justify-between items-center group truncate`}
            onClick={handleClick}
            id="Tomorrow"
          >
            Tomorrow
          </li>
          <li
            className={`cursor-pointer ${
              currentList === 'Next 7 Days' ? 'bg-gray-200' : 'hover:bg-gray-50'
            } rounded-xl p-2 transition-all flex justify-between items-center group truncate`}
            onClick={handleClick}
            id="Next 7 Days"
          >
            Next 7 Days
          </li>
        </ul>
        <div className="mt-2 gap-2 flex flex-col">
          {lists.map((list) => {
            return (
              <div value={list} key={list._id}
                className={`cursor-pointer ${
                  currentList === list._id ? 'bg-gray-200' : 'hover:bg-gray-50'
                } rounded-xl p-2`}
                onClick={handleClick}
                // key={list._id}
              >
                {editing === list._id ? (
                  <form onSubmit={handleEdit}>
                    <TextInput
                      type="text"
                      value={editingList}
                      className={'w-full'}
                      ref={(el) => (editingRef.current[list._id] = el)}
                      onChange={handleEditingListChange}
                      onBlur={() => {
                        setEditingList('')
                        setEditing(null)
                      }}
                    />
                  </form>
                ) : (
                  <div
                    className={'flex justify-between items-center'}
                    id={list._id}
                  >
                    <span className="truncate" id={list._id}>
                      {list.name}
                    </span>
                    {list._id !== currentUser.defaultList && (
                      <Dropdown
                        inline
                        arrowIcon={false}
                        label={<HiDotsVertical />}
                      >
                        <DropdownItem
                          onClick={() => {
                            setEditing(list._id)
                            setEditingList(lists[list.order - 1].name)
                          }}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => handleDelete(list._id)}>
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <form className="px-4 pb-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Create List"
          value={newList}
          className="w-full"
          onChange={handleNewListChange}
          onBlur={() => {
            setNewList('')
          }}
        />
      </form>
    </div>
  )
}
