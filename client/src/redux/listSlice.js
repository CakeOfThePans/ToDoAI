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
    }
  }
})

export const { setList } = listSlice.actions

export default listSlice.reducer