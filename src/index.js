import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthProvider from "./context/authContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProfileProvider from "./context/ProfileContext";
import Profile from "./pages/Profile";
import Listing from "./pages/Listing";
import Request from "./pages/Request";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // user home page
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />, // Create your profile (name, blood group etc.)
  },
  {
    path: "/listing",
    element: <Listing />, // Add a new listing for blood donation
  },
  {
    path: "/request",
    element: <Request />, // Request blood
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </AuthProvider>
  </React.StrictMode>
);
