import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="flex flex-col items-center top-0 w-16 px-2 py-7 gap-8 h-screen bg-blue-100">
      <Link to="/" className="cursor-pointer ">
        TodoAI
      </Link>
      <div className="flex flex-col items-center justify-between h-full">
        <div className="flex flex-col gap-[18px] text-center">
          <Link to="/todos" className="cursor-pointer">
            Todos
          </Link>
          <Link to="/analytics" className="cursor-pointer">
            Analytics
          </Link>
        </div>
        <div className="flex flex-col items-center gap-3 ">
          <Link to="/profile" className="cursor-pointer">
            <img
              width="50"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
              alt="Profile Picture"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
