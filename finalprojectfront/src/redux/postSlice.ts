import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { IUser } from "./userSlice";

export interface IPost {
  _id: string;
  user: IUser;
  content: string;
  images: string[];
  likes?: string[];
  comments?: string[];
  createdAt: string;
}

interface PostState {
  post: IPost | null;
  isLoading: boolean;
  isError: boolean;
  message: string | null;
  user: IUser | null;
  content: string | null;
  images: string[];
  likes: string[];
  comments: string[];
  posts: IPost[];
  createdAt: string;
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
  posts: [],
  createdAt: "",
};

// export const createPost = createAsyncThunk<IPost, FormData>(
//   "post/create",
//   async (post, { getState, rejectWithValue }) => {
//     try {
//       const token =
//         (getState() as RootState).users.token || localStorage.getItem("token");
//       if (!token) {
//         return rejectWithValue("Authorization token is missing");
//       }
//       const response = await axios.post(`${API_URL}/create`, post, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

export const createPost = createAsyncThunk<
  IPost,
  { content: string; images: string[] }
>("post/create", async (post, { getState, rejectWithValue }) => {
  try {
    const token =
      (getState() as RootState).users.token || localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Authorization token is missing");
    }
    const response = await axios.post(`${API_URL}/create`, post, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const showPostById = createAsyncThunk(
  "post/id",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response.data);
      return response.data.post;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const postsByUser = createAsyncThunk(
  "post/showown",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.get(`${API_URL}/showown`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.posts;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const showPostsByFollowings = createAsyncThunk(
  "post/postsbyfollowings",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.get(`${API_URL}/all/byourfollowings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.posts;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const showAllPosts = createAsyncThunk(
  "post/showall",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.get(`${API_URL}/showall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.posts;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const postsByAnotherUser = createAsyncThunk(
  "post/user/:id",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.get(`${API_URL}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.posts;
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
      })
      .addCase(postsByUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        postsByUser.fulfilled,
        (state, action: PayloadAction<IPost[] | null>) => {
          state.isLoading = false;
          state.posts = action.payload as IPost[];
        }
      )
      .addCase(postsByUser.rejected, (state, action) => {
        state.isLoading = false;
        if (state.isError !== null) {
          state.isError = true;
          state.message = action.payload as string;
        }
      })
      .addCase(showPostsByFollowings.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        showPostsByFollowings.fulfilled,
        (state, action: PayloadAction<IPost[] | null>) => {
          state.isLoading = false;
          state.posts = action.payload as IPost[];
        }
      )
      .addCase(showPostsByFollowings.rejected, (state, action) => {
        state.isLoading = false;
        if (state.isError !== null) {
          state.isError = true;
          state.message = action.payload as string;
        }
      })
      .addCase(showAllPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        showAllPosts.fulfilled,
        (state, action: PayloadAction<IPost[] | null>) => {
          state.isLoading = false;
          state.posts = action.payload as IPost[];
        }
      )
      .addCase(showAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        if (state.isError !== null) {
          state.isError = true;
          state.message = action.payload as string;
        }
      })
      .addCase(showPostById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        showPostById.fulfilled,
        (state, action: PayloadAction<IPost | null>) => {
          state.isLoading = false;
          state.post = action.payload;
        }
      )
      .addCase(showPostById.rejected, (state, action) => {
        state.isLoading = false;
        if (state.isError !== null) {
          state.isError = true;
          state.message = action.payload as string;
        }
      })
      .addCase(postsByAnotherUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        postsByAnotherUser.fulfilled,
        (state, action: PayloadAction<IPost[] | null>) => {
          state.isLoading = false;
          state.posts = action.payload as IPost[];
        }
      )
      .addCase(postsByAnotherUser.rejected, (state, action) => {
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
