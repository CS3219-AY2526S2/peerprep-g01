const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import apiFetch from "../utils/apiFetch";

interface fetchUserParams {
  limit?: number;
  cursor?: string | null;
  sort?: "createdAt" | "userName" | "email";
  order?: "asc" | "desc";
  search?: string | null;
  role?: string;
}

async function loginUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
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

  const response = await apiFetch(`${BASE_URL}/api/users?${query.toString()}`);
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

async function fetchUserById(userId: string) {
  const response = await apiFetch(`${BASE_URL}/api/users/${userId}`);

  if (!response.ok) {
    let message = "Fetch user failed";
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
  const response = await apiFetch(`${BASE_URL}/api/users/${userId}`, {
    method: "DELETE",
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

async function searchUser(userId: string) {
  const response = await apiFetch(`${BASE_URL}/api/users/${userId}`, {
    method: "GET",
  });

  if (!response.ok) {
    let message = "Search user failed";
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

async function registerUser(userName: string, email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, email, password }),
  });

  if (!response.ok) {
    let message = "Registration failed";
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

export {
  loginUser,
  fetchUsers,
  fetchUserById,
  deleteUser,
  searchUser,
  registerUser,
};
