import {
  Avatar,
  Card,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useStore } from "../../store";
import { http } from "../../utils";

const UserStatus = () => {
  const { userStore } = useStore();
  const username = userStore.userInfo;
  const [status, setStatus] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchHeadline = async () => {
      const res = await http.get(`/headline/${username}`);
      setStatus(res.headline);
    };
    fetchHeadline();
    const fetchAvatar = async () => {
      const res = await http.get(`/avatar/${username}`);
      setAvatar(res.avatar);
    };
    fetchAvatar();
  }, []);

  const handleUpdate = () => {
    const newStatus = document.getElementById("newstatus").value;
    if (newStatus === "") {
      return;
    }
    const headline = {
      headline: newStatus,
    };
    // setStatus(newstatus);
    // userStore.setUserStatus(newstatus);
    // document.getElementById("newstatus").value = " ";
    const fetchHeadline = async () => {
      const res = await http.put(`/headline`, headline);
      setStatus(res.headline);
      document.getElementById("newstatus").value = "";
    };
    fetchHeadline();
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1, padding: 2 }}>
      <Stack
        direction="column"
        sx={{
          justifyContent: "space-between",
          flexGrow: "1",
          gap: 1,
          alignItems: "center",
        }}
      >
        {/* TODO: src */}
        <Avatar
          alt="User Avatar"
          sx={{ width: 100, height: 100 }}
          src={avatar}
        />
        <Typography component="h1" variant="h4">
          {username}
        </Typography>
        <Typography>{status}</Typography>
        <TextField
          id="newstatus"
          label="New Status"
          placeholder="your status"
          role="newstatus"
          variant="outlined"
          fullWidth
          size="small"
        />
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Stack>
    </Card>
  );
};

export default UserStatus;
