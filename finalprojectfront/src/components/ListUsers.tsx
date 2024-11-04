import { Box, Grid } from "@mui/material";
import { IUser, allOthers } from "../redux/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import UserCard from "../components/UserCard";
import { Root } from "react-dom/client";
import { RootState } from "../redux/store";

const ListUsers = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(allOthers());
  }, [dispatch]);

  const usersData = useSelector((state: RootState) => state.users);
  const users = usersData.users;
  // console.log(typeof users, users, "in homepage");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        paddingTop: "40px",
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        {users &&
          users.map((user: IUser) => (
            <Grid item xs={12} sm={6} md={3} key={user._id}>
              <UserCard user={user} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default ListUsers;
