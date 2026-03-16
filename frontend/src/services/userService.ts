const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface fetchUserParams {
  limit?: number;
  cursor?: string | null;
  sort?: "createdAt" | "userName" | "email";
  order?: "asc" | "desc";
  search?: string | null;
  role?: string;
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

async function loginUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let message = "Login failed";
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

async function fetchUsers(params: fetchUserParams = {}) {
  const {
    limit = 15,
    cursor = null,
    sort = "createdAt",
    order = "asc",
    search = null,
    role = "1",
  } = params;

  const query = new URLSearchParams();
  query.set("limit", String(limit));
  query.set("sort", sort);
  query.set("order", order);
  query.set("role", role);
  if (cursor) query.set("cursor", cursor);
  if (search) query.set("search", search);

  const response = await fetch(`${BASE_URL}/api/users?${query.toString()}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    let message = "Fetch users failed";
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

async function deleteUser(userId: string) {
  const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    let message = "Delete user failed";
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

export { loginUser, fetchUsers, deleteUser };
