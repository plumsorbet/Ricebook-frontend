import { Card, Typography, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useStore } from "../../store";
import { http } from "../../utils";

const NewPost = ({ onPostAdded }) => {
  const { userStore } = useStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);

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

  const handleFiles = (files) => {
    console.log("files: ", files);
    setFiles(files);
    // get files names
    const fileArray = Array.from(files);
    setFileNames(fileArray.map((file) => file.name));
  };

  const handlePost = () => {
    if (title === "" && content === "") {
      return;
    }
    // TODO: user
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", content);

    if (files) {
      formData.append("image", files[0]);
    }
    async function addPost() {
      try {
        const res = await http.post(`/article`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onPostAdded();
      } catch (e) {
        // setOpen(true);
        // setSnackbarMsg(e.response?.data);
      }
    }
    addPost();
    handleReset();
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setFileNames([]);
    setFiles([]);
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
          New Post
        </Typography>

        <TextField
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Title"
          variant="outlined"
          fullWidth
        />
        <TextField
          id="content"
          label="Content"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          // rows={4}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }} // 在小屏时纵向排列，大屏时横向排列
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Stack
            direction="row"
            sx={{ gap: 2, flexGrow: 1 }}
            alignItems="flex-start"
          >
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload image
              <VisuallyHiddenInput
                accept="image/*"
                type="file"
                onChange={(event) => handleFiles(event.target.files)}
              />
            </Button>
            <Stack direction="column">
              {fileNames.map((fileName, index) => (
                <Typography key={index}>{fileName}</Typography>
              ))}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            sx={{
              gap: 2,
              flexGrow: { xs: 1, sm: 0 },
              width: { xs: "100%", sm: "auto" },
            }}
            justifyContent="flex-end"
          >
            <Button variant="contained" color="primary" onClick={handlePost}>
              Post
            </Button>
            <Button variant="contained" color="secondary" onClick={handleReset}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default NewPost;
