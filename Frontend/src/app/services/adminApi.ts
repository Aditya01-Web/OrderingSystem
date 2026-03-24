const API_BASE = '/api';

let adminToken: string | null = null;

export const adminLogin = async (username: string, password: string): Promise<string> => {
  const response = await fetch(`${API_BASE}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error('Invalid credentials');

  const data = await response.json();
  adminToken = data.access;
  localStorage.setItem('adminToken', data.access);
  localStorage.setItem('adminRefresh', data.refresh);
  return data.access;
};

export const getAdminToken = (): string | null => {
  return adminToken || localStorage.getItem('adminToken');
};

export const adminLogout = () => {
  adminToken = null;
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRefresh');
};

export const isAdminLoggedIn = (): boolean => {
  return !!localStorage.getItem('adminToken');
};

export const fetchAllMenuItems = async () => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/menu/items/1/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch menu');
  return response.json();
};