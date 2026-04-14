const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import apiFetch from "../utils/apiFetch";

async function fetchAdmins(page: number = 1, pageSize: number = 10) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  const response = await apiFetch(`${BASE_URL}/api/admins?${params}`);
  if (!response.ok) {
    let message = "Fetch admins failed";
    try {
      const err = await response.json();
      message = err.message ?? err.error ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.json();
}

async function createAdmin(email: string) {
  const response = await apiFetch(`${BASE_URL}/api/admins/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    let message = "Create admin failed";
    try {
      const err = await response.json();
      message = err.message ?? err.error ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.json();
}

async function deleteAdmin(email: string, userId: string) {
  const response = await apiFetch(`${BASE_URL}/api/admins/delete`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, userId }),
  });

  if (!response.ok) {
    let message = "Delete admin failed";
    try {
      const err = await response.json();
      message = err.message ?? err.error ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.json();
}

export { fetchAdmins, createAdmin, deleteAdmin };
