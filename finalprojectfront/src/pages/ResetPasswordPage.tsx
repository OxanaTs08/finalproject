import {
  Box,
  Typography,
  Stack,
  TextField,
  styled,
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import MainButton from "../components/MainButton";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetState } from "../redux/userSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { RootState } from "../redux/store";
import Lock from "../assets/Img - Trouble logging in_.svg";

const StyledTextField = styled(TextField)(() => ({
  border: "1px solid #DBDBDB",
  borderRadius: "8px",
  color: " #737373",
  backgroundColor: "#FAFAFA",
  width: "268px",
}));

const StyledNavLink = styled(NavLink)(() => ({
  color: "rgba(40, 40, 40, 1)",
  textDecoration: "none",
  "&:hover": {
    cursor: "pointer",
    color: "rgba(40, 40, 40, 0.5)",
  },
}));

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, isLoading, isError, message } = useSelector(
    (state: RootState) => state.users
  );
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (!/^[A-Za-z ]+$/.test(value)) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!usernameError) {
      const loginData = username;
    }
  };

  return (
    <Stack>
      <Stack
        sx={{
          alignItems: "center",
          border: "1px solid #DBDBDB",
          padding: "40px 30px 40px 23px",
        }}
      >
        <Stack sx={{ padding: "40px 30px 40px 23px", gap: "10px" }}>
          <img
            src={Lock}
            alt="lock"
            style={{ width: "96px", height: "96px" }}
          />
          <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
            Trouble logging in?
          </Typography>
          <Typography sx={{ textAlign: "center", color: "#737373" }}>
            Enter your email, phone, or username and we'll send you a link to
            get back into your account.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack
              sx={{
                gap: "16px",
                alignItems: "center",
              }}
            >
              <StyledTextField
                label="Username"
                fullWidth
                margin="normal"
                type="text"
                value={username}
                inputProps={{
                  pattern: "[A-Za-z ]+",
                }}
                error={usernameError}
                helperText={
                  usernameError ? "Your name must contain only letters" : ""
                }
                onChange={handleNameChange}
              />

              <MainButton
                buttonText={"Reset Your Password"}
                type="submit"
                sx={{ width: "100%" }}
                disabled={isLoading}
              />
            </Stack>
          </form>
          <Divider>
            {" "}
            <Typography color="#737373">OR</Typography>{" "}
          </Divider>
          <StyledNavLink to="/">
            {" "}
            <Typography color="#00376B" sx={{ textAlign: "center" }}>
              Create New Account
            </Typography>{" "}
          </StyledNavLink>

          {isError && <Typography>{message}</Typography>}
        </Stack>
      </Stack>
      <Box
        sx={{
          alignItems: "center",
          border: "1px solid #DBDBDB",
          flexDirection: "row",
        }}
      >
        <StyledNavLink to="/">
          {" "}
          <Typography color="#0095F6" sx={{ textAlign: "center" }}>
            Back to LogIn
          </Typography>{" "}
        </StyledNavLink>
      </Box>
    </Stack>
  );
};

export default ResetPasswordPage;
