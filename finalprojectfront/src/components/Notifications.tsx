import {
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import { showNotifications } from "../redux/notificationSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";

const Notifications = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  useEffect(() => {
    dispatch(showNotifications());
  }, [dispatch]);

  return (
    <Box>
      {notifications.length > 0 ? (
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification._id}>
              {notification.sender && (
                <>
                  <Avatar
                    onClick={() =>
                      navigate(`/profile/${notification.sender?._id}`)
                    }
                    sx={{ cursor: "pointer" }}
                    src={notification.sender?.avatarUrl}
                  />
                  <ListItemText primary={notification.sender?.username} />
                </>
              )}
              <ListItemText primary={notification.type} />
              {notification.post && (
                <Avatar
                  onClick={() => navigate(`/post/${notification.post?._id}`)}
                  sx={{ cursor: "pointer" }}
                  src={notification.post?.images[0]}
                />
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="h6">No notifications</Typography>
      )}
    </Box>
  );
};

export default Notifications;
