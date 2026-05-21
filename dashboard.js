const READINESS_MSG = {
  eager: "Bạn sẵn sàng bắt đầu — hãy áp dụng plan hành động ngay tuần này!",
  considering: "Bạn đang cân nhắc — bắt đầu với 1 bước nhỏ từ plan bên dưới.",
  comfortable: "Bạn cảm thấy ổn — vẫn nên theo dõi Thu-Chi để giữ vững phong độ.",
};

async function initDashboard() {
  const cfg = window.MLT_CONFIG || {};
  const thuChiUrl = cfg.THU_CHI_URL || "https://thu-chi-web.onrender.com";
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
  if (goals) {
    document.getElementById("goal-income").value = goals.monthly_income ?? "";
    document.getElementById("goal-savings").value = goals.savings_target ?? "";
    document.getElementById("goal-emergency").value = goals.emergency_fund ?? "";
    document.getElementById("goal-debt").value = goals.debt_payoff ?? "";
    document.getElementById("goal-note").value = goals.goal_note ?? "";
  }

  document.getElementById("goals-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("goals-msg");
    try {
      await Auth.saveGoals({
        monthly_income: parseFloat(document.getElementById("goal-income").value) || null,
        savings_target: parseFloat(document.getElementById("goal-savings").value) || null,
        emergency_fund: parseFloat(document.getElementById("goal-emergency").value) || null,
        debt_payoff: parseFloat(document.getElementById("goal-debt").value) || null,
        goal_note: document.getElementById("goal-note").value.trim() || null,
      });
      msg.textContent = "Đã lưu mục tiêu tài chính.";
      msg.className = "form-msg ok";
    } catch (err) {
      msg.textContent = err.message || "Lỗi lưu";
      msg.className = "form-msg";
    }
  });
}

document.addEventListener("DOMContentLoaded", initDashboard);
