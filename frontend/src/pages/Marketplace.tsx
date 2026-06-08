import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Job {
  id: number;
  title: string;
  category: string;
  location: string;
  rate: number;
  currency: string;
  description: string;
}

function Marketplace() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api
      .get('/jobs')
      .then((response) => setJobs(response.data.jobs || []))
      .catch(() => setJobs([]));
  }, []);

  const { user } = useAuth();

  const applyToJob = async (jobId: number) => {
    try {
      const cover = window.prompt('Enter a short cover letter', 'I am available and experienced.');
      const resp = await api.post(`/jobs/${jobId}/apply`, { cover_letter: cover });
      alert('Applied successfully');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to apply');
    }
  };

  const bookJob = async (jobId: number) => {
    try {
      const workerIdRaw = window.prompt('Enter worker id to book (use worker profile id)');
      const worker_id = workerIdRaw ? Number(workerIdRaw) : null;
      const scheduled_date = window.prompt('Scheduled date (YYYY-MM-DD)', '2026-06-10');
      const total = window.prompt('Total amount', '0');
      const resp = await api.post(`/jobs/${jobId}/book`, { worker_id, scheduled_date, total_amount: Number(total) });
      alert('Booking requested');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to book');
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-3xl font-semibold text-white">Service marketplace</h2>
        <p className="mt-3 text-slate-400">Browse jobs by category, location, and ratings across South Africa.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        {jobs.length ? (
          jobs.map((job) => (
            <article key={job.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                  <p className="mt-2 text-slate-400">{job.category} • {job.location}</p>
                </div>
                <span className="rounded-2xl bg-sky-500/15 px-3 py-1 text-sky-300">{job.currency} {job.rate}</span>
              </div>
              <p className="mt-4 text-slate-300">{job.description}</p>
                <div className="mt-6 flex items-center justify-between">
                <Link
                  to={`/workers/${job.id}`}
                  className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
                >
                  View candidate
                </Link>
                {user?.role === 'worker' && (
                  <button onClick={() => applyToJob(job.id)} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
                    Apply now
                  </button>
                )}
                {user?.role === 'customer' && (
                  <button onClick={() => bookJob(job.id)} className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                    Book
                  </button>
                )}
                {user?.role === 'employer' && (
                  <Link to="/jobs/create" className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-500">Create job</Link>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-slate-400">
            No active jobs found.
            {user?.role === 'employer' && (
              <div className="mt-4">
                <Link to="/jobs/create" className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-500">Create your first job</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Marketplace;
