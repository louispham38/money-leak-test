const Auth = (() => {
  const TOKEN_KEY = "mlt_token";
  const USER_KEY = "mlt_user";
  const USERS_DB_KEY = "mlt_local_users";
  const RESULTS_KEY = "mlt_local_results";
  const GOALS_KEY = "mlt_local_goals";

  function apiBase() {
    return (window.MLT_CONFIG && window.MLT_CONFIG.API_BASE) || "http://127.0.0.1:8000";
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function isLoggedIn() {
    return !!getToken() && !!getUser();
  }

  function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "index.html";
  }

  async function apiFetch(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${apiBase()}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || data.message || "Lỗi kết nối máy chủ");
    return data;
  }

  function hashPassword(pw) {
    let h = 0;
    for (let i = 0; i < pw.length; i++) h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
    return `mlt_${h}_${pw.length}`;
  }

  function localUsers() {
    return JSON.parse(localStorage.getItem(USERS_DB_KEY) || "[]");
  }

  function saveLocalUsers(users) {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  }

  async function register({ email, full_name, phone, password }) {
    const body = { email: email.trim().toLowerCase(), full_name, phone, password };
    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setSession(data.token, data.user);
      return { user: data.user, mode: "api" };
    } catch (err) {
      const msg = String(err.message || "");
      const isNetwork =
        msg.includes("fetch") ||
        msg.includes("Failed") ||
        msg.includes("NetworkError") ||
        msg.includes("Load failed");
      if (!isNetwork) throw err;
    }
    const users = localUsers();
    if (users.some((u) => u.email === body.email)) throw new Error("Email đã được đăng ký (chế độ offline)");
    const user = {
      id: Date.now(),
      email: body.email,
      full_name: body.full_name,
      phone: body.phone,
      created_at: new Date().toISOString(),
      password_hash: hashPassword(password),
    };
    users.push(user);
    saveLocalUsers(users);
    const token = `local_${user.id}_${Date.now()}`;
    const pub = { id: user.id, email: user.email, full_name: user.full_name, phone: user.phone, created_at: user.created_at };
    setSession(token, pub);
    return { user: pub, mode: "local" };
  }

  async function login({ email, password }) {
    const body = { email: email.trim().toLowerCase(), password };
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setSession(data.token, data.user);
      return { user: data.user, mode: "api" };
    } catch (err) {
      const msg = String(err.message || "");
      const isNetwork =
        msg.includes("fetch") ||
        msg.includes("Failed") ||
        msg.includes("NetworkError") ||
        msg.includes("Load failed");
      if (!isNetwork) throw err;
    }
    const users = localUsers();
    const user = users.find((u) => u.email === body.email && u.password_hash === hashPassword(password));
    if (!user) throw new Error("Email hoặc mật khẩu không đúng");
    const token = `local_${user.id}_${Date.now()}`;
    const pub = { id: user.id, email: user.email, full_name: user.full_name, phone: user.phone, created_at: user.created_at };
    setSession(token, pub);
    return { user: pub, mode: "local" };
  }

  async function saveTestResult(payload) {
    const user = getUser();
    if (!user) return;
    try {
      if (!getToken()?.startsWith("local_")) {
        await apiFetch("/api/test-results", { method: "POST", body: JSON.stringify(payload) });
        return;
      }
    } catch (_) {}
    const all = JSON.parse(localStorage.getItem(RESULTS_KEY) || "{}");
    all[user.id] = { ...payload, created_at: new Date().toISOString() };
    localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
  }

  async function getLatestResult() {
    const user = getUser();
    if (!user) return null;
    try {
      if (!getToken()?.startsWith("local_")) {
        return await apiFetch("/api/test-results/latest");
      }
    } catch (_) {}
    const all = JSON.parse(localStorage.getItem(RESULTS_KEY) || "{}");
    return all[user.id] || null;
  }

  async function getGoals() {
    const user = getUser();
    if (!user) return null;
    try {
      if (!getToken()?.startsWith("local_")) {
        return await apiFetch("/api/goals");
      }
    } catch (_) {}
    const all = JSON.parse(localStorage.getItem(GOALS_KEY) || "{}");
    return all[user.id] || null;
  }

  async function saveGoals(goals) {
    const user = getUser();
    if (!user) return;
    try {
      if (!getToken()?.startsWith("local_")) {
        return await apiFetch("/api/goals", { method: "PUT", body: JSON.stringify(goals) });
      }
    } catch (_) {}
    const all = JSON.parse(localStorage.getItem(GOALS_KEY) || "{}");
    all[user.id] = { ...goals, updated_at: new Date().toISOString() };
    localStorage.setItem(GOALS_KEY, JSON.stringify(all));
    return all[user.id];
  }

  return {
    apiBase,
    getToken,
    getUser,
    isLoggedIn,
    setSession,
    logout,
    register,
    login,
    saveTestResult,
    getLatestResult,
    getGoals,
    saveGoals,
  };
})();
