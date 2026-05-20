import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def smtp_configured() -> bool:
    return bool(os.getenv("SMTP_HOST") and os.getenv("SMTP_USER") and os.getenv("SMTP_PASSWORD"))


def send_reset_email(to_email: str, reset_url: str) -> None:
    if not smtp_configured():
        raise RuntimeError("SMTP chưa được cấu hình trên server")

    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    from_addr = os.getenv("SMTP_FROM", user)

    subject = "Đặt lại mật khẩu — MoneyLeakTest"
    html = f"""
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
      <h2 style="color:#2563eb">MoneyLeakTest</h2>
      <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản <strong>{to_email}</strong>.</p>
      <p>Bấm nút bên dưới để tạo mật khẩu mới. Link có hiệu lực <strong>1 giờ</strong>.</p>
      <p style="margin:28px 0">
        <a href="{reset_url}" style="background:linear-gradient(135deg,#2563eb,#10b981);color:#fff;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:bold">
          Đặt lại mật khẩu
        </a>
      </p>
      <p style="font-size:13px;color:#64748b">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      <p style="font-size:12px;color:#94a3b8;word-break:break-all">{reset_url}</p>
    </div>
    """
    text = f"Đặt lại mật khẩu MoneyLeakTest: {reset_url}\nLink hết hạn sau 1 giờ."

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_email
    msg.attach(MIMEText(text, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(user, password)
        server.sendmail(from_addr, [to_email], msg.as_string())
