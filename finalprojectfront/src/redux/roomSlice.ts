import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { IUser } from "./userSlice";
import { IMessage } from "./messageSlice";

export interface IRoom {
  _id: string;
  users: IUser[];
  messages: IMessage[];
}

export interface RoomState {
  _id: string;
  users: IUser[] | null;
  messages: IMessage[] | null;
  isLoading: boolean;
  isError: boolean;
  message: string | null;
  rooms: IRoom[] | null;
}

const API_URL = "http://localhost:4003/room";

const initialState: RoomState = {
  _id: "",
  isLoading: false,
  isError: false,
  message: null,
  users: null,
  messages: null,
  rooms: null,
};

// export const createLike = createAsyncThunk<ILike, { postId: String }>(
//   "post/like/createlikeinlist",
//   async ({ postId: postId }, { getState, rejectWithValue }) => {
//     try {
//       const token =
//         (getState() as RootState).users.token || localStorage.getItem("token");
//       if (!token) {
//         return rejectWithValue("Authorization token is missing");
//       }
//       const response = await axios.post(
//         `${API_URL}/like/createlikeinlist`,
//         { postId },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );

export const showRooms = createAsyncThunk(
  "room/showall",
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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    resetState: () => {
      initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(showRooms.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(showRooms.fulfilled, (state, action: PayloadAction<IRoom>) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.messages = action.payload.messages;
      })
      .addCase(showRooms.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
    // .addCase(createLike.pending, (state) => {
    //   state.isLoading = true;
    //   state.isError = false;
    // })
    // .addCase(createLike.fulfilled, (state, action: PayloadAction<ILike>) => {
    //   state.isLoading = false;
    //   state.users = action.payload.users;
    //   state.posts = action.payload.posts;
    // })
    // .addCase(createLike.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload as string;
    // });
  },
});

export const { resetState } = roomSlice.actions;
export default roomSlice.reducer;
