// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { JobsCollection } from '../../api/jobs/jobs';

const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];

const emptyForm = {
  company: '',
  position: '',
  status: 'Applied',
  appliedDate: '',
  notes: '',
  link: '',
};

export default function Dashboard() {
  const isLoading = useSubscribe('jobs.myJobs');

  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const jobs = useTracker(() => {
    const query = {};
    if (statusFilter !== 'All') query.status = statusFilter;

    const sort =
      sortBy === 'newest'
        ? { appliedDate: -1 }
        : sortBy === 'oldest'
        ? { appliedDate: 1 }
        : { company: 1 };

    return JobsCollection.find(query, { sort }).fetch();
  }, [statusFilter, sortBy]);

  const handleLogout = () => {
    Meteor.logout((err) => {
      if (err) console.error(err);
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.company.trim() || !form.position.trim()) {
      setError('Company and position are required.');
      return;
    }

    const payload = {
      company: form.company.trim(),
      position: form.position.trim(),
      status: form.status,
      appliedDate: form.appliedDate ? new Date(form.appliedDate) : new Date(),
      notes: form.notes.trim(),
      url: form.link.trim(),
    };

    if (editingId) {
      Meteor.call('jobs.update', editingId, payload, (err) => {
        if (err) setError(err.reason || 'Failed to update job.');
        else resetForm();
      });
    } else {
      Meteor.call('jobs.insert', payload, (err) => {
        if (err) setError(err.reason || 'Failed to add job.');
        else resetForm();
      });
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setForm({
      company: job.company || '',
      position: job.position || '',
      status: job.status || 'Applied',
      appliedDate: job.appliedDate
        ? new Date(job.appliedDate).toISOString().slice(0, 10)
        : '',
      notes: job.notes || '',
      link: job.link || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this job application?')) return;
    Meteor.call('jobs.remove', id, (err) => {
      if (err) console.error(err.reason);
    });
  };

  if (isLoading()) {
    return <div className="p-6 text-gray-500">Loading jobs...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Log out
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company (A-Z)</option>
        </select>

        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Job'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border rounded p-4 mb-6 bg-gray-50 space-y-3"
        >
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <input
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
            <input
              name="position"
              placeholder="Position"
              value={form.position}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="appliedDate"
              value={form.appliedDate}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
            <input
              name="link"
              placeholder="Job posting link"
              value={form.link}
              onChange={handleChange}
              className="border rounded px-3 py-2 col-span-2"
            />
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              className="border rounded px-3 py-2 col-span-2"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingId ? 'Update Job' : 'Save Job'}
          </button>
        </form>
      )}

      {jobs.length === 0 ? (
        <p className="text-gray-500">No job applications logged yet.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold">
                  {job.position} @ {job.company}
                </h3>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium">{job.status}</span>
                </p>
                {job.appliedDate && (
                  <p className="text-sm text-gray-500">
                    Applied: {new Date(job.appliedDate).toLocaleDateString()}
                  </p>
                )}
                {job.notes && (
                  <p className="text-sm text-gray-500 mt-1">{job.notes}</p>
                )}
                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View posting
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(job)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}