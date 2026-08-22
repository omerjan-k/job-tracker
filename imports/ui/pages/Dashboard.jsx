import React from "react";
import { Meteor } from "meteor/meteor";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Job Applications</h1>
          <button
            onClick={() => Meteor.logout()}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-1.5 px-4 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
        <p className="text-slate-500">Your dashboard is linked up! Ready to display tracked job data.</p>
      </div>
    </div>
  );
}
