import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/authContext";
import { useProfile } from "./context/ProfileContext";

function App() {
  const { user, logout, userLoading } = useAuth();
  const { getAllProfiles, profiles } = useProfile();

  const navigate = useNavigate();

  useEffect(() => {
    getAllProfiles();
  }, []);

  if (userLoading) return <div>loading...</div>;
  if (user)
    return (
      <div>
        <h2>Hello {user.email}</h2>
        <button onClick={() => navigate("/listing")}>Donate Blood</button>
        <br></br>
        <br></br>
        <button onClick={() => navigate("/request")}>Request Blood</button>
        <br></br>
        <br></br>
        <button onClick={() => navigate("/profile")}>Show Profile</button>
        <br></br>
        <br></br>
        <button onClick={logout}>Logout</button>
      </div>
    );
  return (
    <div className='App'>
      <h1>Blood Donors</h1>
      <h2>Welcome!</h2>
      <button onClick={() => navigate("/login")}>LOGIN</button>
      <button onClick={() => navigate("/register")}>SIGNUP</button>
    </div>
  );
}

export default App;
