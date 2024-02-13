import { Button, TextInput } from 'flowbite-react'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="New password" />
        <TextInput
          type="password"
          id="confirm-password"
          placeholder="Confirm password"
        />
        <Button gradientDuoTone="purpleToBlue" type="submit" outline>
          Update
        </Button>
      </form>
    </div>
  )
}
