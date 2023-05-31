import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Posts } from "../../components/Feed";
import { Follower } from "../../pages/Followers";
interface HomePageState {
  posts: Posts[];
  libraryPosts: Posts[],
  explorePosts: Posts[],
  yourPosts:Posts[],
  searchPosts:Posts[],
  followersData:Follower[],
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
  explorePosts:[],
  yourPosts:[],
  searchPosts:[],
  followersData:[],
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
    setFollowersData: (state, action: PayloadAction<Follower[]>) => {
      state.followersData = action.payload;
    },
    setPageStatus: (state, action: PayloadAction<HomePageState["pageStatus"]>) => {
      state.pageStatus = action.payload;
    },
  },
});

export const { setPosts, setPageStatus,setLibraryPosts,setExplorePosts,setYourPosts,setSearchPosts,setFollowersData } = homePageSlice.actions;

export default homePageSlice.reducer;
