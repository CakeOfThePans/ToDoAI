import { Link, useLocation } from 'react-router-dom'
import {
	HiBadgeCheck,
	HiMoon,
	HiSun,
	HiClipboardList,
	HiCalendar,
} from 'react-icons/hi'
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
import { useView } from '../contexts/ViewContext'
import { useEffect, useState } from 'react'
import { removeToken } from '../utils/cookieUtils'

export default function Header() {
	const { currentUser } = useSelector((state) => state.user)
	const { view, setView } = useView()
	const location = useLocation()
	const dispatch = useDispatch()
	const isTodosPage = location.pathname === '/'
	const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1320)

	useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth < 1320)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const handleSignout = async () => {
		try {
			await axios.post(`/api/auth/sign-out`)
			removeToken()
			dispatch(removeUser())
			dispatch(setList(null))
		} catch (err) {
			console.log(err)
			// Even if API call fails, clear local state
			removeToken()
			dispatch(removeUser())
			dispatch(setList(null))
		}
	}

	const handleViewToggle = (newView) => {
		setView(newView)
	}

	return (
		<Navbar
			className="z-10 fixed w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-3 py-3"
			fluid
		>
			<Link
				to="/"
				className="flex items-center gap-3 hover:text-current hover:no-underline focus:text-current focus:no-underline active:text-current active:no-underline"
			>
				<HiBadgeCheck className="size-6" />
				<span className="whitespace-nowrap text-xl font-semibold">ToDoAI</span>
			</Link>
			<div className="flex items-center gap-3">
				{isTodosPage && currentUser && isSmallScreen && (
					<div className="flex items-center gap-2 rounded-lg p-1">
						<Button
							color={view === 'todos' ? 'blue' : 'light'}
							size="sm"
							onClick={() => handleViewToggle('todos')}
							className="focus:ring-0"
						>
							<div className="flex items-center gap-2">
								<HiClipboardList className="size-4" />
								<span>Todos</span>
							</div>
						</Button>
						<Button
							color={view === 'calendar' ? 'blue' : 'light'}
							size="sm"
							onClick={() => handleViewToggle('calendar')}
							className="focus:ring-0"
						>
							<div className="flex items-center gap-2">
								<HiCalendar className="size-4" />
								<span>Calendar</span>
							</div>
						</Button>
					</div>
				)}
				{currentUser ? (
					<Dropdown
						arrowIcon={false}
						inline
						label={<Avatar alt="user" img="/profile.png" rounded />}
					>
						<DropdownHeader>
							<span className="block text-sm truncate">
								{currentUser.username}
							</span>
							<span className="block text-sm font-medium truncate">
								{currentUser.email}
							</span>
						</DropdownHeader>
						<Link
							to="/profile"
							className="hover:text-current hover:no-underline focus:text-current focus:no-underline active:text-current active:no-underline"
						>
							<DropdownItem>Profile</DropdownItem>
						</Link>
						{/* <Link to="/settings">
              <DropdownItem>Settings</DropdownItem>
            </Link> */}
						<DropdownDivider />
						<DropdownItem onClick={handleSignout}>Sign Out</DropdownItem>
					</Dropdown>
				) : (
					<Link
						to="/sign-in"
						className="hover:text-current hover:no-underline focus:text-current focus:no-underline active:text-current active:no-underline"
					>
						<Button color="light" className="focus:ring-0">
							Sign In
						</Button>
					</Link>
				)}
			</div>
		</Navbar>
	)
}
