// fileUploadSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the thunk for sending (uploading) the file
// export const uploadFile = createAsyncThunk(
//   "fileUpload/file_upload",

// );

// Define the thunk for receiving data
// export const fetchData = createAsyncThunk(
//   "fileUpload/file_fetch",
// async ({ uniqueIdentifier, selected_page, selected_limit }) => {
//   // Retrieve the uniqueIdentifier from the state
//   if (uniqueIdentifier) {
//     try {
//       const getResponse = await axios.get(
//         `http://192.168.2.194:3000/api/file_upload?unique_identifier=${uniqueIdentifier}&page=${selected_page}&limit=${selected_limit}`
//       );
//       console.log(getResponse);
//       return getResponse;
//     } catch (error) {
//       throw error;
//     }
//   }
// }
// );

const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState: {
    uniqueIdentifier: null,
    totalPages: null,
    selectedPage: 1,
    selectedLimit: 10,
    receivedData: null,
  },
  reducers: {
    setUniqueIdentifier: (state, action) => {
      console.log(action.payload);
      state.uniqueIdentifier = action.payload;
    },
    setLimit: (state, action) => {
      state.selectedLimit = action.payload;
    },
    setData: (state, action) => {
      console.log(action.payload);
      const { data, totalPages } = action.payload.data;
      state.receivedData = data;
      state.loading = false;
      state.totalPages = totalPages;
      console.log("data", data);
      console.log("totalPages", totalPages);
    },
    // You can define additional actions here if needed
  },
  // // extraReducers: (builder) => {
  // //   builder
  // //     .addCase(fetchData.fulfilled, (state, action) => {
  // //       console.log(action.payload);
  // //       const { data, totalPages } = action.payload.data;
  // //       state.receivedData = data;
  // //       state.loading = false;
  // //       state.totalPages = totalPages;
  // //       console.log("data", data);
  // //       console.log("totalPages", totalPages);
  // //     })
  // //     .addCase(fetchData.rejected, (state, action) => {
  // //       // Handle the error if needed
  // //     });
  //   // .addCase(uploadFile.fulfilled, (state, action) => {
  //   //   state.uniqueIdentifier = action.payload;
  //   // })
  //   // .addCase(uploadFile.rejected, (state, action) => {
  //   //   // Handle the error if needed
  //   // })
  //   // .addCase(fetchData.pending, (state, action) => {
  //   //   console.log(first);
  //   //   state.loading = true;
  //   // })
  // },
});

export const { setLimit, setUniqueIdentifier, setPage, setData } =
  fileUploadSlice.actions;

export default fileUploadSlice.reducer;
