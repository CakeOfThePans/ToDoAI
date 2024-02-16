import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null
      state.loading = false
    },
  },
})

export const { signInSuccess, updateSuccess, deleteUserSuccess, } = userSlice.actions

export default userSlice.reducer
