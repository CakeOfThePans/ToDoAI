import { Button, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <TextInput type="text" placeholder='Username' id='username'/>
        <TextInput type="text" placeholder='Email' id='email'/>
        <TextInput type="text" placeholder='Password' id='password'/>
        <Button gradientDuoTone='purpleToBlue'>Sign Up</Button>
      </form>
      <div className='flex gap-2 text-sm mt-5'>
        <span>Have an account?</span>
        <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
      </div>
    </div>
  )
}
