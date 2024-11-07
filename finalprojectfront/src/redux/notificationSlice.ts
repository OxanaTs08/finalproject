import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { IUser } from "./userSlice";
import { IPost } from "./postSlice";

export interface INotification {
  _id: string;
  userId: string;
  senderId: string;
  type: string;
  postId?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: INotification[];
  isLoading: boolean;
  isError: boolean;
  message: string | null;
}

const API_URL = "http://localhost:4001/notification";

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  isError: false,
  message: null,
};

export const createNotification = createAsyncThunk<
  INotification,
  { postId?: String; userId: string; type: string },
  { state: RootState }
>(
  "notification/create",
  async ({ postId, userId, type }, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.post(
        `${API_URL}/create`,
        { postId, userId, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.newNotification;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const showNotifications = createAsyncThunk<INotification[]>(
  "notification/showall",
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

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetState: () => {
      initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNotification.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        createNotification.fulfilled,
        (state, action: PayloadAction<INotification>) => {
          state.isLoading = false;
          state.notifications.push(action.payload);
          state.isError = false;
          state.message = null;
        }
      )
      .addCase(createNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(showNotifications.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        showNotifications.fulfilled,
        (state, action: PayloadAction<INotification[]>) => {
          state.isLoading = false;
          state.notifications = action.payload;
          state.isError = false;
          state.message = null;
        }
      )
      .addCase(showNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetState } = notificationSlice.actions;
export default notificationSlice.reducer;
