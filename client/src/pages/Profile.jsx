import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { setUser, removeUser } from '../redux/userSlice'
import { setList } from '../redux/listSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'

export default function Profile() {
	const { currentUser } = useSelector((state) => state.user)
	const [errorMessage, setErrorMessage] = useState(null)
	const [userUpdateSuccess, setUserUpdateSuccess] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const [formData, setFormData] = useState({
		username: currentUser.username,
		email: currentUser.email,
		password: '',
	})
	const [clicked, setClicked] = useState(false)
	const dispatch = useDispatch()
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value })
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		setClicked(true)
		setUserUpdateSuccess(null)
		setErrorMessage(null)
		try {
			const res = await axios.put(
				`/api/users/${currentUser._id}`,
				formData
			)
			dispatch(setUser(res.data))
			setUserUpdateSuccess('User updated successfully')
			setFormData({ ...formData, password: '' })
			setClicked(false)
		} catch (err) {
			setErrorMessage(err.response.data)
			setFormData({ ...formData, password: '' })
			setClicked(false)
		}
	}
	const handleDeleteUser = async () => {
		setClicked(true)
		setShowModal(false)
		try {
			await axios.delete(`/api/users/${currentUser._id}`)
			await axios.post(`/api/auth/sign-out`)
			dispatch(removeUser())
			dispatch(setList(null))
			setClicked(false)
		} catch (err) {
			setErrorMessage(err.response.data)
			setClicked(false)
		}
	}
	const handleSignout = async () => {
		try {
			await axios.post(`/api/auth/sign-out`)
			dispatch(removeUser())
			dispatch(setList(null))
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<div className="mx-auto my-auto p-3 max-w-lg">
			<h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
			<form className="flex flex-col gap-8" onSubmit={!clicked ? handleSubmit : null}>
				<TextInput
					type="text"
					autoComplete='off'
					id="username"
					placeholder="Username"
					defaultValue={currentUser.username}
					onChange={handleChange}
				/>
				<TextInput
					type="text"
					autoComplete='off'
					id="email"
					placeholder="Email"
					defaultValue={currentUser.email}
					onChange={handleChange}
				/>
				<TextInput
					type="password"
					autoComplete='off'
					id="password"
					placeholder="New password"
					value={formData.password}
					onChange={handleChange}
				/>
				<Button color="light" type="submit">
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
						<h3 className="mb-5 text-lg">
							Are you sure you want to delete your account
						</h3>
						<div className="flex justify-center gap-4">
							<Button Button color="gray" onClick={() => setShowModal(false)}>
								No, cancel
							</Button>
							<Button color="failure" onClick={!clicked ? handleDeleteUser : null}>
								Yes, I'm sure
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	)
}
