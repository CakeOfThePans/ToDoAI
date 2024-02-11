import { Alert, Button, Spinner, TextInput } from "flowbite-react"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice"

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {loading, error: errorMessage} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await axios.post(
        "http://localhost:3000/users/sign-in",
        formData
      )
      if (res.status === 200) {
        dispatch(signInSuccess(res.data))
        navigate("/")
      }
    } catch (err) {
      dispatch(signInFailure(err.response.data))
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
          onChange={handleChange}
        />
        <TextInput
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
        />
        <Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Sign In"
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
