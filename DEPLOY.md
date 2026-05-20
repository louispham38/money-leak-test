# Deploy API lên Render

## Bước 1 — Đăng nhập Render

1. Vào [https://dashboard.render.com](https://dashboard.render.com)
2. Đăng ký / đăng nhập (có thể dùng GitHub)

## Bước 2 — Deploy bằng Blueprint

1. **New +** → **Blueprint**
2. Connect repository: `louispham38/money-leak-test`
3. Render đọc file `render.yaml` và tạo service `money-leak-test-api`
4. Biến `MLT_SECRET_KEY` sẽ được **tự sinh** — không cần nhập tay
5. Bấm **Apply** và đợi deploy (~3–5 phút)

## Bước 3 — Kiểm tra API

Mở: `https://money-leak-test-api.onrender.com/ping`

Kết quả mong đợi:

```json
{"ok": true, "service": "money-leak-test-api"}
```

## Bước 4 — Frontend (GitHub Pages)

Frontend đã cấu hình sẵn trong `config.js`:

- Local: `http://127.0.0.1:8000`
- Production: `https://money-leak-test-api.onrender.com`

Site: [https://louispham38.github.io/money-leak-test/](https://louispham38.github.io/money-leak-test/)

Sau khi API live, làm bài test → đăng ký → dữ liệu lưu trên server Render.

## Lưu ý (gói Free)

- **Cold start**: lần đầu sau ~15 phút không dùng, API có thể mất 30–60 giây để khởi động
- **SQLite**: dữ liệu có thể mất khi redeploy (gói free không có disk cố định). Nâng plan + disk nếu cần production thật

## Deploy bằng CLI (tuỳ chọn)

```bash
render login
cd money-leak-test
render blueprint launch
```

## Biến môi trường tùy chỉnh

| Biến | Mô tả |
|------|--------|
| `MLT_SECRET_KEY` | JWT secret (bắt buộc production) |
| `MLT_CORS_ORIGINS` | Origin được phép, cách nhau bởi dấu phẩy |
| `MLT_DB_PATH` | Đường dẫn file SQLite (nếu gắn disk) |
