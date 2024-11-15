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
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{
        mt: 4,
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: "300px",
          alignItems: "center",
          border: "1px solid #DBDBDB",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <Stack
          sx={{
            padding: "40px 30px 40px 23px",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <img
            src={Lock}
            alt="lock"
            style={{ width: "96px", height: "96px" }}
          />
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ textAlign: "center" }}
          >
            Trouble logging in?
          </Typography>
          <Typography
            sx={{ textAlign: "center", color: "#737373", fontSize: "14px" }}
          >
            Enter your email, phone, or username and we'll send you a link to
            get back into your account.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2} alignItems="center">
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
                sx={{ width: "100%", fontSize: "14px" }}
                disabled={isLoading}
              />
            </Stack>
          </form>
          <Divider sx={{ width: "100%", my: 2 }}>
            {" "}
            <Typography color="#737373" fontSize="14px">
              OR
            </Typography>{" "}
          </Divider>
          <StyledNavLink to="/">
            {" "}
            <Typography
              sx={{ textAlign: "center", fontSize: "14px", fontWeight: "bold" }}
            >
              Create New Account
            </Typography>{" "}
          </StyledNavLink>

          {isError && <Typography>{message}</Typography>}
        </Stack>
        <Box
          sx={{
            textAlign: "center",
            mt: 2,
            // alignItems: "center",
            border: "1px solid #DBDBDB",
            borderRadius: "8px",
            // flexDirection: "row",
            width: "100%",
            padding: "10px 0 10px 0",
            backgroundColor: "#FAFAFA",
          }}
        >
          <StyledNavLink to="/">
            {" "}
            <Typography
              sx={{ textAlign: "center", fontSize: "14px", fontWeight: "bold" }}
            >
              Back to Log In
            </Typography>{" "}
          </StyledNavLink>
        </Box>
      </Stack>
    </Stack>
  );
};

export default ResetPasswordPage;
