import TodoLists from '../components/TodoLists'
import TodoItems from '../components/TodoItems'

export default function Todos() {
  return (
    <div className='flex h-full'>
      <TodoLists />
      <TodoItems />
      {/* TodoCalendar */}
    </div>
  )
}
