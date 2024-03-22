import { Link, useLocation } from 'react-router-dom'
import { BiAddToQueue, BiBarChartSquare, BiUserCircle } from 'react-icons/bi'
// import { CiSettings } from 'react-icons/ci'

export default function Navbar() {
  const path = useLocation().pathname
  return (
    <div className="flex flex-col items-center top-0 w-16 px-2 py-7 gap-8 h-screen bg-teal-50">
      <Link to="/" className="cursor-pointer">
        TodoAI
      </Link>
      <div className="flex flex-col items-center justify-between h-full">
        <div className="flex flex-col gap-10 text-center">
          <Link
            to="/"
            className={`flex flex-col items-center cursor-pointer p-2 rounded-2xl opacity-50 hover:opacity-100 transition-all ${path === '/' && 'opacity-100 bg-orange-200'}`}
          >
            <BiAddToQueue className="w-7 h-7" />
            <span className="text-sm">Todos</span>
          </Link>
          <Link
            to="/stats"
            className={`flex flex-col items-center cursor-pointer p-2 rounded-2xl opacity-50 hover:opacity-100 transition-all ${path === '/stats' && 'opacity-100 bg-orange-200'}`}
          >
            <BiBarChartSquare className="w-7 h-7" />
            <div className="text-sm">Stats</div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-3 ">
          <div className="flex flex-col gap-10 text-center">
            {/* <Link
              to="/settings"
              className="cursor-pointer p-2 rounded-2xl hover:bg-orange-200"
            >
              <CiSettings className="w-7 h-7" />
            </Link> */}
            <Link
              to="/profile"
              className={`flex flex-col items-center cursor-pointer p-2 rounded-2xl opacity-50 hover:opacity-100 transition-all ${path === '/profile' && 'opacity-100 bg-orange-200'}`}
            >
              <BiUserCircle className="w-7 h-7" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
