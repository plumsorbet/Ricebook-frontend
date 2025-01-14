import { makeAutoObservable } from "mobx";
import { getUser, setUser } from "../utils";
class UserStore {
  userInfo = getUser() || "";
  constructor() {
    makeAutoObservable(this);
  }
  getUserInfo = async () => {
    //调用接口获取数据
    // const res = await http.get("/user/profile");
    // this.userInfo = res.data
  };
  setUserInfo = (info) => {
    this.userInfo = info;
    setUser(info);
  };
}

export default UserStore;
