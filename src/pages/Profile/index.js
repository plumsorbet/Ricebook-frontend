import Nav from "../../components/Nav";
import {
  Container,
  Card,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useStore } from "../../store";
import { http } from "../../utils";
import { GoogleIcon } from "../../components/CustomIcons";

const Profile = () => {
  const { userStore } = useStore();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [avatar, setAvatar] = useState("");
  const [auth, setAuth] = useState([]);
  const [authMsg, setAuthMsg] = useState("");
  const [googleAuth, setGoogleAuth] = useState(false);

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

  // Snackbar
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchAuth = async () => {
      const res = await http.get(`/auth/status`);
      setAuth(res.auth);
      setGoogleAuth(res.googleAuth);
      console.log("auth response", res);
    };
    fetchAuth();
  }, [authMsg]);

  useEffect(() => {
    setUsername(userStore.userInfo);
    const fetchEmail = async () => {
      const res = await http.get(`/email/${username}`);
      setEmail(res.email);
    };
    fetchEmail();
    const fetchPhone = async () => {
      const res = await http.get(`/phone/${username}`);
      setPhone(res.phone);
    };
    fetchPhone();
    const fetchDob = async () => {
      const res = await http.get(`/dob/${username}`);
      setDob(res.dob);
    };
    fetchDob();
    const fetchZipcode = async () => {
      const res = await http.get(`/zipcode/${username}`);
      setZipcode(res.zipcode);
    };
    fetchZipcode();
    const fetchAvatar = async () => {
      const res = await http.get(`/avatar/${username}`);
      setAvatar(res.avatar);
    };
    fetchAvatar();
  }, []);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleAvatar = (files) => {
    if (files) {
      const formData = new FormData();
      formData.append("image", files[0]);
      async function updateAvatar() {
        try {
          const res = await http.put(`/avatar`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setAvatar(res.avatar);
        } catch (e) {
          console.log("Avatar error: ", e);
        }
      }
      updateAvatar();
    }
  };

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

    if (!password.value && !passwordConfirm.value) {
      setPasswordError(false);
      setPasswordErrorMessage("");
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

    // let age = today.getFullYear() - birthday.getFullYear();
    // const monthDifference = today.getMonth() - birthday.getMonth();

    // if (
    //   monthDifference < 0 ||
    //   (monthDifference === 0 && today.getDate() < birthday.getDate())
    // ) {
    //   age--;
    // }

    // if (age < 18) {
    //   setDobError(true);
    //   setDobErrorMessage("Unable to register if under the age of 18.");
    //   isValid = false;
    // } else if (!document.getElementById("dob").value) {
    //   setDobError(true);
    //   setDobErrorMessage("Please choose your date of birth.");
    //   isValid = false;
    // } else {
    //   setDobError(false);
    //   setDobErrorMessage("");
    // }

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      nameError ||
      emailError ||
      passwordError ||
      phoneError ||
      dobError ||
      zipcodeError
    ) {
      event.preventDefault();
      return;
    }
    setOpen(true);
    const data = new FormData(event.currentTarget);
    const emailData = { email: data.get("email") };
    const phoneData = { phone: data.get("phone") };
    const zipcodeData = { zipcode: data.get("zipcode") };
    const passwordData = { password: data.get("password") };
    const fetchEmail = async () => {
      const res = await http.put(`/email`, emailData);
    };
    fetchEmail();
    const fetchPhone = async () => {
      const res = await http.put(`/phone`, phoneData);
    };
    fetchPhone();
    const fetchZipcode = async () => {
      const res = await http.put(`/zipcode`, zipcodeData);
    };
    fetchZipcode();
    const fetchPassword = async () => {
      const res = await http.put(`/password`, passwordData);
    };
    if (data.get("password")) fetchPassword();
    // navigate("/home", { replace: true });
  };

  const handleLinkGoogle = () => {
    window.location.href =
      "https://ricesocialmedia-89d5147d4bd0.herokuapp.com/auth/google/link";
  };

  const handleUnlinkGoogle = () => {
    const unlinkGoogle = async () => {
      const res = await http.post("/auth/google/unlink");
      console.log("unlink google: ", res);
      setAuthMsg(res);
    };
    unlinkGoogle();
  };

  return (
    <Box>
      <Nav />
      <Container>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid size={{ xs: 18, md: 9, lg: 9 }}>
            <Card
              variant="outlined"
              sx={{
                width: "100%",
                maxWidth: "600px",
                padding: 2,
              }}
            >
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
                Edit Profile
              </Typography>
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Update Successfully."
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              />
              <Avatar
                alt="User Avatar"
                sx={{ width: 100, height: 100, mt: 1, mb: 1, mx: "auto" }}
                src={avatar}
              />
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                  maxWidth: "200px",
                }}
              >
                Upload avatar
                <VisuallyHiddenInput
                  accept="image/*"
                  type="file"
                  onChange={(event) => handleAvatar(event.target.files)}
                />
              </Button>
              {googleAuth === true ? (
                <Typography>
                  Google user can't link google account. Only normal user can
                  link.
                </Typography>
              ) : auth.google ? (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleUnlinkGoogle()}
                  startIcon={<GoogleIcon />}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    maxWidth: "200px",
                  }}
                >
                  Unlink Google Account
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleLinkGoogle()}
                  startIcon={<GoogleIcon />}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    maxWidth: "200px",
                  }}
                >
                  Link Google Account
                </Button>
              )}
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
                      value={username}
                      placeholder="Your username"
                      required
                      fullWidth
                      disabled
                      variant="outlined"
                      error={nameError}
                      helperText={nameErrorMessage}
                      color={nameError ? "error" : "primary"}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      name="displayname"
                      label="Display Name"
                      value={displayName}
                      placeholder="Your display name"
                      id="displayname"
                      fullWidth
                      variant="outlined"
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      id="email"
                      label="Email"
                      type="email"
                      name="email"
                      value={email}
                      placeholder="example@domain.com"
                      autoComplete="email"
                      required
                      fullWidth
                      variant="outlined"
                      error={emailError}
                      helperText={emailErrorMessage}
                      color={emailError ? "error" : "primary"}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      value={phone}
                      placeholder="123-123-1234"
                      autoComplete="phone"
                      required
                      fullWidth
                      variant="outlined"
                      error={phoneError}
                      helperText={phoneErrorMessage}
                      color={phoneError ? "error" : "primary"}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      id="dob"
                      label="Date of Birth"
                      type="date"
                      name="dob"
                      value={dob}
                      InputLabelProps={{ shrink: true }}
                      placeholder="example@domain.com"
                      autoComplete="email"
                      required
                      fullWidth
                      disabled
                      error={dobError}
                      helperText={dobErrorMessage}
                      color={dobError ? "error" : "primary"}
                      // onChange={(e) => setDob(e.target.value)}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      id="zipcode"
                      label="ZIP Code"
                      name="zipcode"
                      placeholder="77005"
                      value={zipcode}
                      required
                      fullWidth
                      variant="outlined"
                      error={zipcodeError}
                      helperText={zipcodeErrorMessage}
                      color={zipcodeError ? "error" : "primary"}
                      onChange={(e) => setZipcode(e.target.value)}
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
                      placeholder="Your password confirmation"
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
                  update
                </Button>
              </Box>
            </Card>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
