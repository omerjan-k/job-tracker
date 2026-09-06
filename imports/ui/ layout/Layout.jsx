// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b border-slate-200 p-4 flex gap-6 shadow-sm">
        <Link to="/" className="font-bold text-blue-600 hover:text-blue-800">
          Job Tracker
        </Link>
        <Link to="/dashboard" className="text-slate-600 hover:text-slate-900">
          Dashboard
        </Link>
      </nav>
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}