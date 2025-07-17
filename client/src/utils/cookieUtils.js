// Utility function to get a cookie value by name
export const getCookie = (name) => {
	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)
	if (parts.length === 2) return parts.pop().split(';').shift()
	return null
}

// Check if the JWT access_token cookie exists
export const hasValidJWT = () => {
	const token = getCookie('access_token')
	return token !== null && token !== undefined && token !== ''
}
