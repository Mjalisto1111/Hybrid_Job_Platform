import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchAdminReports, fetchAdminUsers, disableAdminUser, enableAdminUser, deleteAdminUser, resolveAdminReport } from '../services/admin';

function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState<{ total_users: number; total_jobs: number; open_reports: number }>({
    total_users: 0,
    total_jobs: 0,
    open_reports: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAdminReports(), fetchAdminUsers()])
      .then(([reportsData, usersData]) => {
        setStats(reportsData.statistics || { total_users: 0, total_jobs: 0, open_reports: 0 });
        setReports(reportsData.reports || []);
        setUsers(usersData.users || []);
      })
      .catch(() => {
        setStats({ total_users: 0, total_jobs: 0, open_reports: 0 });
        setReports([]);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const refreshData = () => {
    Promise.all([fetchAdminReports(), fetchAdminUsers()])
      .then(([reportsData, usersData]) => {
        setStats(reportsData.statistics || { total_users: 0, total_jobs: 0, open_reports: 0 });
        setReports(reportsData.reports || []);
        setUsers(usersData.users || []);
      })
      .catch(() => {
        setStats({ total_users: 0, total_jobs: 0, open_reports: 0 });
        setReports([]);
        setUsers([]);
      });
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      if (isActive) {
        await disableAdminUser(userId);
      } else {
        await enableAdminUser(userId);
      }
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteAdminUser(userId);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (reportId: number) => {
    try {
      await resolveAdminReport(reportId);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-3xl font-semibold text-white">Admin dashboard</h2>
        <p className="mt-3 text-slate-400">Manage users, reports, and platform moderation from one control center.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Total users', value: stats.total_users },
          { title: 'Total jobs', value: stats.total_jobs },
          { title: 'Open reports', value: stats.open_reports },
        ].map((card) => (
          <div key={card.title} className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{card.title}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Active users</h3>
            <button className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-200" onClick={refreshData}>
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="mt-6 text-slate-400">Loading users...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.map((user) => (
                    <tr key={user.id} className={`${user.is_active ? '' : 'bg-slate-950/50'}`}>
                      <td className="px-4 py-3 text-white">{user.name}</td>
                      <td className="px-4 py-3 text-slate-400">{user.email}</td>
                      <td className="px-4 py-3 text-slate-400">{user.role}</td>
                      <td className="px-4 py-3 text-slate-300">{user.is_active ? 'Active' : 'Disabled'}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button
                          className={`rounded-2xl px-3 py-2 text-sm text-slate-200 ${user.role === 'admin' || user.id === currentUser?.id ? 'bg-slate-700 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700'}`}
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          disabled={user.role === 'admin' || user.id === currentUser?.id}
                        >
                          {user.is_active ? 'Disable' : 'Enable'}
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            className={`rounded-2xl px-3 py-2 text-sm text-white ${user.id === currentUser?.id ? 'bg-slate-700 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500'}`}
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUser?.id}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold text-white">Recent reports</h3>
          {loading ? (
            <div className="mt-6 text-slate-400">Loading reports...</div>
          ) : reports.length === 0 ? (
            <p className="mt-6 text-slate-400">No reports have been submitted yet.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {reports.map((report) => (
                <article key={report.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-slate-300">{report.reason}</p>
                      <p className="mt-2 text-sm text-slate-500">Reported by {report.reporter?.name || 'Unknown'} on {new Date(report.created_at).toLocaleDateString()}</p>
                      <p className="mt-2 text-sm text-slate-400">Target: {report.target?.name || report.target_id} ({report.target?.email || 'unknown'})</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{report.status}</span>
                  </div>
                  <p className="mt-4 text-slate-400">{report.details || 'No additional details provided.'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
                      onClick={() => handleResolveReport(report.id)}
                    >
                      Resolve
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
