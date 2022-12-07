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
      <div className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
        <h2 className="text-4xl font-bold text-gray-700 text-center">Hello {user.email}</h2>
        <section className="mt-10">
        <button className="w-full fill-current bg-red-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" onClick={() => navigate("/listing")}>Donate Blood</button>
        <br></br>
        <br></br>
        <button className="w-full fill-current bg-green-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" onClick={() => navigate("/request")}>Request Blood</button>
        <br></br>
        <br></br>
        <button className="w-full fill-current bg-gray-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" onClick={() => navigate("/profile")}>Show Profile</button>
        <br></br>
        <br></br>
        <button className="w-full fill-current bg-blue-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" onClick={logout}>Logout</button>
        </section>
      </div>
    );
  return (
    <div  className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
      <h1 className="text-4xl font-bold text-gray-700 text-center">Blood Donors</h1>
      <h2 className="text-4xl font-bold text-gray-700 text-center">Welcome!</h2>
      <h3 className="text-2xl text-gray-700 text-center">You can become a superhero too.</h3>
      <section className="mt-10">
        <form className="flex flex-col">
          <div className="flex mb-6 pt-3 rounded">
            <button className="w-full fill-current bg-green-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" onClick={() => navigate("/login")}>LOGIN</button>
          </div>
          <div className="flex mb-6 pt-3 rounded">
            <button className="w-full fill-current bg-gray-600 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 text-center" onClick={() => navigate("/register")}>SIGNUP</button>
          </div>
        </form>  
      </section>    
    </div>
  );
}

export default App;
