import { Avatar, Button, Dropdown, Navbar } from "flowbite-react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-xl font-semibold"
      >
        <div className="px-2 py-1">ToDoAI</div>
      </Link>
      {currentUser ? (
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">{currentUser.username}</span>
            <span className="block text-sm font-medium truncate">
              {currentUser.email}
            </span>
          </Dropdown.Header>
          <Link to={"/dashboard?tab=profile"}>
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item>Sign Out</Dropdown.Item>
        </Dropdown>
      ) : (
        <Link to="/sign-in">
          <Button gradientDuoTone="purpleToBlue" outline>
            Sign In
          </Button>
        </Link>
      )}
    </Navbar>
  )
}
