import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { IUser } from "./userSlice";
import { IRoom } from "./roomSlice";

export interface IMessage {
  sender: IUser[];
  receiver: IUser[];
  text: string;
  chatRoom: IRoom;
}

interface MessageState {
  sender: IUser[] | null;
  receiver: IUser[] | null;
  text: string | null;
  isLoading: boolean;
  isError: boolean;
  message: string | null;
  messages: IMessage[] | null;
  chatRoom: string | null;
}

const API_URL = "http://localhost:4003/message";

const initialState: MessageState = {
  isLoading: false,
  isError: false,
  message: null,
  sender: null,
  receiver: null,
  text: null,
  messages: null,
  chatRoom: null,
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

// export const showRooms = createAsyncThunk(
//   "room/showall",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const token =
//         (getState() as RootState).users.token || localStorage.getItem("token");
//       if (!token) {
//         return rejectWithValue("Authorization token is missing");
//       }
//       const response = await axios.get(`${API_URL}/showall`, {
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

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    resetState: () => {
      initialState;
    },
  },
  extraReducers: (builder) => {
    builder;
    // .addCase(showRooms.pending, (state) => {
    //   state.isLoading = true;
    //   state.isError = false;
    // })
    // .addCase(showRooms.fulfilled, (state, action: PayloadAction<Room>) => {
    //   state.isLoading = false;
    //   state.users = action.payload.users;
    //   state.messages = action.payload.messages;
    // })
    // .addCase(showRooms.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload as string;
    // });
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

export const { resetState } = messageSlice.actions;
export default messageSlice.reducer;
