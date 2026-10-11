export default async function authFetch(url, options = {}) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    window.location.href = "/admin/login";
  }

  return res;
}
