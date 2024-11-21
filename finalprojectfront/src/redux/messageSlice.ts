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

export const showAllMessages = createAsyncThunk(
  "message/showallmessages/",
  async (roomId: string, { getState, rejectWithValue }) => {
    try {
      const token =
        (getState() as RootState).users.token || localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authorization token is missing");
      }
      const response = await axios.post(
        `${API_URL}/showallmessages`,
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.messages;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    resetState: () => {
      initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(showAllMessages.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        showAllMessages.fulfilled,
        (state, action: PayloadAction<IMessage[]>) => {
          state.isLoading = false;
          state.messages = action.payload;
        }
      )
      .addCase(showAllMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetState } = messageSlice.actions;
export default messageSlice.reducer;
