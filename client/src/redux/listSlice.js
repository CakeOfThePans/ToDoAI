import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentList: null,
}

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setList: (state, action) => {
      state.currentList = action.payload
    },
    removeList: (state) => {
      state.currentList = null
    }
  }
})

export const { setList, removeList } = listSlice.actions

export default listSlice.reducer
