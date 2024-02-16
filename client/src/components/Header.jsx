import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signOutSuccess } from '../redux/user/userSlice'
import axios from 'axios'

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const handleSignout = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/auth/sign-out`)
      dispatch(signOutSuccess())
    } catch (err) {
      console.log(err)
    }
  }
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
          label={
            <Avatar
              alt="user"
              img={
                'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png'
              }
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{currentUser.username}</span>
            <span className="block text-sm font-medium truncate">
              {currentUser.email}
            </span>
          </Dropdown.Header>
          <Link to={'/dashboard?tab=profile'}>
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
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
