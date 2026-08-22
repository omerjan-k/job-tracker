import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import "../ui/tailwind.css";

// 1. Core Pages are now safely imported
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  // Combine user tracking and loggingIn status inside a single useTracker execution
  const { user, loggingIn } = useTracker(() => {
    Meteor.subscribe('meteor.loginServiceConfiguration');
    return {
      user: Meteor.user(),
      loggingIn: Meteor.loggingIn(),
    };
  });

  // Render a clean Tailwind-powered spinner while Meteor restores user sessions
  if (loggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-700 font-medium">Restoring session...</p>
        </div>
      </div>
    );
  }

  // Create standard route trees matching React Router v7 recommendations
  const router = createBrowserRouter(
    !user
      ? [
          { path: "/login", element: <Login /> },
          { path: "*", element: <Navigate to="/login" replace /> },
        ]
      : [
          { path: "/", element: <Dashboard /> },
          { path: "/login", element: <Navigate to="/" replace /> },
          { path: "*", element: <Navigate to="/" replace /> },
        ]
  );

  return <RouterProvider router={router} />;
}
