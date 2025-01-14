import {
  Container,
  Paper,
  Box,
  Link,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SitemarkIcon } from "../../components/CustomIcons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { http } from "../../utils";

const Register = () => {
  const navigate = useNavigate();
  const { userStore } = useStore();
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [dobError, setDobError] = useState(false);
  const [dobErrorMessage, setDobErrorMessage] = useState("");
  const [zipcodeError, setZipcodeError] = useState(false);
  const [zipcodeErrorMessage, setZipcodeErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const passwordConfirm = document.getElementById("passwordConfirm");
    const name = document.getElementById("username");
    const phone = document.getElementById("phone");
    const birthday = new Date(document.getElementById("dob").value);
    const today = new Date();
    const zipcode = document.getElementById("zipcode");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || !passwordConfirm.value) {
      setPasswordError(true);
      setPasswordErrorMessage("Please enter passwords.");
      isValid = false;
    } else if (password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else if (password.value !== passwordConfirm.value) {
      setPasswordError(true);
      setPasswordErrorMessage("Passwords do not match.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || !/^[a-zA-Z][a-zA-Z0-9]{2,15}$/.test(name.value)) {
      setNameError(true);
      setNameErrorMessage(
        "Please only contain letters and numbers, but don't start with a number."
      );
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!phone.value || !/\d{3}-\d{3}-\d{4}/.test(phone.value)) {
      setPhoneError(true);
      setPhoneErrorMessage("Please enter a valid phone number.");
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }

    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      setDobError(true);
      setDobErrorMessage("Unable to register if under the age of 18.");
      isValid = false;
    } else if (!document.getElementById("dob").value) {
      setDobError(true);
      setDobErrorMessage("Please choose your date of birth.");
      isValid = false;
    } else {
      setDobError(false);
      setDobErrorMessage("");
    }

    if (!zipcode.value || !/^\d{5}$/.test(zipcode.value)) {
      setZipcodeError(true);
      setZipcodeErrorMessage("Please enter a valid ZIP Code.");
      isValid = false;
    } else {
      setZipcodeError(false);
      setZipcodeErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const userInfo = {
      username: data.get("username"),
      email: data.get("email"),
      phone: data.get("phone"),
      dob: data.get("dob"),
      zipcode: data.get("zipcode"),
      password: data.get("password"),
    };
    try {
      const response = await http.post("/register", userInfo);

      if (response.result === "success") {
        console.log("Registration successful");
        userStore.setUserInfo(data.get("username"));
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Register failed error: ", error);
      if (error.response?.data === "Username already taken.") {
        setNameError(true);
        setNameErrorMessage("Duplicate username.");
      } else {
        alert(error.response?.data || "Register failed, please try again.");
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
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
          Sign Up
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
            flexGrow: 1,
          }}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                id="username"
                label="Username"
                name="username"
                placeholder="Your username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                name="displayname"
                label="Display Name"
                placeholder="Your display name"
                id="displayname"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                id="email"
                label="Email"
                type="email"
                name="email"
                placeholder="example@domain.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                id="phone"
                label="Phone Number"
                name="phone"
                placeholder="123-123-1234"
                autoComplete="phone"
                required
                fullWidth
                variant="outlined"
                error={phoneError}
                helperText={phoneErrorMessage}
                color={phoneError ? "error" : "primary"}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                id="dob"
                label="Date of Birth"
                type="date"
                name="dob"
                InputLabelProps={{ shrink: true }}
                placeholder="example@domain.com"
                autoComplete="email"
                required
                fullWidth
                error={dobError}
                helperText={dobErrorMessage}
                color={dobError ? "error" : "primary"}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                id="zipcode"
                label="ZIP Code"
                name="zipcode"
                placeholder="77005"
                autoComplete="zipcode"
                required
                fullWidth
                variant="outlined"
                error={zipcodeError}
                helperText={zipcodeErrorMessage}
                color={zipcodeError ? "error" : "primary"}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                id="password"
                label="Password"
                name="password"
                type="password"
                placeholder="Your password"
                required
                fullWidth
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                id="passwordConfirm"
                label="Password Confirmation"
                name="passwordConfirm"
                type="password"
                placeholder="Your password"
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Sign up
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <span>
              <Link href="/" variant="body2" sx={{ alignSelf: "center" }}>
                Sign In
              </Link>
            </span>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
