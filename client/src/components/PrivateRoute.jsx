import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import { hasValidJWT } from '../utils/cookieUtils'

export default function PrivateRoute() {
	const { currentUser } = useSelector((state) => state.user)
	const hasJWT = hasValidJWT()

	// Check both Redux state and JWT token in localStorage
	return currentUser && hasJWT ? <Outlet /> : <Navigate to="/sign-in" />
}
