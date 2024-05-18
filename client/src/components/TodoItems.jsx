import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Dropdown, DropdownItem, TextInput, Tooltip } from 'flowbite-react'
import { HiDotsVertical, HiOutlinePlusCircle } from 'react-icons/hi'

export default function TodoItems() {
  const { currentList } = useSelector((state) => state.list)
  const [currentTodo, setCurrentTodo] = useState('')
  const [listName, setListName] = useState('')
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    getListName()
    fetchData()
  }, [currentList])

  const getListName = async () => {
    try {
      const res = await axios.get(`/api/lists/listName/${currentList}`)
      setListName(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/todos/${currentList}`)
      setTodos(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async () => {
    try {
      await axios.post('/api/todos/create', {
        listId: currentList,
        task: newTodo,
        notes: '',
        completed: false,
        queue: false,
      })
      setNewTodo('')
      fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  const handleNewTodoChange = async (e) => {
    setNewTodo(e.target.value)
  }

  const handleQueue = async (e) => {

  }

  return (
    <div className="flex flex-col bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 w-96 m-4 rounded-xl">
      <div className="overflow-y-auto p-4">
        <div className="mt-2 gap-2 flex flex-col">
          {todos.map((todo) => {
            return (
              <div className="flex flex-col" key={todo._id}>
                <div
                  className={'cursor-pointer hover:bg-gray-50 rounded-xl p-2'}
                >
                  <div
                    className={'flex justify-between items-center'}
                    id={todo._id}
                  >
                    <span className="truncate" id={todo._id}>
                      {todo.task}
                    </span>
                    <div className='flex items-center gap-2'>
                      <Tooltip content="Add to queue">
                      <HiOutlinePlusCircle onClick={handleQueue} className=''/>
                      </Tooltip>
                      <Dropdown
                        inline
                        arrowIcon={false}
                        label={<HiDotsVertical />}
                      >
                        <DropdownItem
                          onClick={() => {
                            setEditing(todo._id)
                            setEditingList(todo[todo.order - 1].name)
                          }}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => handleDelete(todo._id)}>
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <form className="px-4 pb-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Create Todo"
          value={newTodo}
          className="w-full"
          onChange={handleNewTodoChange}
          onBlur={() => {
            setNewTodo('')
          }}
        />
      </form>
    </div>
  )
}
