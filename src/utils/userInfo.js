const key = "user";
const setUser = (userinfo) => {
  return window.localStorage.setItem(key, JSON.stringify(userinfo));
};
const getUser = () => {
  const user = window.localStorage.getItem(key);
  return user ? JSON.parse(user) : null;
};
const removeUser = () => {
  return window.localStorage.removeItem(key);
};

export { setUser, getUser, removeUser };
