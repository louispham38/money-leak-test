# Deploy lên Fly.io (Free)

Free plan của Fly.io cho phép 3 máy ảo nhỏ + 3GB volume — đủ chạy app này miễn phí, có disk lưu SQLite vĩnh viễn.

## 1. Cài CLI

**macOS / Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows (PowerShell):**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

Mở terminal mới rồi kiểm tra:
```bash
fly version
```

## 2. Đăng ký / đăng nhập

```bash
fly auth signup     # nếu chưa có tài khoản
# hoặc
fly auth login
```

Fly.io yêu cầu **gắn thẻ tín dụng** để xác thực (chống abuse) nhưng **không charge nếu ở trong free tier**.

## 3. Tạo app

```bash
cd /Users/phamkhang/Documents/CursorAI/money-leak-test/backend
fly apps create money-leak-test-api
```

Nếu tên đã có người dùng, đổi sang tên khác (vd: `mlt-api-louispham`). Sau đó sửa dòng `app = ` trong `fly.toml` cho khớp.

## 4. Tạo volume (để giữ SQLite vĩnh viễn)

```bash
fly volumes create money_leak_data --region sin --size 1
```

(1GB là dư cho SQLite; có thể giảm còn 1GB free quota.)

## 5. Đặt secrets (biến môi trường nhạy cảm)

```bash
fly secrets set \
  MLT_SECRET_KEY="$(openssl rand -hex 32)" \
  MLT_ADMIN_PASSWORD="pAss123" \
  SMTP_HOST="smtp.gmail.com" \
  SMTP_USER="your@gmail.com" \
  SMTP_PASSWORD="your-app-password" \
  SMTP_FROM="MoneyLeakTest <your@gmail.com>"
```

Nếu chưa cấu hình email, bỏ 4 dòng `SMTP_*` (chỉ thiếu chức năng quên mật khẩu).

## 6. Deploy

```bash
fly deploy
```

Lần đầu sẽ mất ~3-5 phút build image. Sau đó:

```bash
fly status
fly logs
```

Kiểm tra hoạt động:
```bash
curl https://money-leak-test-api.fly.dev/ping
```

(Đổi `money-leak-test-api` nếu bạn đặt tên khác.)

## 7. Cập nhật frontend

Mở `config.js` ở thư mục gốc, sửa dòng `PROD_API`:

```js
const PROD_API = "https://money-leak-test-api.fly.dev";
```

Commit & push để GitHub Pages cập nhật.

## 8. Update sau này

Mỗi lần thay đổi backend:
```bash
cd backend
fly deploy
```

Frontend: chỉ cần `git push` → GitHub Pages tự deploy.

## Hữu ích

| Lệnh | Mô tả |
|------|------|
| `fly logs` | Xem log realtime |
| `fly ssh console` | SSH vào máy ảo |
| `fly secrets list` | Xem secrets đã đặt |
| `fly status` | Trạng thái app |
| `fly machines list` | Danh sách máy ảo |
| `fly volumes list` | Danh sách volume |
| `fly apps destroy` | Xoá app (không khôi phục được) |

## Free tier limit

- **3 shared-cpu-1x VMs** (256MB RAM mỗi máy)
- **3GB persistent volume tổng**
- **160GB outbound bandwidth/tháng**
- App tự sleep khi không có traffic (auto_stop_machines = "stop"), tự bật khi có request → tiết kiệm thời gian VM
