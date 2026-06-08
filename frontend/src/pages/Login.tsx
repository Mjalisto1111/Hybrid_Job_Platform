import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('skillconnect_token', data.access_token);
      window.dispatchEvent(new Event('authChange'));
      navigate('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unable to sign in. Check your credentials.';
      setError(message);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-xl shadow-slate-950/40">
      <h2 className="mb-4 text-3xl font-semibold text-white">Welcome back</h2>
      <p className="mb-8 text-slate-400">Sign in to access your SkillConnect SA workspace.</p>
      {error && <div className="mb-4 rounded-2xl bg-rose-500/10 p-3 text-rose-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
            required
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
            required
          />
        </label>
        <button className="w-full rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">
          Sign in
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New to SkillConnect SA?{' '}
        <Link to="/register" className="text-sky-400 hover:text-sky-300">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default Login;
