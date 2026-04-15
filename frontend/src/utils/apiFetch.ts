async function apiFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export default apiFetch;
