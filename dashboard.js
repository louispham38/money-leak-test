const READINESS_MSG = {
  eager: "Bạn sẵn sàng bắt đầu — hãy áp dụng plan hành động ngay tuần này!",
  considering: "Bạn đang cân nhắc — bắt đầu với 1 bước nhỏ từ plan bên dưới.",
  comfortable: "Bạn cảm thấy ổn — vẫn nên theo dõi Thu-Chi để giữ vững phong độ.",
};

const VND = (n) => {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("vi-VN") + " ₫";
};

const fmtMonth = (period) => {
  if (!period) return "—";
  const m = period.match(/^(\d{4})-(\d{2})/);
  if (!m) return period;
  return `Tháng ${m[2]}/${m[1]}`;
};

let currentGoals = null;
let progressEntries = [];

function setGoalsViewMode(viewing) {
  document.getElementById("goals-summary").hidden = !viewing;
  document.getElementById("goals-form").hidden = viewing;
  document.getElementById("btn-edit-goals").hidden = !viewing;
  document.getElementById("btn-cancel-goals").hidden = !currentGoals;
}

function fillGoalsForm(goals) {
  document.getElementById("goal-income").value = goals?.monthly_income ?? "";
  document.getElementById("goal-savings").value = goals?.savings_target ?? "";
  document.getElementById("goal-emergency").value = goals?.emergency_fund ?? "";
  document.getElementById("goal-debt").value = goals?.debt_payoff ?? "";
  document.getElementById("goal-note").value = goals?.goal_note ?? "";
}

function renderGoalsSummary(goals) {
  currentGoals = goals;
  const hasGoals =
    goals && (goals.monthly_income || goals.savings_target || goals.emergency_fund || goals.debt_payoff);
  if (!hasGoals) {
    setGoalsViewMode(false);
    document.getElementById("btn-cancel-goals").hidden = true;
    return;
  }
  document.getElementById("sum-income").textContent = VND(goals.monthly_income);
  document.getElementById("sum-savings").textContent = VND(goals.savings_target);
  document.getElementById("sum-emergency").textContent = VND(goals.emergency_fund);
  document.getElementById("sum-debt").textContent = VND(goals.debt_payoff);
  document.getElementById("goals-note-display").textContent = goals.goal_note || "";
  document.getElementById("card-progress").hidden = false;
  setGoalsViewMode(true);
  fillGoalsForm(goals);
}

function aggregateProgress(entries) {
  if (!entries.length) return null;
  const latest = entries[0];
  const totals = entries.reduce(
    (acc, e) => {
      acc.debt_paid_total += Number(e.actual_debt_paid || 0);
      return acc;
    },
    { debt_paid_total: 0 }
  );
  return {
    latest_savings: Number(latest.actual_savings || 0),
    latest_emergency: Number(latest.actual_emergency || 0),
    debt_paid_total: totals.debt_paid_total,
    latest_income: Number(latest.actual_income || 0),
    period: latest.period_label,
  };
}

function renderProgressOverall() {
  const el = document.getElementById("progress-overall");
  if (!currentGoals || !progressEntries.length) {
    el.hidden = true;
    return;
  }
  const agg = aggregateProgress(progressEntries);
  const cards = [];

  const pushCard = (label, actual, target, suffix = "") => {
    if (!target) return;
    const pct = Math.min(100, Math.round((actual / target) * 100));
    const completed = actual >= target;
    cards.push(`
      <div class="progress-card ${completed ? "completed" : ""}">
        <span class="progress-card-label">${label}</span>
        <span class="progress-card-actual">${VND(actual)}</span>
        <span class="progress-card-target">/ Mục tiêu ${VND(target)}${suffix}</span>
        <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        <span class="progress-card-pct">${pct}%</span>
      </div>
    `);
  };

  pushCard("Tiết kiệm tháng gần nhất", agg.latest_savings, currentGoals.savings_target, " / tháng");
  pushCard("Quỹ khẩn cấp tích lũy", agg.latest_emergency, currentGoals.emergency_fund);
  pushCard("Đã trả nợ (cộng dồn)", agg.debt_paid_total, currentGoals.debt_payoff);
  if (currentGoals.monthly_income) {
    pushCard("Thu nhập tháng gần nhất", agg.latest_income, currentGoals.monthly_income, " / tháng");
  }

  if (!cards.length) {
    el.hidden = true;
    return;
  }
  el.innerHTML = cards.join("");
  el.hidden = false;
}

function renderProgressHistory() {
  const el = document.getElementById("progress-history");
  const empty = document.getElementById("progress-empty");
  if (!progressEntries.length) {
    el.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  el.innerHTML = progressEntries
    .map(
      (e) => `
      <div class="progress-history-item">
        <div class="progress-history-head">
          <div>
            <div class="progress-history-period">${fmtMonth(e.period_label)}</div>
            <div class="progress-history-date">Cập nhật: ${new Date(e.created_at).toLocaleString("vi-VN")}</div>
          </div>
          <button type="button" class="btn-delete" data-id="${e.id}">Xoá</button>
        </div>
        <div class="progress-history-grid">
          ${e.actual_income ? `<div><strong>Thu nhập</strong>${VND(e.actual_income)}</div>` : ""}
          ${e.actual_savings ? `<div><strong>Đã tiết kiệm</strong>${VND(e.actual_savings)}</div>` : ""}
          ${e.actual_emergency ? `<div><strong>Quỹ khẩn cấp</strong>${VND(e.actual_emergency)}</div>` : ""}
          ${e.actual_debt_paid ? `<div><strong>Đã trả nợ</strong>${VND(e.actual_debt_paid)}</div>` : ""}
        </div>
        ${e.note ? `<p class="progress-history-note">${escapeHtml(e.note)}</p>` : ""}
      </div>
    `
    )
    .join("");
  el.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Xoá bản ghi tiến độ này?")) return;
      await Auth.deleteGoalProgress(parseInt(btn.dataset.id, 10));
      progressEntries = progressEntries.filter((e) => e.id !== parseInt(btn.dataset.id, 10));
      renderProgressOverall();
      renderProgressHistory();
    });
  });
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fillProgressFormForPeriod(period) {
  const found = progressEntries.find((e) => e.period_label === period);
  document.getElementById("prog-period").value = period;
  document.getElementById("prog-income").value = found?.actual_income ?? "";
  document.getElementById("prog-savings").value = found?.actual_savings ?? "";
  document.getElementById("prog-emergency").value = found?.actual_emergency ?? "";
  document.getElementById("prog-debt").value = found?.actual_debt_paid ?? "";
  document.getElementById("prog-note").value = found?.note ?? "";
}

async function initDashboard() {
  const cfg = window.MLT_CONFIG || {};
  const thuChiUrl = cfg.THU_CHI_URL || "https://thu-chi-web.fly.dev/";
  const thuChiLink = document.getElementById("thu-chi-link");
  thuChiLink.href = thuChiUrl;
  thuChiLink.addEventListener("click", () => Auth.trackThuChiOpen());

  if (!Auth.isLoggedIn()) {
    document.getElementById("dash-login-required").hidden = false;
    return;
  }

  const user = Auth.getUser();
  document.getElementById("dash-greeting").textContent = `Xin chào, ${user.full_name}`;
  document.getElementById("dash-main").hidden = false;

  document.getElementById("btn-logout").addEventListener("click", () => Auth.logout());

  let result = await Auth.getLatestResult();
  if (!result) {
    const pending = sessionStorage.getItem("mlt_pending_result");
    if (pending) {
      const p = JSON.parse(pending);
      result = {
        score: p.score,
        level_label: p.level_label,
        level_key: p.level_key,
        top_leaks: p.top_leaks,
        plan_title: p.plan_title,
        plan_intro: p.plan_intro,
        plan_steps: p.plan_steps,
        readiness: p.readiness,
      };
    }
  }

  if (result) {
    document.getElementById("result-content").hidden = false;
    document.getElementById("dash-score").textContent = result.score;
    document.getElementById("dash-level").textContent = `Mức rò rỉ: ${result.level_label}`;
    document.getElementById("dash-meter").style.width = `${result.score}%`;
    const leaks = result.top_leaks || [];
    document.getElementById("dash-leaks").innerHTML = leaks
      .map((l, i) => {
        const label = typeof l === "string" ? l : l.label;
        return `<li><strong>#${i + 1}</strong> ${label}</li>`;
      })
      .join("");
    document.getElementById("dash-plan-title").textContent = result.plan_title || "Plan hành động";
    document.getElementById("dash-plan-intro").textContent =
      result.plan_intro || (result.readiness && READINESS_MSG[result.readiness]) || "";
    const steps = result.plan_steps || [];
    document.getElementById("dash-plan").innerHTML = steps.map((s) => `<li>${s}</li>`).join("");
    document.querySelector(".result-plan")?.setAttribute?.("data-level", result.level_key);
  } else {
    document.getElementById("no-result").hidden = false;
  }

  const goals = await Auth.getGoals();
  renderGoalsSummary(goals);

  document.getElementById("btn-edit-goals").addEventListener("click", () => {
    setGoalsViewMode(false);
    document.getElementById("btn-cancel-goals").hidden = false;
  });
  document.getElementById("btn-cancel-goals").addEventListener("click", () => {
    if (currentGoals) {
      fillGoalsForm(currentGoals);
      setGoalsViewMode(true);
    }
  });

  document.getElementById("goals-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("goals-msg");
    try {
      const saved = await Auth.saveGoals({
        monthly_income: parseFloat(document.getElementById("goal-income").value) || null,
        savings_target: parseFloat(document.getElementById("goal-savings").value) || null,
        emergency_fund: parseFloat(document.getElementById("goal-emergency").value) || null,
        debt_payoff: parseFloat(document.getElementById("goal-debt").value) || null,
        goal_note: document.getElementById("goal-note").value.trim() || null,
      });
      msg.textContent = "Đã lưu mục tiêu tài chính.";
      msg.className = "form-msg ok";
      renderGoalsSummary(saved || {
        monthly_income: parseFloat(document.getElementById("goal-income").value) || null,
        savings_target: parseFloat(document.getElementById("goal-savings").value) || null,
        emergency_fund: parseFloat(document.getElementById("goal-emergency").value) || null,
        debt_payoff: parseFloat(document.getElementById("goal-debt").value) || null,
        goal_note: document.getElementById("goal-note").value.trim() || null,
      });
      renderProgressOverall();
    } catch (err) {
      msg.textContent = err.message || "Lỗi lưu";
      msg.className = "form-msg";
    }
  });

  progressEntries = (await Auth.listGoalProgress()) || [];
  renderProgressOverall();
  renderProgressHistory();

  const progressForm = document.getElementById("progress-form");
  document.getElementById("btn-add-progress").addEventListener("click", () => {
    fillProgressFormForPeriod(currentMonth());
    progressForm.hidden = false;
    progressForm.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.getElementById("btn-cancel-progress").addEventListener("click", () => {
    progressForm.hidden = true;
  });
  document.getElementById("prog-period").addEventListener("change", (e) => {
    fillProgressFormForPeriod(e.target.value);
  });

  progressForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("progress-msg");
    const period = document.getElementById("prog-period").value;
    if (!period) {
      msg.textContent = "Chọn tháng";
      msg.className = "form-msg";
      return;
    }
    try {
      const entry = await Auth.addGoalProgress({
        period_label: period,
        actual_income: parseFloat(document.getElementById("prog-income").value) || null,
        actual_savings: parseFloat(document.getElementById("prog-savings").value) || null,
        actual_emergency: parseFloat(document.getElementById("prog-emergency").value) || null,
        actual_debt_paid: parseFloat(document.getElementById("prog-debt").value) || null,
        note: document.getElementById("prog-note").value.trim() || null,
      });
      const existingIdx = progressEntries.findIndex((p) => p.period_label === period);
      if (existingIdx >= 0) progressEntries[existingIdx] = entry;
      else {
        progressEntries.unshift(entry);
        progressEntries.sort((a, b) => (a.period_label > b.period_label ? -1 : 1));
      }
      msg.textContent = "Đã cập nhật tiến độ.";
      msg.className = "form-msg ok";
      renderProgressOverall();
      renderProgressHistory();
      setTimeout(() => {
        progressForm.hidden = true;
        msg.textContent = "";
      }, 800);
    } catch (err) {
      msg.textContent = err.message || "Lỗi lưu tiến độ";
      msg.className = "form-msg";
    }
  });
}

document.addEventListener("DOMContentLoaded", initDashboard);
