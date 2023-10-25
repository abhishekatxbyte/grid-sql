import { configureStore } from '@reduxjs/toolkit'
import reducer from './slice'
import authReducer from "./slices/authSlice";
import { apiSlice } from "./slices/apiSlice";


export const store = configureStore({
  reducer: {
    data: reducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devtools: true,
})
