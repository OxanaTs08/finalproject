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
import bcgImage1 from "../assets/BackgroundLoginPage.png";
import Logo from "../assets/ICHGRALOGO 2.png";

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

const LogInPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, isLoading, isError, message } = useSelector(
    (state: RootState) => state.users
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailError) {
      const loginData = { email, password };
      dispatch(loginUser(loginData));
    } else {
      setErrorMessage("Please enter a valid email address.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/posts");
    }
    if (isError) {
      setErrorMessage(message ?? "");
    }
  }, [token, isError, message, navigate]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!token || !savedToken) {
      dispatch(resetState());
      navigate("/");
    }
  }, [token, navigate, dispatch, email]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px",
        gap: "30px",
      }}
    >
      <Box>
        <img
          src={bcgImage1}
          alt="background"
          style={{
            width: "380px",
            height: "581px",
          }}
        />
      </Box>
      <Stack sx={{ gap: "10px" }}>
        <Stack
          sx={{
            alignItems: "center",
            border: "1px solid #DBDBDB",
            padding: "40px",
            width: "350px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ marginBottom: "24px" }}>
            <img src={Logo} alt="Logo" />
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack
              sx={{
                gap: "6px",
                alignItems: "center",
              }}
            >
              <StyledTextField
                label="Email"
                fullWidth
                margin="normal"
                type="text"
                value={email}
                error={emailError}
                helperText={emailError ? "Enter a valid email address" : ""}
                onChange={handleEmailChange}
              />
              <StyledTextField
                label="Password"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <MainButton
                buttonText={isLoading ? "Loading..." : "LogIn"}
                type="submit"
                sx={{ width: "100%" }}
                disabled={isLoading}
              />
            </Stack>
          </form>
          {isError && (
            <Typography color="error" sx={{ textAlign: "center" }}>
              {errorMessage}
            </Typography>
          )}
          <Divider sx={{ margin: "20px 0 20px 0", width: "100%" }}>
            {" "}
            <Typography color="#737373">OR</Typography>{" "}
          </Divider>
          <StyledNavLink to="/forgotpassword">
            {" "}
            <Typography color="#00376B" sx={{ textAlign: "center" }}>
              Forgot password
            </Typography>{" "}
          </StyledNavLink>
        </Stack>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #DBDBDB",
            flexDirection: "row",
            justifyContent: "center",
            padding: "20px",
            marginTop: "10px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            color="#000000"
            sx={{ textAlign: "center", marginRight: "5px" }}
          >
            Don't have an account?
          </Typography>{" "}
          <StyledNavLink to="/register">
            {" "}
            <Typography color="#0095F6" sx={{ textAlign: "center" }}>
              Sign Up
            </Typography>{" "}
          </StyledNavLink>
        </Box>
      </Stack>
    </Box>
  );
};

export default LogInPage;
