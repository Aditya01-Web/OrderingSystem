const API_BASE = 'https://orderingsystembackend-qnev.onrender.com/api';

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

export const fetchAllCategories = async () => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/menu/categories/1/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchOrders = async () => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/orders/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const updateOrderStatus = async (orderId: number | string, status: string) => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/order/${orderId}/status/`, {
    method: 'PATCH', // Changed to PATCH based on backend update
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ order_status: status }),
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return response.json();
};

export const updateTableStatus = async (tableId: number | string, status: string) => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/tables/${tableId}/status/`, {
    method: 'PATCH', // Changed to PATCH based on backend update
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: status }),
  });
  if (!response.ok) throw new Error('Failed to update table status');
  return response.json();
};

export const addMenuItem = async (data: { item_name: string, price: string | number, category_id: number, availability: boolean, image_url: string }) => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/menu/items/create/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add menu item');
  return response.json();
};

export const updateMenuItem = async (itemId: number | string, data: any) => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/menu/items/${itemId}/`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update menu item');
  return response.json();
};

export const deleteMenuItem = async (itemId: number | string) => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/menu/items/${itemId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete menu item');
  // DELETE might not return JSON, handle it safely
  if (response.status === 204) return { success: true };
  try {
    return await response.json();
  } catch {
    return { success: true };
  }
};

export const addTable = async (data: { table_number: number, capacity: number }) => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/tables/create/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add table');
  return response.json();
};

export const deleteTable = async (tableId: number | string) => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/tables/${tableId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete table');
  if (response.status === 204) return { success: true };
  try {
    return await response.json();
  } catch {
    return { success: true };
  }
};

export const fetchDashboardData = async () => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE}/dashboard/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
  return response.json();
};

export const trackOrder = async (orderId: string | number) => {
  const response = await fetch(`${API_BASE}/order/${orderId}/track/`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to track order');
  return response.json();
};