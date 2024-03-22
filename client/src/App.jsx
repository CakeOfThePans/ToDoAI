import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSelector } from "react-redux"
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import Todos from './pages/Todos'

//allow access to cookies for api requests
import axios from 'axios'
axios.defaults.withCredentials = true

export default function App() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className="flex flex-row">
    <BrowserRouter>
      {currentUser && <Navbar />}
      <div className='w-full'>
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
  )
}
