import {
  Box,
  Typography,
  Stack,
  TextField,
  styled,
  Divider,
  Alert,
} from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import MainButton from "../components/MainButton";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewPassword } from "../redux/userSlice";
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

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useParams();
  const { isLoading, isError, message } = useSelector(
    (state: RootState) => state.users
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordError(false);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setMatchError(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        setMatchError(true);
        return;
      }
      console.log("token", token);
      if (token) {
        dispatch(createNewPassword({ newPassword: newPassword, token }));
        setFormError(null);
        navigate("/");
      }
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
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
            Create new Password
          </Typography>
          <Typography
            sx={{ textAlign: "center", color: "#737373", fontSize: "14px" }}
          >
            Enter new password.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2} alignItems="center">
              <StyledTextField
                label="Password"
                fullWidth
                margin="normal"
                type="password"
                value={newPassword}
                error={passwordError}
                helperText={
                  passwordError ? "Password must be at least 8 characters" : ""
                }
                onChange={handlePasswordChange}
              />
              <StyledTextField
                label=" Confirm Password"
                fullWidth
                margin="normal"
                type="password"
                value={confirmPassword}
                error={matchError}
                helperText={matchError ? "Password does not match" : ""}
                onChange={handleConfirmPasswordChange}
              />
              {formError && <Alert severity="error">{formError}</Alert>}

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
          <StyledNavLink to="/register">
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

export default ChangePasswordPage;
