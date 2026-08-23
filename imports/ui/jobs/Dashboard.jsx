export default function Dashboard() {

  function handleLogout() {
    Meteor.logout((err) => {
      if (err) {
        console.error("Logout failed:", err);
      } else {
        console.log("User logged out successfully"); // eslint-disable-line no-console
      }
    });
  }
  return (
    <div className="space-y-4 mx-w-4xl mx-auto p-6 bg-slate-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold tracking-tight">Your Dashboard</h1>
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <p className="text-slate-500">No job applications logged yet.</p>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
