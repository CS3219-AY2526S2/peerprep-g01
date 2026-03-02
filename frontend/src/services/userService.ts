const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "login failed");
  }

  return response.json();
}
