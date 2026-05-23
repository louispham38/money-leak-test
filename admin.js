const AdminAuth = (() => {
  const TOKEN_KEY = "mlt_admin_token";
  const USER_KEY = "mlt_admin_user";

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
    return !!getToken();
  }

  function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  async function apiFetch(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${apiBase()}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      let detail = data.detail ?? data.message ?? "Lỗi máy chủ";
      if (Array.isArray(detail)) detail = detail.map((e) => e.msg || JSON.stringify(e)).join(". ");
      throw new Error(String(detail));
    }
    return data;
  }

  async function login(username, password) {
    const data = await apiFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setSession(data.token, data.user);
    return data;
  }

  async function getStats() {
    return apiFetch("/api/admin/stats");
  }

  async function getUsers() {
    return apiFetch("/api/admin/users");
  }

  async function getUserDetail(id) {
    return apiFetch(`/api/admin/users/${id}`);
  }

  return { isLoggedIn, getUser, login, logout, getStats, getUsers, getUserDetail };
})();

let allUsers = [];

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso.slice(0, 10);
  }
}

function renderStats(stats) {
  const el = document.getElementById("admin-stats");
  const cards = [
    { value: stats.total_users, label: "Thành viên đăng ký" },
    { value: stats.users_with_test, label: "Đã làm bài test" },
    { value: stats.total_tests, label: "Lượt làm test" },
    { value: stats.thu_chi_unique_users, label: "Dùng app Thu-Chi (user)" },
    { value: stats.thu_chi_total_clicks, label: "Lượt mở Thu-Chi" },
    { value: stats.users_with_goals, label: "Đã nhập mục tiêu TC" },
  ];
  el.innerHTML = cards
    .map(
      (c) =>
        `<div class="stat-card"><div class="stat-value">${c.value}</div><div class="stat-label">${c.label}</div></div>`
    )
    .join("");
}

function renderUsersTable(users) {
  const tbody = document.getElementById("users-tbody");
  tbody.innerHTML = users
    .map((u, i) => {
      const score =
        u.latest_score != null
          ? `<span class="score-pill">${u.latest_score}</span> <small>${u.latest_level || ""}</small>`
          : '<span class="badge badge-no">Chưa test</span>';
      const testBadge =
        u.test_count > 0
          ? `<span class="badge badge-yes">${u.test_count} lần</span>`
          : '<span class="badge badge-no">0</span>';
      const thuChi =
        u.thu_chi_clicks > 0
          ? `<span class="badge badge-yes">${u.thu_chi_clicks} lần</span>`
          : '<span class="badge badge-no">0</span>';
      return `<tr data-id="${u.id}">
        <td>${i + 1}</td>
        <td>${escapeHtml(u.full_name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.phone)}</td>
        <td>${score}</td>
        <td>${testBadge}</td>
        <td>${thuChi}</td>
        <td>${formatDate(u.created_at)}</td>
        <td><button type="button" class="btn-view" data-id="${u.id}">Chi tiết</button></td>
      </tr>`;
    })
    .join("");

  tbody.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", () => showUserDetail(parseInt(btn.dataset.id, 10)));
  });
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}

function filterUsers(q) {
  const term = q.trim().toLowerCase();
  if (!term) return allUsers;
  return allUsers.filter(
    (u) =>
      u.full_name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term))
  );
}

async function showUserDetail(userId) {
  const panel = document.getElementById("user-detail");
  const meta = document.getElementById("detail-meta");
  const resultsEl = document.getElementById("detail-results");
  panel.hidden = false;
  resultsEl.innerHTML = "<p>Đang tải...</p>";

  try {
    const data = await AdminAuth.getUserDetail(userId);
    const u = data.user;
    document.getElementById("detail-title").textContent = u.full_name;

    meta.innerHTML = `
      <div><strong>Email</strong>${escapeHtml(u.email)}</div>
      <div><strong>Số điện thoại</strong>${escapeHtml(u.phone)}</div>
      <div><strong>Đăng ký</strong>${formatDate(u.created_at)}</div>
      <div><strong>Mở Thu-Chi</strong>${data.events.filter((e) => e.event_type === "thu_chi_open").length} lần</div>
    `;

    if (!data.results.length) {
      resultsEl.innerHTML = "<p>Chưa có kết quả bài test.</p>";
      return;
    }

    resultsEl.innerHTML = data.results
      .map((r, idx) => {
        const answers = r.answers || [];
        const answersHtml =
          answers.length > 0
            ? `<ol class="answers-list">${answers
                .map(
                  (a) =>
                    `<li><span class="q-num">Câu ${a.q + 1}</span><span class="q-text">${escapeHtml(a.question)}</span><span class="a-label">→ ${escapeHtml(a.answer_label)}</span></li>`
                )
                .join("")}</ol>`
            : "<p><em>Chưa lưu câu trả lời chi tiết (làm test trước khi cập nhật hệ thống).</em></p>";

        const leaks = (r.top_leaks || [])
          .map((l) => (typeof l === "object" ? l.label : l))
          .join(", ");

        return `<div class="result-block">
          <h3>Lần test #${data.results.length - idx} — ${formatDate(r.created_at)}</h3>
          <p><strong>Điểm rò rỉ:</strong> <span class="score-pill">${r.score}/100</span> — ${escapeHtml(r.level_label)}</p>
          <p><strong>Top rò rỉ:</strong> ${escapeHtml(leaks || "—")}</p>
          ${r.readiness ? `<p><strong>Sẵn sàng thay đổi:</strong> ${escapeHtml(r.readiness)}</p>` : ""}
          <h4 style="margin:16px 0 8px;font-size:0.9rem">Câu trả lời (${answers.length}/19 — 16 câu + 3 câu chốt)</h4>
          ${answersHtml}
        </div>`;
      })
      .join("");

    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    resultsEl.innerHTML = `<p class="auth-error">${escapeHtml(err.message)}</p>`;
  }
}

async function initAdminApp() {
  document.getElementById("admin-login-screen").hidden = true;
  document.getElementById("admin-app").hidden = false;

  const user = AdminAuth.getUser();
  document.getElementById("admin-welcome").textContent = user?.full_name || "Admin";

  document.getElementById("admin-logout").addEventListener("click", () => AdminAuth.logout());
  document.getElementById("detail-close").addEventListener("click", () => {
    document.getElementById("user-detail").hidden = true;
  });

  const [stats, usersData] = await Promise.all([AdminAuth.getStats(), AdminAuth.getUsers()]);
  renderStats(stats);
  allUsers = usersData.users || [];
  renderUsersTable(allUsers);

  document.getElementById("user-search").addEventListener("input", (e) => {
    renderUsersTable(filterUsers(e.target.value));
  });
}

document.getElementById("admin-login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errEl = document.getElementById("admin-login-error");
  const btn = e.target.querySelector('button[type="submit"]');
  errEl.textContent = "";
  btn.disabled = true;
  try {
    await AdminAuth.login(
      document.getElementById("admin-user").value.trim(),
      document.getElementById("admin-pass").value
    );
    await initAdminApp();
  } catch (err) {
    errEl.textContent = err.message || "Đăng nhập thất bại";
  } finally {
    btn.disabled = false;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (AdminAuth.isLoggedIn()) initAdminApp();
});
