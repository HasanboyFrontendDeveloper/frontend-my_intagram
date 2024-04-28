import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  allAccounts: null,
  contents: null,
  contentsData: [],
  posts: [],
  contentError: null,
  following: null,
  guest: null,
  guestUsename: null,
  isLoading: false,
  error: null,
  reloadProfile: false,
};

export const counterSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getProfileStart: (state) => {
      state.isLoading = true;
    },
    getProfileSuccess: (state, action) => {
      state.isLoading = false;
      state.profile = action.payload;
    },
    getProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getAllAccountsStart: (state) => {
      state.isLoading = true;
    },
    getAllAccountsSuccess: (state, action) => {
      state.isLoading = false;
      state.allAccounts = action.payload;
    },
    editProfileStart: (state) => {
      state.isLoading = true;
    },
    editProfileSuccess: (state) => {
      state.isLoading = false;
    },
    getGuest: (state, action) => {
      state.isLoading = false;
      state.guest = action.payload;
    },
    getContentStart: (state) => {
      state.isLoading = true;
    },
    getContentSuccess: (state, action) => {
      state.isLoading = false;
      state.contents = action.payload;
    },
    getContentFailure: (state, action) => {
      state.isLoading = false;
      state.contentError = action.payload;
    },
    reloadProfile: (state, action) => {
      state.reloadProfile = action.payload;
    },
    getGuestUsername: (state, action) => {
      state.guestUsename = action.payload;
    },
    getFollowing: (state, action) => {
      state.following = action.payload;
    },
    getPosts: (state, action) => {
      state.posts = action.payload
    },
    getContentsData: (state, action) => {
      state.contentsData = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  getProfileFailure,
  getProfileStart,
  getProfileSuccess,
  getAllAccountsStart,
  getAllAccountsSuccess,
  getGuest,
  getContentFailure,
  getContentStart,
  getContentSuccess,
  reloadProfile,
  getGuestUsername,
  getFollowing,
  getPosts, 
  getContentsData,
} = counterSlice.actions;

export default counterSlice.reducer;
