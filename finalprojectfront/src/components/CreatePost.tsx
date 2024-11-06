import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  styled,
} from "@mui/material";
import { createPost } from "../redux/postSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { useState } from "react";
import MainButton from "./MainButton";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

const StyledTextField = styled(TextField)(() => ({
  border: "1px solid #DBDBDB",
  borderRadius: "8px",
  color: "#737373",
  backgroundColor: "#FAFAFA",
  width: "268px",
}));

const CreatePost = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [images, setImages] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUserId = useSelector(
    (state: RootState) => state.users.currentUser?._id
  );
  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user", currentUser);

  const handleCreatePost = async () => {
    console.log("Creating post with:", { images, content });
    if (!content || !images) {
      setErrorMessage("Both content and images are required.");
      console.error("Content and images are required");
      return;
    }
    try {
      // const formData = new FormData();
      // formData.append("content", content);
      // formData.append("images", images);

      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }
      const postData = { content, images: [images] };
      console.log("postData", postData);

      const result = await dispatch(createPost(postData));
      const unwrappedResult = unwrapResult(result);
      handleClose();
      console.log(unwrappedResult);
    } catch (error: any) {
      setErrorMessage(
        error.message || "An error occurred during registration."
      );
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreatePost();
    navigate("/MainPage");
  };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* <Backdrop
        open={open}
        onClick={handleClose}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1000,
          position: "absolute",
          left: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      /> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Create your Post"}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText> */}
          <form onSubmit={handleSubmit}>
            {/* <input
              type="file"
              hidden
              //  onChange={}
            /> */}
            <StyledTextField
              type="text"
              label="images"
              placeholder="images"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={images}
              onChange={(e) => setImages(e.target.value)}
            />
            <StyledTextField
              type="text"
              label="Write your post"
              placeholder="Write your post"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <MainButton buttonText="Post" type="submit" />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Х</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreatePost;
