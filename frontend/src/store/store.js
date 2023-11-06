import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slice";
import authReducer from "./slices/authSlice";
import { apiSlice } from "./slices/apiSlice";
import fileUploadReducer from "./fileUploadSlice";

export const store = configureStore({
  reducer: {
    data: reducer,
    auth: authReducer,
    fileUpload: fileUploadReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devtools: true,
});
