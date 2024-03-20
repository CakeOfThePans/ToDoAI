import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import {
  setUser, removeUser
} from '../redux/userSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user)
  const [errorMessage, setErrorMessage] = useState(null)
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: '',
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
      const res = await axios.put(
        `http://localhost:3000/users/update/${currentUser._id}`,
        formData
      )
      dispatch(setUser(res.data))
      setUserUpdateSuccess('User updated successfully')
      setFormData({ ...formData, password: '' })
    } catch (err) {
      setErrorMessage(err.response.data)
      setFormData({ ...formData, password: '' })
    }
  }
  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      const res = await axios.delete(
        `http://localhost:3000/users/delete/${currentUser._id}`
      )
      await axios.post(`http://localhost:3000/auth/sign-out`)
      dispatch(removeUser())
    } catch (err) {
      setErrorMessage(err.response.data)
    }
  }
  const handleSignout = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/auth/sign-out`)
      dispatch(removeUser())
    } catch (err) {
      console.log(err)
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
      <div className="text-red-500 flex justify-between mt-5">
        <span
          onClick={() => {
            setShowModal(true)
          }}
          className="cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
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
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete your account
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
