// ============================================
// STEP 1: Paste your Bearer Token here
// ============================================
// const TOKEN = 'YOUR_BEARER_TOKEN_HERE';

// // ============================================
// // STEP 2: Match category_id numbers from your
// // API to category names. Ask your friend!
// // ============================================
// export const categoryMap: Record<number, string> = {
//   1: 'Coffee',
//   2: 'Tea',
//   3: 'Pizza',
//   4: 'Burger',
//   5: 'Desserts',
//   6: 'Salads',
// };

// const API_BASE = 'https://orderingsystembackend-ihdb.onrender.com/api';

// export const fetchMenuByTable = async (tableNumber: number = 1) => {
//   // ✅ Fixed: was `${API_BASE}/${tableNumber}/` → produced /api//1/
//   const response = await fetch(`${API_BASE}/api/menu/items/${tableNumber}/`, {
//     headers: {
//       Authorization: `Bearer ${TOKEN}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) throw new Error('Failed to fetch menu from API');

//   const data = await response.json();
//   return data;
// };

const API_BASE = '/api';

// ============================================
// CREDENTIALS — move to .env in production
// ============================================
export const categoryMap: Record<number, string> = {
  1: 'Coffee',
  2: 'Tea',
  3: 'Pizza',
  4: 'Burger',
  5: 'Desserts',
  6: 'Salads',
};

const AUTH_USERNAME = 'piyush';
const AUTH_PASSWORD = 'Piyush59@';

let accessToken: string | null = null;

export const getAuthToken = async (): Promise<string> => {
  // Return cached token if we already have one
  if (accessToken) return accessToken;

  const response = await fetch(`${API_BASE}/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: AUTH_USERNAME,
      password: AUTH_PASSWORD,
    }),
  });
  console.log(response);
  if (!response.ok) throw new Error('Failed to fetch auth token');

  const data = await response.json();
  accessToken = data.access;  // adjust key if your API returns a different field name

  return accessToken;
};

export const fetchMenuByTable = async (tableNumber: number = 1) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}/menu/items/${tableNumber}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch menu from API');

  return response.json();
};

export const fetchTables = async () => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}/tables/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch tables from API');

  return response.json();
};

export const createOrder = async (orderData: any) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE}/order/create/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) throw new Error('Failed to create order');

  return response.json();
};