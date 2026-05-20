(function () {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const form = document.getElementById("reset-form");
  const invalidEl = document.getElementById("reset-invalid");
  const errEl = document.getElementById("reset-error");
  const okEl = document.getElementById("reset-success");

  if (!token) {
    form.hidden = true;
    invalidEl.hidden = false;
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.textContent = "";
    okEl.textContent = "";
    const p1 = document.getElementById("reset-password").value;
    const p2 = document.getElementById("reset-password2").value;
    if (p1 !== p2) {
      errEl.textContent = "Hai mật khẩu không khớp";
      return;
    }
    const btn = document.getElementById("reset-submit");
    btn.disabled = true;
    btn.textContent = "Đang lưu...";
    try {
      await Auth.resetPassword({ token, password: p1 });
      okEl.textContent = "Đã đổi mật khẩu thành công! Chuyển sang đăng nhập...";
      form.hidden = true;
      setTimeout(() => {
        window.location.href = "index.html?login=1";
      }, 2000);
    } catch (err) {
      errEl.textContent = err.message || "Không đặt lại được mật khẩu";
    } finally {
      btn.disabled = false;
      btn.textContent = "Lưu mật khẩu mới";
    }
  });
})();
