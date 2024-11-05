import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import likeSlice from "./likeSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    posts: postSlice,
    likes: likeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
