// ============================================
// STEP 1: Paste your Bearer Token here
// ============================================
const TOKEN = 'YOUR_BEARER_TOKEN_HERE';

// ============================================
// STEP 2: Match category_id numbers from your
// API to category names. Ask your friend!
// ============================================
export const categoryMap: Record<number, string> = {
  1: 'Coffee',
  2: 'Tea',
  3: 'Pizza',
  4: 'Burger',
  5: 'Desserts',
  6: 'Salads',
};

const API_BASE = 'http://127.0.0.1:8000/api/api/menu/items';

export const fetchMenuByTable = async (tableNumber: number = 1) => {
  const response = await fetch(`${API_BASE}/${tableNumber}/`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Failed to fetch menu from API');

  const data = await response.json();
  return data;
};