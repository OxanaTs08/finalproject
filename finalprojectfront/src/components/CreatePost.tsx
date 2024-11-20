import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  styled,
  Box,
} from "@mui/material";
import { createPost } from "../redux/postSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { useState } from "react";
import MainButton from "./MainButton";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { convertMultipleFilesToBase64 } from "../utils/imageUtils";

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
  const [images, setImages] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user", currentUser);

  const handleCreatePost = async () => {
    console.log("Creating post with:", { images, content });
    if (!content || images.length === 0) {
      setErrorMessage("Both content and images are required.");
      console.error("Content and images are required");
      return;
    }
    try {
      const postData = { content, images };
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
    navigate("/myprofile");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const base64Images = await convertMultipleFilesToBase64(files);
      setImages(base64Images);
    }
  };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
    navigate("/myprofile");
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Create your Post"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <Box>
              {images.length > 0 && (
                <Box>
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`preview-${index}`}
                      style={{ width: "100px", margin: "5px" }}
                    />
                  ))}
                </Box>
              )}
            </Box>
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
