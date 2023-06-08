import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Posts } from "../../components/Feed";
import { Follower } from "../../pages/Followers";
import { IUser } from "../../pages/Search";

export interface HomePageState {
  posts: Posts[];
  libraryPosts: Posts[];
  explorePosts: Posts[];
  yourPosts: Posts[];
  searchUsers: IUser[];
  followersData: Follower[];
  pageStatus: {
    isExplore: boolean;
    isLibrary: boolean;
    isYourPosts: boolean;
    isSearch: boolean;
    isProfile: boolean;
    isFollower: boolean;
  };
  profilePosts: Posts[];
}

const initialState: HomePageState = {
  posts: [],
  libraryPosts: [],
  explorePosts: [],
  yourPosts: [],
  searchUsers: [],
  followersData: [],
  pageStatus: {
    isExplore: false,
    isLibrary: false,
    isYourPosts: false,
    isSearch: false,
    isProfile: false,
    isFollower: false,
  },
  profilePosts: [],
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
    setProfilePosts: (state, action: PayloadAction<Posts[]>) => {
      state.profilePosts = action.payload;
    },
  },
});

export const {
  setPosts,
  setPageStatus,
  setLibraryPosts,
  setExplorePosts,
  setYourPosts,
  setSearchUsers,
  setProfilePosts,
  setFollowersData,
} = homePageSlice.actions;

export default homePageSlice.reducer;
