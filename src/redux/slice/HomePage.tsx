import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomePageState {
  posts: any[];
  libraryPosts: any[],
  explorePosts: any[],
  yourPosts:any[],
  searchPosts:any[],
  followersData:any[],
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
    setPosts: (state, action: PayloadAction<any[]>) => {
      state.posts = action.payload;
    },
    setLibraryPosts: (state, action: PayloadAction<any[]>) => {
      state.libraryPosts = action.payload;
    },
    setExplorePosts: (state, action: PayloadAction<any[]>) => {
      state.explorePosts = action.payload;
    },
    setYourPosts: (state, action: PayloadAction<any[]>) => {
      state.yourPosts = action.payload;
    },
    setSearchPosts: (state, action: PayloadAction<any[]>) => {
      state.searchPosts = action.payload;
    },
    setFollowersData: (state, action: PayloadAction<any[]>) => {
      state.followersData = action.payload;
    },
    setPageStatus: (state, action: PayloadAction<HomePageState["pageStatus"]>) => {
      state.pageStatus = action.payload;
    },
  },
});

export const { setPosts, setPageStatus,setLibraryPosts,setExplorePosts,setYourPosts,setSearchPosts,setFollowersData } = homePageSlice.actions;

export default homePageSlice.reducer;
