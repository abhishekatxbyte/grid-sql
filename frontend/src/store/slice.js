import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  dataArray: [],
  headers: [],
  leftPinnedColumns: [],
  setCurrentFileIndex: 0,
  rightPinnedColumns: [],
  csvData: null,
  filteredData: [],
  fileNames: [],
};

export const slice = createSlice({
  name: "data",
  initialState,
  reducers: {
    SET_LEFT_PINNED_COLUMNS(state, action) {
      state.leftPinnedColumns = action.payload;
    },
    SET_RIGHT_PINNED_COLUMNS(state, action) {
      state.rightPinnedColumns = action.payload;
    },
    SET_CURRENT_FILE_INDEX(state, action) {
      state.setCurrentFileIndex = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  SET_DATA,
  SET_MULTIPLE_DATA,
  SET_FILE_NAME,
  SET_HEADERS,
  SET_FILTERED_DATA,
  SET_LEFT_PINNED_COLUMNS,
  SET_RIGHT_PINNED_COLUMNS,
  SET_CURRENT_FILE_INDEX,
  SET_CSV_DATA,
} = slice.actions;

export default slice.reducer;
