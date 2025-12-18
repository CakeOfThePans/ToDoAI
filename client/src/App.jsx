import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import Todos from './pages/Todos'
import { ViewProvider } from './contexts/ViewContext'

// Configure axios interceptors for token management
import './utils/axiosConfig'

export default function App() {
	return (
		<ViewProvider>
			<div className="h-screen">
				<BrowserRouter>
					<Header />
					<div className="pt-16 h-full">
						<Routes>
							<Route path="/sign-in" element={<SignIn />} />
							<Route path="/sign-up" element={<SignUp />} />
							<Route element={<PrivateRoute />}>
								<Route path="/profile" element={<Profile />} />
								<Route path="/" element={<Todos />} />
							</Route>
						</Routes>
					</div>
				</BrowserRouter>
			</div>
		</ViewProvider>
	)
}
