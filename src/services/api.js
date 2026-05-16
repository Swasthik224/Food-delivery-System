const BASE = 'http://localhost:8080/api';

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('fd_token') || ''}`,
});

const req = async (url, options = {}) => {
  const res = await fetch(BASE + url, { ...options, headers: headers() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const api = {
  // Auth
  login: (data) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => {
      if (!r.ok) throw new Error('Invalid credentials');
      return r.json();
    }),

  register: (data) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => {
      if (!r.ok) throw new Error('Registration failed');
      return r.json();
    }),

  // Restaurants
  getRestaurants: () => req('/restaurants'),

  // ✅ FIXED MENU API
  getMenu: (id) => req(`/restaurants/${id}/menu`),

  // Orders
  placeOrder: (data) =>
    req('/orders', { method: 'POST', body: JSON.stringify(data) }),

  getMyOrders: () => req('/orders/my-orders'),
  trackOrder: (id) => req(`/orders/${id}/track`),

  // Payment
  createPayment: (amount) =>
    req('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  verifyPayment: (data) =>
    req('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin
  getAllOrders: () => req('/admin/orders'),
  updateStatus: (id, status) =>
    req(`/orders/${id}/status?status=${status}`, { method: 'PUT' }),
  getStats: () => req('/admin/stats'),

  // Owner
  addMenuItem: (data) =>
    req('/menu', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAvailability: (id) =>
    req(`/menu/${id}/availability`, {
      method: 'PUT',
    }),
};