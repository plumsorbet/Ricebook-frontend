import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import GoogleAuth from "./components/GoogleAuth";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/google-auth" element={<GoogleAuth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
