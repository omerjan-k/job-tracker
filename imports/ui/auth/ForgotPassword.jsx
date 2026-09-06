import { useState } from "react";
import { Link } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    Accounts.forgotPassword({ email }, (err) => {
      if (err) {
        setError(err.reason || "Could not send reset email");
      } else {
        setSent(true);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          Forgot Password
        </h2>

        {sent ? (
          <p className="text-sm text-center text-slate-600">
            If an account exists for that email, a password reset link has
            been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <p className="text-sm text-center text-slate-500 mt-4">
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
