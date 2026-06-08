import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'Chat', path: '/chat' },
  { label: 'Admin', path: '/admin', roles: ['admin'] },
];

function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('skillconnect_token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <aside className="hidden w-72 shrink-0 bg-slate-900 p-6 md:block">
      <div className="mb-6 flex items-center gap-3">
        <div>
          <div className="mb-1 text-sm uppercase text-sky-400">SkillConnect SA</div>
          <h1 className="text-lg font-semibold text-white">Service marketplace</h1>
        </div>
      </div>
      {user && (
        <div className="mb-6 flex items-center gap-3">
          <img src={user.avatar_url || '/avatar-placeholder.png'} alt="avatar" className="h-12 w-12 rounded-full bg-slate-800 object-cover" />
          <div>
            <div className="text-sm text-slate-300">Signed in as</div>
            <div className="text-sm font-medium text-white">{user.name || user.email}</div>
            <Link to="/profile" className="text-xs text-sky-400 hover:underline">My profile</Link>
          </div>
        </div>
      )}
      <nav className="space-y-2">
        {navItems
          .filter((item) => {
            if (!item.roles) return true;
            return user?.role && item.roles.includes(user.role);
          })
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                location.pathname === item.path ? 'bg-slate-800 text-white shadow' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
      </nav>
      {user?.role === 'employer' && (
        <div className="mt-6">
          <Link to="/jobs/create" className="block w-full text-center rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-500">
            Create Job
          </Link>
        </div>
      )}
      <div className="mt-6">
        <button onClick={handleLogout} className="block w-full text-center rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-rose-400">
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
