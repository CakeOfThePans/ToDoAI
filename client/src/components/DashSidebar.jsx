import { Sidebar } from 'flowbite-react'
import { HiUser, HiArrowSmRight } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeUser } from '../redux/userSlice'
import axios from 'axios'

export default function DashSidebar() {
  const location = useLocation()
  const [tab, setTab] = useState('')
  const dispatch = useDispatch()
  const handleSignout = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/auth/sign-out`)
      dispatch(removeUser())
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} as="div">
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            active
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
          {/* Add other things later */}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
