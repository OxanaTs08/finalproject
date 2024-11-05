import { Box, Typography, TextField, styled, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import MainButton from "../components/MainButton";
import { useNavigate } from "react-router-dom";
import DialogWindow from "../components/DialogWindow";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/userSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [submittedData, setSubmittedData] = useState(null);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (!/^[A-Za-z ]+$/.test(value)) {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }
  };

  const handleRegistration = async () => {
    try {
      const userData = { username, email, password };
      const result = await dispatch(registerUser(userData));
      const unwrappedResult = unwrapResult(result);
      handleClickOpen();
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
    if (!usernameError) {
      handleRegistration();
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, navigate]);

  return (
    <>
      <Stack
        sx={{
          gap: "10px",
          margin: "0 auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            alignItems: "center",
            border: "1px solid #DBDBDB",
            padding: "40px",
          }}
        >
          <Stack sx={{ padding: "40px 30px 40px 23px" }}>
            <img src={Logo} alt="Logo" />

            <Typography color="#737373">
              Sign Up To See Photos and Videos of your Friends
            </Typography>

            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <StyledTextField
                  label="username"
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
                  label="Enter Your Email"
                  fullWidth
                  margin="normal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <StyledTextField
                  label="Password"
                  fullWidth
                  margin="normal"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Stack>
                  <Typography color="#737373">
                    People who use our service may have uploaded
                  </Typography>
                  <Typography color="#737373">
                    your contact information to Instagram.
                    <StyledNavLink to="/#">
                      <Typography color="#00376B">Learn More</Typography>
                    </StyledNavLink>
                  </Typography>
                  <Typography color="#737373">
                    By signing up, you agree to our
                    <StyledNavLink to="/#">
                      <Typography color="#00376B">Terms</Typography>
                    </StyledNavLink>
                    ,
                    <StyledNavLink to="/#">
                      <Typography color="#00376B">Privacy Policy</Typography>
                    </StyledNavLink>
                    and
                    <StyledNavLink to="/#">
                      <Typography color="#00376B">Cookies Policy</Typography>
                    </StyledNavLink>
                  </Typography>
                </Stack>
                <MainButton
                  buttonText="Sign Up"
                  type="submit"
                  sx={{ width: "100%" }}
                />
              </Box>
              {errorMessage && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
            </form>
            <DialogWindow
              open={open}
              handleClose={handleClose}
              WindowText="You have successfully registered. You will be redirected to login Page"
            />

            <StyledNavLink to="/forgotpassword">
              {" "}
              <Typography color="#00376B" sx={{ textAlign: "center" }}>
                Forgot password
              </Typography>{" "}
            </StyledNavLink>
          </Stack>
        </Stack>
        <Box
          sx={{
            alignItems: "center",
            border: "1px solid #DBDBDB",
            flexDirection: "row",
            padding: "40px",
          }}
        >
          <Typography color="#000000" sx={{ textAlign: "center" }}>
            Have an account
          </Typography>{" "}
          <StyledNavLink to="/s">
            {" "}
            <Typography color="#0095F6" sx={{ textAlign: "center" }}>
              Sign In
            </Typography>{" "}
          </StyledNavLink>
        </Box>
      </Stack>
    </>
  );
};

export default RegisterPage;
