import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState: {
    loading: false,
    dataSource: null,
    uniqueIdentifier: null,
    totalPages: null,
    selectedPage: 1,
    selectedLimit: 10,
    sort: {
      sortDirection: "",
      sortField: "",
      sortValue: "",
    },
    search: {
      searchField: "",
      searchValue: "",
    },
    filter: {
      filterField: "",
      filterValues: [],
    },
  },
  reducers: {
    setUniqueIdentifier: (state, action) => {
      console.log(action.payload);
      state.uniqueIdentifier = action.payload;
    },
    setSelectedLimit: (state, action) => {
      state.selectedLimit = action.payload;
    },
    setDataSource: (state, action) => {
      console.log(action.payload);
      state.dataSource = action.payload;
    },
    setSelectedPage: (state, action) => {
      state.selectedPage = action.payload;
    },
    setTotalPage: (state, action) => {
      state.totalPages = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSortDirection: (state, action) => {
      state.sort.sortDirection = action.payload;
    },
    setSortField: (state, action) => {
      state.sort.sortField = action.payload;
    },
    setSortValue: (state, action) => {
      state.sort.sortValue = action.payload;
    },
    setSearchField: (state, action) => {
      state.search.searchField = action.payload;
    },
    setSearchValue: (state, action) => {
      state.search.searchValue = action.payload;
    },
    setFilterField: (state, action) => {
      state.filter.filterField = action.payload;
    },
    setFilterValue: (state, action) => {
      state.filter.filterValues = action.payload;
    },
  },
});

export const {
  setUniqueIdentifier,
  setDataSource,
  setSelectedLimit,
  setSelectedPage,
  setTotalPage,
  setLoading,
  setSortDirection,
  setSortField,
  setSortValue,
  setSearchField,
  setSearchValue,
  setFilterField,
  setFilterValue,
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;

export const loading_state = (state) => state.fileUpload.loading;
export const data_source = (state) => state.fileUpload.dataSource;
export const unique_identifier = (state) => state.fileUpload.uniqueIdentifier;
export const total_pages = (state) => state.fileUpload.totalPages;
export const selected_page = (state) => state.fileUpload.selectedPage;
export const selected_limit = (state) => state.fileUpload.selectedLimit;
export const sort_direction = (state) => state.fileUpload.sort.sortDirection;
export const sort_field = (state) => state.fileUpload.sort.sortField;
export const sort_value = (state) => state.fileUpload.sort.sortValue;
export const search_field = (state) => state.fileUpload.search.searchField;
export const search_value = (state) => state.fileUpload.search.searchValue;
export const filter_field = (state) => state.fileUpload.filter.filterField;
export const filter_values = (state) => state.fileUpload.filter.filterValues;
