import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { IUser } from "./userSlice";
import { IPost } from "./postSlice";

export interface IComment {
  _id: string;
  post: IPost;
  user: IUser;
  text: string;
}

interface CommentState {
  user: IUser | null;
  post: IPost | null;
  comment: IComment | null;
  comments: IComment[] | null;
  text: string | null;
  isLoading: boolean;
  isError: boolean;
  message: string | null;
}

const API_URL = "http://localhost:4001/comment";

const initialState: CommentState = {
  isLoading: false,
  isError: false,
  message: null,
  user: null,
  post: null,
  text: null,
  comments: null,
  comment: null,
};

export const createComment = createAsyncThunk<
  IComment,
  { postId: String; text: String }
>(
  "comment/createcomment",
  async ({ postId, text }, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.post(
        `${API_URL}/createcomment`,
        { postId, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.comment;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const showAllComments = createAsyncThunk(
  "comment/showallcomment",
  async (postId: string, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.post(
        `${API_URL}/showallcomment`,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.comments;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    resetState: () => {
      initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        createComment.fulfilled,
        (state, action: PayloadAction<IComment>) => {
          state.isLoading = false;
          state.comment = action.payload;
        }
      )
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(showAllComments.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        showAllComments.fulfilled,
        (state, action: PayloadAction<IComment[]>) => {
          state.isLoading = false;
          state.comments = action.payload;
        }
      )
      .addCase(showAllComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetState } = commentSlice.actions;
export default commentSlice.reducer;
