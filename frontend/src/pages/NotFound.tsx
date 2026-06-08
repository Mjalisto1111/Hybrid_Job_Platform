import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">404 error</p>
      <h1 className="mt-6 text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 text-slate-400">The page you are looking for is unavailable or does not exist.</p>
      <Link to="/dashboard" className="mt-8 inline-flex rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
        Go back home
      </Link>
    </div>
  );
}

export default NotFound;
