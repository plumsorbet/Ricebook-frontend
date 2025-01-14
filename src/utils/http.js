//封装axios
//实例化 请求拦截器 响应拦截器
import axios from "axios";
import { getToken } from "./token";

const http = axios.create({
  baseURL: "https://ricesocialmedia-89d5147d4bd0.herokuapp.com",
  // baseURL: "http://localhost:3000",
  timeout: 5000,
  withCredentials: true,
});
// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // if(error.response.status === 401){
    //   // 跳回到登录 reactRouter默认状态下 并不
    //   console.log('login')
    //   history.push('/login')
    // }
    return Promise.reject(error);
  }
);

export { http };
