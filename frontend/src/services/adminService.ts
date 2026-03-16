const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

async function fetchAdmins(page: number = 1, pageSize: number = 10) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  const response = await fetch(`${BASE_URL}/api/admins?${params}`, {
    headers: authHeaders(),
  });
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
