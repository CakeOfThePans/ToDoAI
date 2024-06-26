import { Link } from 'react-router-dom'
import { HiBadgeCheck, HiMoon, HiSun } from 'react-icons/hi'
import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
} from 'flowbite-react'
import { useSelector, useDispatch } from 'react-redux'
import { removeUser } from '../redux/userSlice'
import { toggleTheme } from '../redux/themeSlice'
import axios from 'axios'

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const { theme } = useSelector((state) => state.theme)
  const dispatch = useDispatch()
  const handleSignout = async () => {
    try {
      await axios.post(`http://localhost:3000/auth/sign-out`)
      dispatch(removeUser())
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Navbar className="fixed w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-3 py-3" fluid>
      <Link to="/" className="flex items-center gap-3">
        <HiBadgeCheck className="size-6" />
        <span className="whitespace-nowrap text-xl font-semibold">ToDoAI</span>
      </Link>
      <div className="flex items-center gap-3">
        <Button color="light" onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? <HiSun /> : <HiMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm truncate">
                {currentUser.username}
              </span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to="/profile">
              <DropdownItem>Profile</DropdownItem>
            </Link>
            {/* <Link to="/settings">
              <DropdownItem>Settings</DropdownItem>
            </Link> */}
            <DropdownDivider />
            <DropdownItem onClick={handleSignout}>Sign Out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button color="light">Sign In</Button>
          </Link>
        )}
      </div>
    </Navbar>
  )
}
