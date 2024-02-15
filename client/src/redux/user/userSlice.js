import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  loading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false
    },
    signInFailure: (state) => {
      state.loading = false
    },
    updateStart: (state) => {
      state.loading = true
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false
    },
    updateFailure: (state) => {
      state.loading = false
    },
  },
})

export const { signInStart, signInSuccess, signInFailure, updateStart, updateSuccess, updateFailure } = userSlice.actions

export default userSlice.reducer
