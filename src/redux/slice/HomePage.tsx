import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Posts } from "../../components/Feed";
import { Follower } from "../../pages/Followers";
import { IUser } from "../../pages/Search";

interface HomePageState {
  posts: Posts[];
  libraryPosts: Posts[];
  explorePosts: Posts[];
  yourPosts: Posts[];
  searchPosts: Posts[];
  searchUsers: IUser[]; // Add the searchUsers state
  followersData: Follower[];
  pageStatus: {
    isExplore: boolean;
    isLibrary: boolean;
    isYourPosts: boolean;
    isSearch: boolean;
    isProfile: boolean;
    isFollower: boolean;
  };
}

const initialState: HomePageState = {
  posts: [],
  libraryPosts: [],
  explorePosts: [],
  yourPosts: [],
  searchPosts: [],
  searchUsers: [], // Initialize searchUsers state as an empty array
  followersData: [],
  pageStatus: {
    isExplore: false,
    isLibrary: false,
    isYourPosts: false,
    isSearch: false,
    isProfile: false,
    isFollower: false,
  },
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Posts[]>) => {
      state.posts = action.payload;
    },
    setLibraryPosts: (state, action: PayloadAction<Posts[]>) => {
      state.libraryPosts = action.payload;
    },
    setExplorePosts: (state, action: PayloadAction<Posts[]>) => {
      state.explorePosts = action.payload;
    },
    setYourPosts: (state, action: PayloadAction<Posts[]>) => {
      state.yourPosts = action.payload;
    },
    setSearchPosts: (state, action: PayloadAction<Posts[]>) => {
      state.searchPosts = action.payload;
    },
    setSearchUsers: (state, action: PayloadAction<IUser[]>) => {
      state.searchUsers = action.payload;
    },
    setFollowersData: (state, action: PayloadAction<Follower[]>) => {
      state.followersData = action.payload;
    },
    setPageStatus: (
      state,
      action: PayloadAction<HomePageState["pageStatus"]>
    ) => {
      state.pageStatus = action.payload;
    },
  },
});

export const {
  setPosts,
  setPageStatus,
  setLibraryPosts,
  setExplorePosts,
  setYourPosts,
  setSearchPosts,
  setSearchUsers, // Add setSearchUsers to the exported actions
  setFollowersData,
} = homePageSlice.actions;

export default homePageSlice.reducer;
