import { useDispatch } from 'react-redux'
import { removeList } from '../redux/listSlice'
import { Button } from 'flowbite-react'

export default function TodoList() {
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(removeList())
  }

  return (
    <div className='flex flex-col m-1 w-80 bg-white rounded-lg p-2'>
      <Button onClick={handleClick}>
        back
      </Button>
    </div>
  )
}
