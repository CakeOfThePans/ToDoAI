import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
    },
    removeUser: (state) => {
      state.currentUser = null
    }
  },
})

export const { setUser, removeUser } = userSlice.actions

export default userSlice.reducer
