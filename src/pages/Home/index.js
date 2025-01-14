import { Container, Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Following from "./Following";
import NewPost from "./NewPost";
import PostList from "./PostList";
import UserStatus from "./UserStatus";
import Nav from "../../components/Nav";
import { useState, useEffect } from "react";
import { useStore } from "../../store";
import { http } from "../../utils";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { userStore } = useStore();
  const [followingIds, setFollowingIds] = useState([]);

  const fetchPosts = async () => {
    const currentUsername = userStore.userInfo;
    try {
      const res = await http.get("/articles");
      const profileRes = await http.get(`/following/${currentUsername}`);
      const curUserRes = await http.get(`/avatar/${currentUsername}`);
      const currentUserAvatar = curUserRes.avatar;
      console.log("res: ", res);
      console.log("profileRes: ", profileRes);
      const filteredPosts = res.articles.filter(
        (post) =>
          post.author === currentUsername ||
          profileRes.following.includes(post.author)
      );

      const postsWithAvatars = filteredPosts.map((post) => {
        // 获取帖子作者的头像
        const authorAvatar =
          post.author === currentUsername
            ? currentUserAvatar
            : profileRes.followingProfiles.find(
                (profile) => profile.username === post.author
              )?.avatar || null;

        // 为评论添加头像
        const commentsWithAvatars = post.comments.map((comment) => {
          const commentAuthor = comment.author;

          // 如果评论作者是当前用户
          if (commentAuthor === currentUsername) {
            return {
              ...comment,
              avatar: currentUserAvatar,
            };
          }

          // 查找评论作者的头像
          const commentAuthorProfile = profileRes.followingProfiles.find(
            (profile) => profile.username === commentAuthor
          );

          return {
            ...comment,
            avatar: commentAuthorProfile ? commentAuthorProfile.avatar : null, // 默认 null
          };
        });

        // 返回新的帖子对象
        return {
          ...post,
          avatar: authorAvatar, // 帖子作者头像
          comments: commentsWithAvatars, // 带头像的评论
        };
      });

      console.log("postsWithAvatars: ", postsWithAvatars);
      setPosts(postsWithAvatars);
    } catch (e) {
      console.error("Failed to fetch articles:", e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [followingIds]);

  const handlePostAdded = (newPost) => {
    fetchPosts();
  };

  return (
    <Box>
      <Nav />
      <Container>
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
          <Grid container spacing={2} columns={12}>
            <Grid size={{ xs: 12, lg: 3 }}>
              <Stack
                gap={2}
                direction={{ xs: "column", sm: "row", lg: "column" }}
                sx={{ mb: 2 }}
              >
                <UserStatus />
                <Following setFollowingIds={setFollowingIds} />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 9 }}>
              <Stack
                gap={2}
                direction={{ xs: "column", sm: "row", lg: "column" }}
                sx={{ mb: 2 }}
              >
                <NewPost onPostAdded={handlePostAdded} />
                <PostList posts={posts} fetchPosts={fetchPosts} />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
