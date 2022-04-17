import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userAddress: "",
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserAddress: (state, action) => {
      state.userAddress = action.payload;
    },
  }
})

export const { setUserAddress} = userSlice.actions;

export default userSlice.reducer;