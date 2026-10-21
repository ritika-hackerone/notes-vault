const BASE = import.meta.env.VITE_API_URL;

export async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null; // DELETE returns no body

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // A 401 while holding a token means it expired or is invalid
    if (res.status === 401 && token) {
      window.dispatchEvent(new Event("auth:expired"));
    }
    throw new Error(data.error || "Request failed");
  }
  return data;
}