import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
  styled,
} from "@mui/material";
import { searchUsersByName } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useEffect, useState } from "react";

const StyledTextField = styled(TextField)(() => ({
  border: "1px solid #DBDBDB",
  borderRadius: "8px",
  color: " #737373",
  backgroundColor: "#FAFAFA",
}));

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const users = useSelector((state: RootState) => state.users.users);
  const isLoading = useSelector((state: RootState) => state.users.isLoading);
  const isError = useSelector((state: RootState) => state.users.isError);

  useEffect(() => {
    if (query) {
      console.log("query", query);
      dispatch(searchUsersByName(query));
    }
  }, [dispatch, query]);
  return (
    <Box>
      <StyledTextField
        fullWidth
        margin="normal"
        type="text"
        label="Search users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        // onChange={handleNameChange}
      />
      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography color="error">{isError}</Typography>}
      {users.length > 0 && (
        <List>
          {users.map((user) => (
            <ListItem key={user._id}>
              <Avatar
                onClick={() => navigate(`/profile/${user._id}`)}
                sx={{ cursor: "pointer" }}
                src={user.avatarUrl}
              />
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Search;
