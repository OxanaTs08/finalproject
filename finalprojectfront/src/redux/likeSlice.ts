import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { IUser } from "./userSlice";
import { IPost } from "./postSlice";

export interface ILike {
  users: IUser[];
  posts: IPost[];
}

interface LikeState {
  users: IUser[] | null;
  posts: IPost[] | null;
  isLoading: boolean;
  isError: boolean;
  message: string | null;
}

const API_URL = "http://localhost:4001/post";

const initialState: LikeState = {
  isLoading: false,
  isError: false,
  message: null,
  users: null,
  posts: null,
};

export const createLike = createAsyncThunk<ILike, { postId: String }>(
  "post/like/createlikeinlist",
  async ({ postId }, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.post(
        `${API_URL}/like/createlikeinlist`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const likeSlice = createSlice({
  name: "posts.likes",
  initialState,
  reducers: {
    resetState: () => {
      initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLike.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createLike.fulfilled, (state, action: PayloadAction<ILike>) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.posts = action.payload.posts;
      })
      .addCase(createLike.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetState } = likeSlice.actions;
export default likeSlice.reducer;
