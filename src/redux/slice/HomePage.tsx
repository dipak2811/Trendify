import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomePageState {
  posts: any[];
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
    setPageStatus: (state, action: PayloadAction<HomePageState["pageStatus"]>) => {
      state.pageStatus = action.payload;
    },
  },
});

export const { setPosts, setPageStatus } = homePageSlice.actions;

export default homePageSlice.reducer;
