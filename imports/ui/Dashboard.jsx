import React from 'react';

export function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold tracking-tight">Your Dashboard</h1>
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <p className="text-slate-500">No job applications logged yet.</p>
      </div>
    </div>
  );
}
