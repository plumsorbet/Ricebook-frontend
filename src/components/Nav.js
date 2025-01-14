import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { SitemarkIcon } from "./CustomIcons";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

const pages = ["Main Page", "Profile"];
const logout = "Log out";

const Nav = () => {
  const { userStore } = useStore();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    // 处理登出逻辑
    console.log("User logged out");
    // 例如清除本地存储中的用户信息等
    localStorage.removeItem("user");
    // 跳转到登录页面
    navigate("/");
  };

  const handlePageNavigation = (page) => {
    if (page === "Main Page") {
      navigate("/home");
    } else if (page === "Profile") {
      navigate("/profile");
    }
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar variant="dense" sx={{ maxHeight: 48 }}>
        <SitemarkIcon />

        <IconButton
          size="large"
          aria-label="menu"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleOpenNavMenu}
          color="inherit"
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Menu */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          {pages.map((page) => (
            <MenuItem key={page} onClick={() => handlePageNavigation(page)}>
              <Typography sx={{ textAlign: "center" }}>{page}</Typography>
            </MenuItem>
          ))}
          <MenuItem onClick={handleLogout}>
            <Typography sx={{ textAlign: "center" }}>{logout}</Typography>
          </MenuItem>
        </Menu>

        {/* Desktop Menu */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => handlePageNavigation(page)}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              {page}
            </Button>
          ))}
        </Box>

        {/* Put "Log out" on the right side */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Button
            disabled
            sx={{
              my: 2,
              color: "white",
              display: "block",
              textTransform: "none",
              "&.Mui-disabled": {
                color: "white",
              },
            }}
          >
            {userStore.userInfo}
          </Button>
          <Button
            onClick={handleLogout}
            sx={{ my: 2, color: "white", display: "block" }}
          >
            {logout}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
