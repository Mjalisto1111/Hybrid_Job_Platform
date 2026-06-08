import { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState<{ activeJobs: number; applications: number; messages: number; earnings: string }>({
    activeJobs: 0,
    applications: 0,
    messages: 0,
    earnings: 'R0',
  });

  useEffect(() => {
    const data = {
      activeJobs: 12,
      applications: 8,
      messages: 4,
      earnings: 'R7,420',
    };
    setStats(data);
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-3xl font-semibold text-white">Welcome to SkillConnect SA</h2>
        <p className="mt-3 text-slate-400">
          Manage service requests, discover professionals, and track active work from one intelligent dashboard.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Active jobs', value: stats.activeJobs },
          { label: 'Applications', value: stats.applications },
          { label: 'Unread messages', value: stats.messages },
          { label: 'Estimated weekly earnings', value: stats.earnings },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
            <span className="rounded-full bg-sky-500/20 px-3 py-1 text-sm text-sky-300">Beta</span>
          </div>
          <p className="mt-4 text-slate-400">
            Worker matching, CV suggestions, and location-based job alerts are prepared using SkillConnect AI heuristics.
          </p>
          <ul className="mt-6 space-y-3 text-slate-300">
            <li>Suggested role: Residential electrician</li>
            <li>Recommended worker: Sipho M.</li>
            <li>Location: Durban city center</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold text-white">Live service map</h3>
          <div className="mt-6 h-72 rounded-3xl bg-slate-950 p-4 text-slate-400">
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg text-white">OpenStreetMap preview</p>
              <p className="mt-3 text-sm text-slate-500">Nearby worker locations and service radius will render here.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
