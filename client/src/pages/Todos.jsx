import Lists from '../components/Lists'
import TodoList from '../components/TodoList'
import { useSelector } from 'react-redux'

export default function Todos() {
  const { currentList } = useSelector((state) => state.list)
  return (
    <div className='flex'>
      <div className=''>
        {currentList ? <TodoList /> : <Lists />}
      </div>
      {/* TodoCalendar */}
    </div>
  )
}
