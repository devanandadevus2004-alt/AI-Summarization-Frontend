const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api` 
  : 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ai_notes_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    let data;
    try {
      data = await response.json();
    } catch {
      data = { message: `Server error (${response.status})` };
    }

    if (!response.ok) {
      // If token expired or unauthorized
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('ai_notes_token');
        localStorage.removeItem('ai_notes_user');
        window.dispatchEvent(new Event('auth-logout'));
      }
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Unable to connect to backend server at http://localhost:5000. Please ensure the backend is running.');
    }
    throw error;
  }
};

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Notes
  getNotes: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const qs = query.toString();
    return request(`/notes${qs ? `?${qs}` : ''}`);
  },
  getNote: (id) => request(`/notes/${id}`),
  createNote: (data) => request('/notes', { method: 'POST', body: JSON.stringify(data) }),
  updateNote: (id, data) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
  togglePin: (id) => request(`/notes/${id}/pin`, { method: 'PATCH' }),
  toggleFavorite: (id) => request(`/notes/${id}/favorite`, { method: 'PATCH' }),
  getNoteStats: () => request('/notes/stats/overview'),
  getDistinctTags: () => request('/notes/tags/all'),

  // AI Summarization
  summarize: (data) => request('/ai/summarize', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  getAdminUsers: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const qs = query.toString();
    return request(`/admin/users${qs ? `?${qs}` : ''}`);
  },
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  toggleUserStatus: (id) => request(`/admin/users/${id}/status`, { method: 'PATCH' }),
  deleteAdminUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  getAdminStats: () => request('/admin/stats'),
};
