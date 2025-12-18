// Utility functions for localStorage token management
export const getToken = () => {
	return localStorage.getItem('access_token')
}

export const setToken = (token) => {
	localStorage.setItem('access_token', token)
}

export const removeToken = () => {
	localStorage.removeItem('access_token')
}

// Check if the JWT access_token exists in localStorage
export const hasValidJWT = () => {
	const token = getToken()
	return token !== null && token !== undefined && token !== ''
}
