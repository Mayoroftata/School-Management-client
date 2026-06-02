const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://school-server-rd0y.onrender.com0";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function saveSession({ token, user }) {
  if (typeof window === "undefined") return;
  localStorage.setItem("school_token", token);
  localStorage.setItem("school_user", JSON.stringify(user));
  localStorage.setItem("token", token);
  localStorage.setItem("userRole", user?.role || "");
  localStorage.setItem("userId", String(user?.id || ""));
}
