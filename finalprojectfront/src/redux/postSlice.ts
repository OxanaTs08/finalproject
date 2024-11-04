import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

export interface IPost {
  _id: string;
  user: string;
  content: string;
  images: string[];
  likes?: string[];
  comments?: string[];
}

interface PostState {
  post: IPost | null;
  isLoading: boolean;
  isError: boolean;
  message: string | null;
  user: IPost | null;
  content: string | null;
  images: string[];
  likes: string[];
  comments: string[];
}

const API_URL = "http://localhost:4001/post";

const initialState: PostState = {
  post: null,
  isLoading: false,
  isError: false,
  message: null,
  user: null,
  content: null,
  images: [],
  likes: [],
  comments: [],
};

export const createPost = createAsyncThunk<IPost, FormData>(
  "post/create",
  async (post, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.post(`${API_URL}/create`, post);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const showPostById = createAsyncThunk(
  "post/id",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetState: () => {
      initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        createPost.fulfilled,
        (state, action: PayloadAction<IPost | null>) => {
          state.isLoading = false;
          state.post = action.payload;
        }
      )
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        if (state.isError !== null) {
          state.isError = true;
          state.message = action.payload as string;
        }
      });
  },
});

export const { resetState } = postSlice.actions;
export default postSlice.reducer;
