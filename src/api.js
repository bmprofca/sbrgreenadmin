const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("sbrgreen_admin_token");
}

export function setToken(token) {
  localStorage.setItem("sbrgreen_admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("sbrgreen_admin_token");
}

export async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}

export const authApi = {
  login: (username, password) =>
    api("/auth/login", { method: "POST", body: { username, password } }),
  me: () => api("/auth/me"),
};

export const adminApi = {
  dashboard: () => api("/admin/dashboard"),
  getSettings: () => api("/admin/settings"),
  updateSettings: (body) => api("/admin/settings", { method: "PUT", body }),
  list: (resource) => api(`/admin/${resource}`),
  create: (resource, body) => api(`/admin/${resource}`, { method: "POST", body }),
  update: (resource, id, body) =>
    api(`/admin/${resource}/${id}`, { method: "PUT", body }),
  remove: (resource, id) =>
    api(`/admin/${resource}/${id}`, { method: "DELETE" }),
  messages: () => api("/admin/messages"),
  markRead: (id) => api(`/admin/messages/${id}/read`, { method: "PATCH" }),
  deleteMessage: (id) => api(`/admin/messages/${id}`, { method: "DELETE" }),
};
