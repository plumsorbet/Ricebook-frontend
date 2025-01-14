import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AuthRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // 检查是否存在登录 Cookie
    const isLoggedIn = document.cookie.includes("sid=");
    setIsAuthenticated(isLoggedIn);
  }, []);

  // 根据验证结果渲染内容
  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export { AuthRoute };
