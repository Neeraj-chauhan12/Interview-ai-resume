import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected"
import Home from "./features/Interview/pages/Home";
import Interview from "./features/Interview/pages/Interview"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected><Home /></Protected>,
    errorElement: <div>Something went wrong!</div>
  },
  
  {
    path:"/interview/:id",
    element:<Protected><Interview /></Protected>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);
