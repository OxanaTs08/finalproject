import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import postSlice from "./postSlice";
import likeSlice from "./likeSlice";
import notificationSlice from "./notificationSlice";
import roomSlice from "./roomSlice";
import messageSlice from "./messageSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    posts: postSlice,
    likes: likeSlice,
    notifications: notificationSlice,
    rooms: roomSlice,
    messages: messageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
