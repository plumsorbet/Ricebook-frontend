// 可以删了？

// // login module
// import { makeAutoObservable } from "mobx";
// import { http, setToken, getToken, removeToken } from "../utils";
// import { removeUser, setUser } from "../utils/userinfo";
// class LoginStore {
//   token = getToken() || "";
//   constructor() {
//     // 响应式
//     makeAutoObservable(this);
//   }
//   getToken = async ({ userName, password }) => {
//     // 调用登录接口
//     const res = await http.post("/user/login", {
//       userName,
//       password,
//     });
//     // 存入token
//     this.token = res.data;
//     // 存入ls
//     setToken(this.token);
//     setUser(userName);
//   };
//   // 退出登录
//   logOut = () => {
//     this.token = "";
//     removeToken();
//     removeUser();
//   };
// }

// export default LoginStore;
