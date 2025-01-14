import {
  Card,
  Typography,
  Stack,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider,
  InputAdornment,
  Pagination,
  IconButton,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import MyCarousel from "../../components/Carousel";
import SearchIcon from "@mui/icons-material/Search";
import { useStore } from "../../store";
import { http } from "../../utils";

const PostList = ({ posts, fetchPosts }) => {
  const { userStore } = useStore();
  const [username, setUsername] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // 存储搜索关键词
  const [filteredPosts, setFilteredPosts] = useState(posts); // 存储过滤后的帖子
  const [activeCommentIndex, setActiveCommentIndex] = useState(null); // active comment
  const [editPost, setEditPost] = useState(null); // 当前编辑的帖子
  const [editedContent, setEditedContent] = useState(""); // 存储编辑后的内容
  const [editComment, setEditComment] = useState(null); // 当前编辑的评论
  const [editedCommentContent, setEditedCommentContent] = useState(""); // 存储编辑后的评论内容

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setActiveCommentIndex(null);
  };

  useEffect(() => {
    setUsername(userStore.userInfo);
    handleSearch(); // 每次posts变化时更新filteredPosts
  }, [posts]);

  const handleSearch = () => {
    const newFilteredPosts = posts.filter(
      (post) =>
        (post.title &&
          post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.text &&
          post.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (post.author &&
          post.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(newFilteredPosts);
    setCurrentPage(1);
  };

  const toggleCommentSection = (index) => {
    setActiveCommentIndex(activeCommentIndex === index ? null : index);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  const handleComment = (articleId) => {
    const textField = document.getElementById("comment-input");
    console.log("textField.value: ", textField.value);
    const addComment = async () => {
      const comment = { text: textField.value, commentId: -1 };
      const res = await http.put(`/articles/${articleId}`, comment);
      fetchPosts();
    };
    addComment();
    textField.value = "";
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setEditedContent(post.text); // 初始化编辑内容
  };

  const handleSaveEdit = async () => {
    if (editPost) {
      // 更新帖子内容
      const updatedPost = { ...editPost, text: editedContent };
      await http.put(`/articles/${editPost.pid}`, updatedPost); // 假设 API 使用 pid 来标识帖子
      fetchPosts(); // 获取更新后的帖子列表
      setEditPost(null); // 退出编辑模式
    }
  };

  const handleCancelEdit = () => {
    setEditPost(null); // 取消编辑
  };

  const handleEditComment = (comment, postIndex) => {
    setEditComment({ ...comment, postIndex });
    setEditedCommentContent(comment.comment);
  };

  const handleSaveEditedComment = async (articleId, commentId) => {
    if (editComment) {
      const updatedComment = {
        ...editComment,
        commentId: commentId,
        text: editedCommentContent,
      };
      const res = await http.put(`/articles/${articleId}`, updatedComment);
      fetchPosts(); // 刷新帖子列表
      setEditComment(null); // 退出编辑模式
    }
  };

  const handleCancelEditComment = () => {
    setEditComment(null); // 取消编辑
    setEditedCommentContent(""); // 清空编辑内容
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1, padding: 2 }}>
      <Stack
        direction="column"
        sx={{
          justifyContent: "space-between",
          flexGrow: "1",
          gap: 2,
        }}
      >
        <Typography component="h1" variant="h5">
          Post List
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {currentPosts.map((post, index) => (
          <Paper
            key={index}
            elevation={2}
            role="article"
            sx={{ marginBottom: 2 }}
          >
            <Stack direction="column" sx={{ gap: 1, padding: 2 }}>
              <Stack
                direction="row"
                justifyContent="flex-start"
                sx={{ gap: 2 }}
              >
                <Avatar sx={{ width: 60, height: 60 }} src={post.avatar} />
                <Stack direction="column">
                  <Typography component="h1" variant="h6">
                    {post.author}
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(post.date)}
                  </Typography>
                </Stack>
              </Stack>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="h5">{post.title}</Typography>
              {editPost?.pid === post.pid ? (
                <TextField
                  fullWidth
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  multiline
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                />
              ) : (
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", marginBottom: 2 }}
                >
                  {post.text}
                </Typography>
              )}
              {post.img && <MyCarousel post={post} />}
              <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                <Button
                  onClick={() => toggleCommentSection(index)}
                  variant="contained"
                >
                  {activeCommentIndex === index
                    ? "Hide Comments"
                    : "Show Comments"}
                </Button>
                {username === post.author && !editPost ? (
                  <Button
                    onClick={() => handleEditPost(post)}
                    variant="outlined"
                  >
                    Edit Post
                  </Button>
                ) : null}
                {editPost?.pid === post.pid && (
                  <>
                    <Button onClick={handleSaveEdit} variant="contained">
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outlined">
                      Cancel
                    </Button>
                  </>
                )}
              </Stack>
              {activeCommentIndex === index && (
                <Box
                  sx={{
                    marginTop: 2,
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                    <TextField
                      id="comment-input"
                      placeholder="Write a comment..."
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleComment(currentPosts[activeCommentIndex].pid)
                      }
                    >
                      Comment
                    </Button>
                  </Stack>
                  {currentPosts[activeCommentIndex].comments.map(
                    (comment, commentIndex) => (
                      <Box
                        key={commentIndex}
                        sx={{
                          marginBottom: 2,
                          padding: 2,
                          backgroundColor: "#fff",
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Avatar
                            src={comment.avatar}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Stack direction="column" sx={{ width: "100%" }}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "bold" }}
                              >
                                {comment.author}
                              </Typography>
                              {comment.author === username && (
                                <Button
                                  onClick={() =>
                                    handleEditComment(comment, index)
                                  }
                                  variant="text"
                                  sx={{ alignSelf: "center" }}
                                >
                                  Edit
                                </Button>
                              )}
                            </Stack>
                            {editComment?.commentId === comment.commentId ? (
                              <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                fullWidth
                              >
                                <TextField
                                  value={editedCommentContent}
                                  onChange={(e) =>
                                    setEditedCommentContent(e.target.value)
                                  }
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                  size="small"
                                />
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleSaveEditedComment(
                                      currentPosts[activeCommentIndex].pid,
                                      comment.commentId
                                    )
                                  }
                                >
                                  Save
                                </Button>
                                <Button
                                  onClick={handleCancelEditComment}
                                  variant="outlined"
                                >
                                  Cancel
                                </Button>
                              </Stack>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                {comment.comment}
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                      </Box>
                    )
                  )}
                </Box>
              )}
            </Stack>
          </Paper>
        ))}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          sx={{ alignSelf: "center", marginTop: 2 }}
        />
      </Stack>
    </Card>
  );
};

export default PostList;
