import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import Todos from './pages/Todos'

//allow access to cookies for api requests
import axios from 'axios'
axios.defaults.withCredentials = true

export default function App() {
  return (
    <div className="bg-gradient-to-r from-blue-300 to-cyan-300 min-h-screen flex flex-col">
    <BrowserRouter>
      <Header />
      <div className='bg-sky-200 bg-opacity-90 flex flex-grow rounded-lg m-1 h-full'>
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/todos" element={<Todos />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
    </div>
  )
}
