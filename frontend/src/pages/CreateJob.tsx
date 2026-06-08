import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [location, setLocation] = useState('');
  const [rate, setRate] = useState<number | ''>('');
  const [currency, setCurrency] = useState('ZAR');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        category,
        location,
        rate: Number(rate) || 0,
        currency,
      };
      await api.post('/jobs/', payload);
      setSaved(true);
      setLoading(false);
      setTimeout(() => navigate('/marketplace'), 700);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to create job';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="mb-4 text-2xl font-semibold text-white">Create Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full rounded p-2 bg-slate-800 text-white" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="w-full rounded p-2 bg-slate-800 text-white" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input className="w-full rounded p-2 bg-slate-800 text-white" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input className="w-full rounded p-2 bg-slate-800 text-white" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <div className="flex gap-2">
          <input className="flex-1 rounded p-2 bg-slate-800 text-white" placeholder="Rate" value={rate} onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))} />
          <input className="w-24 rounded p-2 bg-slate-800 text-white" placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>
        {error && <div className="text-sm text-rose-400">{error}</div>}
        {saved && <div className="mt-3 rounded p-2 bg-emerald-500 text-slate-900">Job created — redirecting...</div>}
        <div className="flex justify-end">
          <button disabled={loading} className={`rounded-2xl px-4 py-2 font-semibold text-slate-950 ${loading ? 'bg-slate-600' : 'bg-sky-500 hover:bg-sky-400'}`}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateJob;
