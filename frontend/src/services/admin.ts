import api from './api';

export async function fetchAdminReports() {
  const response = await api.get('/admin/reports');
  return response.data;
}

export async function fetchAdminUsers() {
  const response = await api.get('/admin/users');
  return response.data;
}

export async function disableAdminUser(userId: number) {
  const response = await api.post(`/admin/users/${userId}/disable`);
  return response.data;
}

export async function enableAdminUser(userId: number) {
  const response = await api.post(`/admin/users/${userId}/enable`);
  return response.data;
}

export async function deleteAdminUser(userId: number) {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
}

export async function resolveAdminReport(reportId: number, status = 'reviewed') {
  const response = await api.post(`/admin/reports/${reportId}/resolve`, { status });
  return response.data;
}
