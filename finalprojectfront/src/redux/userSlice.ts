import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { createSelector } from "reselect";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  description?: string;
  avatarUrl?: string;
  posts?: string[];
  savedPosts?: string[];
  comments?: string[];
  stories?: string[];
  followers?: string[];
  followings?: string[];
  yourLikes?: string[];
}

interface UserState {
  user: IUser | null;
  currentUser: IUser | null;
  token: string | null;
  isLoading: boolean;
  isError: boolean | null;
  message: string | null;
  description: string | null;
  posts: IUser[];
  savedPosts: IUser[];
  comments: IUser[];
  stories: IUser[];
  yourLikes: IUser[];
  followers: IUser[];
  followings: IUser[];
  users: IUser[];
}

const API_URL = "http://localhost:4001/user";

const initialState: UserState = {
  user: null,
  currentUser: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  isError: false,
  message: null,
  posts: [],
  savedPosts: [],
  description: null,
  comments: [],
  stories: [],
  yourLikes: [],
  followers: [] as IUser[],
  followings: [] as IUser[],
  users: [],
};

export const registerUser = createAsyncThunk<
  IUser,
  { username: string; email: string; password: string }
>("user/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { ...userData });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    // const message = error.response?.data?.message || error.message;
    return rejectWithValue(
      error.response?.data?.message || "registrion failed"
    );
  }
});

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    loginData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { ...loginData });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      // console.log(response.data);
      return { token, user };
    } catch (error: any) {
      // const message = error.response?.data?.message || error.message;
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const resetPasswordLink = createAsyncThunk(
  "user/resetPasswordLink",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/resetPasswordLink`, {
        email,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createNewPassword = createAsyncThunk(
  "user/createNewPassword/token",
  async (
    { newPassword, token }: { newPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/createNewPassword/${token}`,
        {
          newPassword,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const showCurrentUser = createAsyncThunk(
  "user/currentuser",
  async (_, { getState, rejectWithValue }) => {
    console.log("Fetching current user...");
    try {
      const token: string | null =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      console.log("Token:", token);
      const response = await axios.get(`${API_URL}/currentuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching current user:", error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const allUsers = createAsyncThunk(
  "users/showAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.users.token;
      const response = await axios.get(`${API_URL}/showAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data.users);
      return response.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userById = createAsyncThunk(
  "user/id",
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
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userByIdBody = createAsyncThunk(
  "user/showone/bybody",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.post(
        `${API_URL}/showone/bybody`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createFollowing = createAsyncThunk<IUser, { followingId: string }>(
  "user/following/tofollow",
  async ({ followingId }, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.put(
        `${API_URL}/following/tofollow`,
        { followingId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "failed to add follower"
      );
    }
  }
);

// export const deleteFollowing = createAsyncThunk<IUser, { followingId: string }>(
//   "user/deletefollowing/:followingId",
//   async ({ followingId }, { getState, rejectWithValue }) => {
//     try {
//       const token =
//         (getState() as RootState).users.token || localStorage.getItem("token");
//       if (!token) {
//         return rejectWithValue("Authorization token is missing");
//       }
//       const response = await axios.put(
//         `${API_URL}/deletefollowing/${followingId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data.user;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "failed to add follower"
//       );
//     }
//   }
// );

export const allOthers = createAsyncThunk(
  "users/showallexceptcurrentuser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/showallexceptcurrentuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data.users);
      return response.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchOwnFollowers = createAsyncThunk(
  "user/followers/ownfollowers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/followers/ownfollowers`);
      return response.data.followers;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const searchUsersByName = createAsyncThunk(
  "users/search/user",
  async (query: string, { getState, rejectWithValue }) => {
    try {
      const token: string | null =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.get(
        `${API_URL}/search/user?username=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updatedUser = createAsyncThunk(
  "users/edit",
  async (user: IUser, { getState, rejectWithValue }) => {
    try {
      const token: string | null =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.put(`${API_URL}/edit`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    setCurrentUser(state, action: PayloadAction<IUser | null>) {
      state.currentUser = action.payload;
    },
    // resetState: () => {
    //   initialState;
    // },
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<IUser | null>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        if (state.isError !== null) {
          state.isError = true;
          state.message = action.payload as string;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ user: IUser; token: string }>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.currentUser = action.payload.user;
          localStorage.setItem("token", action.payload.token);
          // localStorage.setItem(
          //   "currentUser",
          //   JSON.stringify(action.payload.user)
          // );
          // console.log("Logged in user:", action.payload.user);
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(showCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        showCurrentUser.fulfilled,
        (state, action: PayloadAction<{ user: IUser; token: string }>) => {
          state.isLoading = false;
          state.user = { ...action.payload.user };
          state.token = action.payload.token;
          state.currentUser = action.payload.user;
        }
      )
      .addCase(showCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || "Failed to fetch user";
      })
      .addCase(userById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(userById.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        // console.log(action.payload);
      })
      .addCase(userById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || "Failed to fetch user";
      })
      .addCase(
        userByIdBody.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          state.user = action.payload;
          console.log("userByIdBody in slice", action.payload);
        }
      )
      .addCase(userByIdBody.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || "Failed to fetch user";
      })
      .addCase(userByIdBody.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(allUsers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
        state.isLoading = false;
        state.users = action.payload as IUser[];
        // console.log(action.payload);
      })
      .addCase(allUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || "Failed to fetch users";
      })
      .addCase(allOthers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(allOthers.fulfilled, (state, action: PayloadAction<IUser[]>) => {
        state.isLoading = false;
        state.users = action.payload as IUser[];
        // console.log(action.payload);
      })
      .addCase(allOthers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = (action.payload as string) || "Failed to fetch users";
      })
      .addCase(createFollowing.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        createFollowing.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.isLoading = false;
          state.followings.push(action.payload);
          state.currentUser = action.payload;
        }
      )
      .addCase(createFollowing.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(resetPasswordLink.pending, (state) => {
        state.isLoading = true;
        state.message = null;
        state.isError = null;
      })
      .addCase(
        resetPasswordLink.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.message = action.payload.message;
        }
      )
      .addCase(resetPasswordLink.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(createNewPassword.pending, (state) => {
        state.isLoading = true;
        state.message = null;
        state.isError = null;
      })
      .addCase(
        createNewPassword.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.message = action.payload.message;
        }
      )
      .addCase(createNewPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // .addCase(deleteFollowing.pending, (state) => {
      //   state.isLoading = true;
      //   state.isError = false;
      //   state.message = null;
      // })
      // .addCase(
      //   deleteFollowing.fulfilled,
      //   (state, action: PayloadAction<IUser>) => {
      //     state.isLoading = false;
      //     state.currentUser = action.payload;
      //     state.followings = state.followings.filter(
      //       (following) => following._id !== action.payload._id
      //     );
      //   }
      // )
      // .addCase(deleteFollowing.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload as string;
      // })
      .addCase(fetchOwnFollowers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        fetchOwnFollowers.fulfilled,
        (state, action: PayloadAction<IUser[]>) => {
          state.isLoading = false;
          state.followers = action.payload;
        }
      )
      .addCase(fetchOwnFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(searchUsersByName.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(
        searchUsersByName.fulfilled,
        (state, action: PayloadAction<IUser[]>) => {
          state.isLoading = false;
          state.users = action.payload;
        }
      )
      .addCase(searchUsersByName.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updatedUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = null;
      })
      .addCase(updatedUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updatedUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetState, setCurrentUser, setToken } = userSlice.actions;

export const selectCurrentUserId = (state: RootState) =>
  state.users.currentUser?._id;

export const selectCurrentUser = (state: RootState) => state.users.currentUser;

export default userSlice.reducer;
