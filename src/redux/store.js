import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import { socketApi } from "../services/socket";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [socketApi.reducerPath]: socketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketApi.middleware),
})