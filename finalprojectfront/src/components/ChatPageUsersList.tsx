// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import {
//   Box,
//   Typography,
//   ListItem,
//   List,
//   Avatar,
//   ListItemText,
// } from "@mui/material";
// import { useSelector } from "react-redux";
// import { useAppDispatch } from "../hooks/useAppDispatch";
// import { showRooms, RoomState } from "../redux/roomSlice";
// import { RootState } from "../redux/store";
// import { userById } from "../redux/userSlice";

// const sockets = io("http://localhost:4003");

// function ChatPageUsersList() {
//   const dispatch = useAppDispatch();

//   const currentUserId = useSelector(
//     (state: RootState) => state.users.currentUser?._id
//   );

//   const rooms: RoomState = useSelector((state: RootState) => state.rooms);
//   let room = rooms.find((room) => room.users.includes(currentUserId));
//   if (room) {
//     const receiver = room.users.filter((user) => user._id !== currentUserId)[0];
//   }

//   useEffect(() => {
//     if (receiver) {
//       dispatch(userById(receiver));
//     }
//   }, [dispatch, receiver]);

//   useEffect(() => {
//     if (currentUserId) {
//       dispatch(showRooms());
//     }
//   }, [dispatch, currentUserId]);

//   const [receiverId, setReceiverId] = useState<string | null>(null);
//   const location = useLocation();
//   const [value, setValue] = useState("");
//   const navigate = useNavigate();

//   // const handleUserClick = (selectedUser) => {
//   //   console.log("Selected user in handleuserclick function:", selectedUser);

//   //   if (!selectedUser._id) {
//   //     console.error("User.id is undefined");
//   //     return;
//   //   }
//   //   dispatch(userReceiver(selectedUser._id));
//   //   console.log("debug search receiver id:", selectedUser._id);

//   //   const params = new URLSearchParams(location.search);
//   //   params.set("receiverId", selectedUser._id);
//   //   navigate({ search: params.toString() });

//   //   console.log("Emitting selectedUser with receiverId:", receiverId);
//   //   sockets.emit("selectedtUser", {
//   //     receiverId: selectedUser._id,
//   //   });
//   // };

//   return (
//     <Box>
//       {rooms.length > 0 ? (
//         <List>
//           {rooms.map((room) => (
//             <ListItem key={room._id}>
//               {receiver && (
//                 <>
//                   <Avatar
//                     onClick={() => navigate(`/profile/${receiver?._id}`)}
//                     sx={{ cursor: "pointer" }}
//                     src={receiver?.avatarUrl}
//                   />
//                   <ListItemText primary={receiver.username} />
//                 </>
//               )}
//             </ListItem>
//           ))}
//         </List>
//       ) : (
//         <Typography variant="h6">No rooms</Typography>
//       )}
//     </Box>
//   );
// }

// export default ChatPageUsersList;
