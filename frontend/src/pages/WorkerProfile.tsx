import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function WorkerProfile() {
  const { workerId } = useParams();
  const [worker, setWorker] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [reportStatus, setReportStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!workerId) return;
    api
      .get(`/users/search?skill=&location=`)
      .then((response) => {
        const candidate = response.data.workers?.find((item: any) => String(item.id) === workerId);
        setWorker(candidate || response.data.workers?.[0]);
      })
      .catch(() => setWorker(null));
  }, [workerId]);

  const handleReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReportStatus(null);

    if (!reason.trim()) {
      setReportStatus('Please provide a reason for the report.');
      return;
    }

    try {
      await api.post('/users/reports', {
        target_id: worker.id,
        reason,
        details,
      });
      setReason('');
      setDetails('');
      setReportStatus('Report submitted. Admin will review it soon.');
    } catch (error) {
      setReportStatus('Unable to submit report. Please try again later.');
    }
  };

  if (!worker) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-slate-400">Loading worker profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">{worker.name}</h2>
            <p className="mt-2 text-slate-400">{worker.bio || 'Professional freelancer and skilled worker.'}</p>
          </div>
          <div className="rounded-3xl bg-slate-950 px-6 py-4 text-right">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Average rating</p>
            <p className="mt-2 text-4xl font-semibold text-white">{worker.rating || 4.8}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold text-white">Skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {(worker.skills || ['Plumbing', 'Electrical', 'Carpentry']).map((skill: string) => (
              <span key={skill} className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold text-white">Availability</h3>
          <p className="mt-4 text-slate-400">{worker.availability || 'Weekdays 08:00 - 18:00'}</p>
          <p className="mt-4 text-slate-400">Service area: {worker.service_area || 'Durban, South Africa'}</p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold text-white">Portfolio</h3>
          <div className="mt-4 space-y-3 text-slate-400">
            <p>Verified certification and multiple completed contracts.</p>
            <p>Experienced in residential maintenance and digital task delivery.</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h3 className="text-xl font-semibold text-white">Reviews</h3>
        <div className="mt-6 space-y-4">
          <article className="rounded-3xl bg-slate-950 p-5">
            <p className="text-slate-300">Reliable and fast. Completed our job on time with excellent quality.</p>
            <p className="mt-3 text-sm text-slate-500">Customer review • 5 stars</p>
          </article>
          <article className="rounded-3xl bg-slate-950 p-5">
            <p className="text-slate-300">Great communication and professional skills.</p>
            <p className="mt-3 text-sm text-slate-500">Employer review • 4 stars</p>
          </article>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h3 className="text-xl font-semibold text-white">Report this profile</h3>
        <p className="mt-2 text-slate-400">Submit a complaint to the admin if this user violates platform rules.</p>
        <form onSubmit={handleReport} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-400">Reason</span>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
              placeholder="Harassment, fraud, spam, etc."
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-400">Details</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
              rows={4}
              placeholder="Add any additional information for the admin review."
            />
          </label>
          {reportStatus && <p className="text-sm text-slate-300">{reportStatus}</p>}
          <button className="rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-slate-950 hover:bg-rose-400">
            Send report
          </button>
        </form>
      </div>
    </div>
  );
}

export default WorkerProfile;
