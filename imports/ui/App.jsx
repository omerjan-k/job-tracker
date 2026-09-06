import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import "../ui/tailwind.css";

import Login from "./auth/Login";
import Dashboard from "./jobs/Dashboard";
import { Layout } from "./ layout/Layout";

export default function App() {
  const { user, loggingIn } = useTracker(() => {
    Meteor.subscribe('meteor.loginServiceConfiguration');
    return {
      user: Meteor.user(),
      loggingIn: Meteor.loggingIn(),
    };
  });

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

  const router = createBrowserRouter(
    !user
      ? [
          { path: "/login", element: <Login /> },
          { path: "*", element: <Navigate to="/login" replace /> },
        ]
      : [
          {
            path: "/",
            element: <Layout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: "dashboard", element: <Dashboard /> },
            ],
          },
          { path: "/login", element: <Navigate to="/" replace /> },
          { path: "*", element: <Navigate to="/" replace /> },
        ]
  );

  return <RouterProvider router={router} />;
}