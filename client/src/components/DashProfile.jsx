import { Alert, Button, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user)
  const [errorMessage, setErrorMessage] = useState(null)
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null)
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: ''
  })
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUserUpdateSuccess(null)
    setErrorMessage(null)
    try {
      dispatch(updateStart())
      const res = await axios.put(
        `http://localhost:3000/users/update/${currentUser._id}`,
        formData
      )
      dispatch(updateSuccess(res.data))
      setUserUpdateSuccess('User updated successfully')
      setFormData({ ...formData, password: '' });
    } catch (err) {
      dispatch(updateFailure())
      setErrorMessage(err.response.data)
      setFormData({ ...formData, password: '' });
    }
  }
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="New password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button gradientDuoTone="purpleToBlue" type="submit" outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>
          Delete Account
        </span>
        <span className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      {userUpdateSuccess && (
        <Alert color="success" className="mt-5">
          {userUpdateSuccess}
        </Alert>
      )}
      {errorMessage && (
        <Alert color="failure" className="mt-5">
          {errorMessage}
        </Alert>
      )}
    </div>
  )
}
