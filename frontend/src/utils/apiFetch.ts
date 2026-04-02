import useAuthStore from "../store/authStore";

async function apiFetch(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export default apiFetch;
