import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  provider: ""
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    }
  }
})

export const { setAddress, setProvider } = userSlice.actions;

export default userSlice.reducer;