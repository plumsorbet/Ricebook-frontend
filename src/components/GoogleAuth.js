import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { http } from "../utils";

const GoogleAuth = () => {
  const { userStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOAuthUsername() {
      const res = await http.get(`/auth/google/username`);
      userStore.setUserInfo(res.username);
      navigate("/home", { replace: true });
    }
    fetchOAuthUsername();
  }, [navigate]);

  return <div></div>;
};

export default GoogleAuth;
