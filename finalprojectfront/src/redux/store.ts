import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import likeSlice from "./likeSlice";
import notificationSlice from "./notificationSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    posts: postSlice,
    likes: likeSlice,
    notifications: notificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
