import { Alert, Button, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  } 
  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      setLoading(true)
      setErrorMessage(null)
      const res = await axios.post('/api/auth/sign-up', formData)
      setLoading(false)
      if(res.status === 200){
        navigate('/sign-in')
      }
    }
    catch(err){
      setErrorMessage(err.response.data)
      setLoading(false)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <TextInput type="text" placeholder='Username' id='username' onChange={handleChange}/>
        <TextInput type="text" placeholder='Email' id='email' onChange={handleChange}/>
        <TextInput type="password" placeholder='Password' id='password' onChange={handleChange}/>
        <Button color="light" type='submit' disabled={loading}>
          {loading ? (
            <>
              <Spinner size='sm' />
              <span className='pl-3'>Loading...</span>
            </>
          ) : 'Sign Up'
          }
        </Button>
      </form>
      <div className='flex gap-2 text-sm mt-5'>
        <span>Have an account?</span>
        <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
      </div>
      {
        errorMessage && (
          <Alert className='mt-5' color='failure'>
            {errorMessage}
          </Alert>
        )
      }
    </div>
  )
}
