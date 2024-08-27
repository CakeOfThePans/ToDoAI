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
import { setList } from '../redux/listSlice'
import axios from 'axios'

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const handleSignout = async () => {
    try {
      await axios.post(`/api/auth/sign-out`)
      dispatch(removeUser())
      dispatch(setList(null))
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Navbar className="z-10 fixed w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-3 py-3" fluid>
      <Link to="/" className="flex items-center gap-3 hover:text-current hover:no-underline focus:text-current focus:no-underline active:text-current active:no-underline">
        <HiBadgeCheck className="size-6" />
        <span className="whitespace-nowrap text-xl font-semibold">ToDoAI</span>
      </Link>
      <div className="flex items-center gap-3">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img="/profile.png"
                rounded
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
            <Link to="/profile" className='hover:text-current hover:no-underline focus:text-current focus:no-underline active:text-current active:no-underline'>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            {/* <Link to="/settings">
              <DropdownItem>Settings</DropdownItem>
            </Link> */}
            <DropdownDivider />
            <DropdownItem onClick={handleSignout}>Sign Out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to="/sign-in" className='hover:text-current hover:no-underline focus:text-current focus:no-underline active:text-current active:no-underline'>
            <Button color="light" className='focus:ring-0'>Sign In</Button>
          </Link>
        )}
      </div>
    </Navbar>
  )
}
