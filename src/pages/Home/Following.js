import {
  Card,
  Typography,
  Stack,
  TextField,
  Button,
  Avatar,
  Box,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useStore } from "../../store";
import { http } from "../../utils";

const Following = ({ setFollowingIds }) => {
  const { userStore } = useStore();
  const [followings, setFollowings] = useState([]);
  const username = userStore.userInfo;

  const [open, setOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    // const updatedFollowingUserIds = [
    //   (currentUserId + 1) % 10 === 0 ? 10 : (currentUserId + 1) % 10,
    //   (currentUserId + 2) % 10 === 0 ? 10 : (currentUserId + 2) % 10,
    //   (currentUserId + 3) % 10 === 0 ? 10 : (currentUserId + 3) % 10,
    // ];

    // if (currentUserId <= 0 || currentUserId > 10) {
    //   setFollowingUserIds([]);
    // } else {
    //   setFollowingUserIds(updatedFollowingUserIds);
    //   setFollowingIds(updatedFollowingUserIds);
    // }

    async function fetchFollowings() {
      const res = await http.get(`/following/${username}`);
      setFollowings(res.followingProfiles);
      setFollowingIds(res.following);
    }
    fetchFollowings();
  }, []);

  const handleAdd = async () => {
    const newFollowing = document.getElementById("newfollowing").value;
    async function addFollowing() {
      try {
        const res = await http.put(`/following/${newFollowing}`);
        setFollowings(res.followingProfiles);
        setFollowingIds(res.following);
      } catch (e) {
        setOpen(true);
        setSnackbarMsg(e.response?.data);
      }
    }
    addFollowing();
    // const response = await fetch("https://jsonplaceholder.typicode.com/users");
    // const data = await response.json();
    // const filteredUsers = data.filter(
    //   (user) => user.id === Number(newFollowing.value)
    // );

    // if (filteredUsers.length !== 0) {
    //   const newUser = filteredUsers[0];
    //   if (currentUserId == newUser.id) {
    //     setOpen(true);
    //     setSnackbarMsg("Can't follow yourself.");
    //   } else if (!followingUserIds.includes(newUser.id)) {
    //     setFollowings((prevFollowings) => [newUser, ...prevFollowings]);
    //     setFollowingUserIds((prevIds) => [
    //       ...new Set([newUser.id, ...prevIds]),
    //     ]);
    //     setFollowingIds((prevIds) => [...new Set([newUser.id, ...prevIds])]);
    //   } else {
    //     setOpen(true);
    //     setSnackbarMsg("Already followed.");
    //   }
    // } else {
    //   setOpen(true);
    //   setSnackbarMsg("Invalid user.");
    // }
  };

  const handleUnfollow = (unfollow) => {
    // setFollowings((prevFollowings) =>
    //   prevFollowings.filter((following) => following.id !== id)
    // );
    // setFollowingUserIds((prevIds) =>
    //   prevIds.filter((followingId) => followingId !== id)
    // );
    // setFollowingIds((prevIds) =>
    //   prevIds.filter((followingId) => followingId !== id)
    // );
    async function deleteFollowing() {
      try {
        const res = await http.delete(`/following/${unfollow}`);
        setFollowings(res.followingProfiles);
        setFollowingIds(res.following);
      } catch (e) {
        setOpen(true);
        setSnackbarMsg(e.response?.data);
      }
    }
    deleteFollowing();
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1, padding: 2 }}>
      <Stack
        direction="column"
        sx={{
          justifyContent: "space-between",
          flexGrow: "1",
          gap: 1,
        }}
      >
        <Typography component="h1" variant="h5">
          Following Users
        </Typography>
        <TextField
          id="newfollowing"
          label="New Following"
          variant="outlined"
          placeholder="user ID"
          fullWidth
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          sx={{ mb: 2 }}
        >
          Add Follower
        </Button>
        {followings.map((following, index) => (
          <Box key={index}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "flex-start" }}
            >
              <Avatar
                sx={{ width: 60, height: 60 }}
                src={following.avatar}
              ></Avatar>
              <Stack direction="column">
                <Typography component="h1" variant="h6">
                  {following.username}
                </Typography>
                <Typography>{following.headline}</Typography>
              </Stack>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
              <Button onClick={() => handleUnfollow(following.username)}>
                Unfollow
              </Button>
            </Stack>
          </Box>
        ))}
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          message={snackbarMsg}
        />
      </Stack>
    </Card>
  );
};

export default Following;
