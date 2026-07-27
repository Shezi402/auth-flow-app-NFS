const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Small fetch wrapper that automatically attaches the JWT (if present)
// and throws on non-2xx responses so callers can just try/catch.
export async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
}
