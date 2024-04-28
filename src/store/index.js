import { configureStore } from "@reduxjs/toolkit";
import profileReducer from '../slice/profileSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer
  },

  devTools: process.env.NODE_ENV !== "production",
});
