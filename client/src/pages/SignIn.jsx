import { Alert, Button, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
import { setList } from '../redux/listSlice'

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await axios.post(
        '/api/auth/sign-in',
        formData
      )
      if (res.status === 200) {
        dispatch(setUser(res.data))
        dispatch(setList(res.data.defaultList))
        navigate('/')
      }
    } catch (err) {
      setLoading(false)
      setErrorMessage(err.response.data)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Email"
          id="email"
          color=""
          onChange={handleChange}
        />
        <TextInput
          type="password"
          placeholder="Password"
          id="password"
          color=""
          onChange={handleChange}
        />
        <Button color="light" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
      <div className="flex gap-2 text-sm mt-5">
        <span>Don't have an account?</span>
        <Link to="/sign-up" className="text-blue-500">
          Sign Up
        </Link>
      </div>
      {errorMessage && (
        <Alert className="mt-5" color="failure">
          {errorMessage}
        </Alert>
      )}
    </div>
  )
}
