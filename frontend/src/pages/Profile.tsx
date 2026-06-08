import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', location: '', bio: '', avatar_url: '' });
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await api.get('/users/profile');
        const u = resp.data.user;
        setForm({ name: u.name || '', location: u.location || '', bio: u.bio || '', avatar_url: u.avatar_url || '' });
      } catch (e) {}
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      const resp = await api.put('/users/profile', form);
      setStatus('Profile updated');
      setUser && setUser(resp.data.user);
    } catch (err: any) {
      setStatus(err?.response?.data?.error || 'Failed to update profile');
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-2xl font-semibold text-white">My profile</h2>
        <p className="mt-2 text-slate-400">Update your display name, location, bio and avatar.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-3xl border border-slate-800 bg-slate-900 p-8 space-y-4">
        <label className="block">
          <span className="text-sm text-slate-400">Name</span>
          <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-400">Location</span>
          <input value={form.location} onChange={(e)=>setForm({...form, location: e.target.value})} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-400">Bio</span>
          <textarea value={form.bio} onChange={(e)=>setForm({...form, bio: e.target.value})} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" rows={4} />
        </label>
        <label className="block">
          <span className="text-sm text-slate-400">Avatar URL</span>
          <input value={form.avatar_url} onChange={(e)=>setForm({...form, avatar_url: e.target.value})} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
        </label>
        {status && <div className="text-sm text-slate-300">{status}</div>}
        <div className="flex justify-end">
          <button className="rounded-2xl bg-sky-500 px-4 py-2 font-semibold text-slate-950">Save</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
