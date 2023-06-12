import { configureStore } from "@reduxjs/toolkit";
import pageStatusReducer from "./slice/HomePage";

const store = configureStore({
  reducer: {
    pageDetails: pageStatusReducer,
  },
});

export default store;
