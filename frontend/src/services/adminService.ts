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

export { fetchAdmins };
