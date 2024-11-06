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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      const loginData = { username, password };
      dispatch(loginUser(loginData));
      navigate("/posts");
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!token || !savedToken) {
      dispatch(resetState());
      // const timer = setTimeout(() => {
      //   navigate("/MainPage");
      // }, 1000);
      // return () => clearTimeout(timer);
    }
  }, [token, navigate, dispatch, username]);

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
          }}
        >
          <Stack sx={{ padding: "40px 30px 40px 23px" }}>
            <img src={Logo} alt="Logo" />

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
            <Divider>
              {" "}
              <Typography color="#737373">OR</Typography>{" "}
            </Divider>
            <StyledNavLink to="/forgotpassword">
              {" "}
              <Typography color="#00376B" sx={{ textAlign: "center" }}>
                Forgot password
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
          <Typography color="#000000" sx={{ textAlign: "center" }}>
            Don't have an account
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
