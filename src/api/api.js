const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://igati-backend.onrender.com/api";

export async function apiRequest(
  endpoint,
  options = {}
) {
  const accessToken =
    localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers.Authorization =
      `Bearer ${accessToken}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      localStorage.removeItem(
        "user"
      );
    }

    throw new Error(
      data?.message ||
        data?.detail ||
        data?.error ||
        "Something went wrong."
    );
  }

  return data;
}