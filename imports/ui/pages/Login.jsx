import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";

export default function Login() {
  const [error, setError] = useState("");

  const handleDemoLogin = (e) => {
    e.preventDefault();
    // Quick demo login method - you can replace this with regular inputs later
    Meteor.loginWithPassword("demo@tracker.com", "password123", (err) => {
      if (err) {
        setError(err.reason || "Login failed");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Sign In</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <button
          onClick={handleDemoLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Sign In with Demo Account
        </button>
      </div>
    </div>
  );
}
