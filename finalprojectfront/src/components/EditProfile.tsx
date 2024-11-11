import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  styled,
} from "@mui/material";
import { updatedUser } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import { useState } from "react";
import MainButton from "./MainButton";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { convertToBase64 } from "../utils/imageUtils";

const StyledTextField = styled(TextField)(() => ({
  border: "1px solid #DBDBDB",
  borderRadius: "8px",
  color: "#737373",
  backgroundColor: "#FAFAFA",
  width: "268px",
}));

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser
  );
  console.log("Current user", currentUser);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleEditProfile = async () => {
    if (!username || !description || !avatarUrl) {
      setErrorMessage("data is required.");
      console.error("data is required");
      return;
    }
    try {
      const newProfileData = {
        ...currentUser,
        username,
        description,
        avatarUrl,
      };
      console.log("updatedProfile", newProfileData);

      const result = await dispatch(updatedUser(newProfileData));
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
    handleEditProfile();
    navigate("/myprofile");
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64Image = await convertToBase64(file);
      setAvatarUrl(base64Image);
    }
  };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
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
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <StyledTextField
              type="text"
              label="username"
              placeholder="username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <StyledTextField
              type="text"
              label="description"
              placeholder="description"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <MainButton buttonText="Edit" type="submit" />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Х</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProfile;
