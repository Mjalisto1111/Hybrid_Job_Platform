import api from './api';

export async function loginUser(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function registerUser(payload: { name: string; email: string; password: string; role: string }) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}

export async function fetchProfile() {
  const response = await api.get('/users/profile');
  return response.data;
}
