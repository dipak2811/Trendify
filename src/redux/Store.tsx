// store.ts
import { configureStore } from "@reduxjs/toolkit";
import pageStatusReducer from "./slice/HomePage";

const store = configureStore({
  reducer: {
    pageStatus: pageStatusReducer,
  },
});

export default store;
