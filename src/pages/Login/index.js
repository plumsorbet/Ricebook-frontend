import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Divider,
  Box,
  FormControl,
  Link,
  Typography,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import { GoogleIcon, SitemarkIcon } from "../../components/CustomIcons";
import { useStore } from "../../store";
import { http } from "../../utils";

const Login = () => {
  const { userStore } = useStore();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  // Snackbar
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }
    const data = new FormData(event.currentTarget);
    const userInfo = {
      username: data.get("username"),
      password: data.get("password"),
    };
    try {
      const response = await http.post("/login", userInfo);

      if (response.result === "success") {
        userStore.setUserInfo(data.get("username"));
        navigate("/home", { replace: true });
      }
    } catch (e) {
      setOpen(true);
      console.log("Login error: ", e);
    }
    // navigate("/home", { replace: true });
  };

  const validateInputs = () => {
    const password = document.getElementById("password");

    let isValid = true;

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleGoogleOAuth = async () => {
    window.location.href =
      "https://ricesocialmedia-89d5147d4bd0.herokuapp.com/auth/google";
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{ padding: 2, width: "100%", textAlign: "center" }}
      >
        <SitemarkIcon />
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            textAlign: "center",
            mb: 2,
          }}
        >
          Sign In
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
          onSubmit={handleSubmit}
        >
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Invalid username or password."
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />
          <FormControl>
            <TextField
              id="username"
              label="Username"
              name="username"
              placeholder="your username"
              autoComplete="username"
              autoFocus
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <TextField
              name="password"
              label="Password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            // onClick={validateInputs}
          >
            Sign IN
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span>
              <Link
                href="/register"
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                Sign Up
              </Link>
            </span>
          </Typography>
        </Box>
        <Divider sx={{ mt: 1, mb: 1 }}>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleGoogleOAuth()}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
