import axios from 'axios'
import { getToken, removeToken } from './cookieUtils'

// Request interceptor to add token to all requests
axios.interceptors.request.use(
	(config) => {
		const token = getToken()
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Response interceptor to handle 401 errors (unauthorized)
axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Token is invalid or expired, remove it
			removeToken()
			// Redirect to sign-in page
			if (window.location.pathname !== '/sign-in') {
				window.location.href = '/sign-in'
			}
		}
		return Promise.reject(error)
	}
)

export default axios
