# MoneyLeakTest — Bài Test Rò Rỉ Tài Chính

Landing page tiếng Việt + bài test 15 câu giúp người dùng phát hiện chính xác lỗ hổng đang "rò rỉ" tiền mỗi tháng — và nhận plan hành động cụ thể để khóa lại.

## Tính năng

- **Landing page** responsive, giao diện sáng/chuyên nghiệp với gradient xanh dương–xanh ngọc.
- **Bài test 15 câu** chấm điểm 0–100 ở 6 nhóm lỗ hổng: subscription, mua sắm cảm xúc, lãi vay, chi tiêu hàng ngày, đầu tư, xã giao.
- **Kết quả cá nhân hóa**: điểm tổng, top lỗ hổng, plan hành động 3 bước.
- **Tích hợp Zalo**: nút và QR code dẫn về nhóm cộng đồng "Thịnh Vượng - Hạnh Phúc".

## Cấu trúc

```
.
├── index.html      # Trang chính
├── styles.css      # Toàn bộ giao diện
└── app.js          # Bài test + nội dung động (LEAKS, FAQ, QUESTIONS, PLANS)
```

Toàn bộ là static — chỉ HTML / CSS / JavaScript thuần, không cần build.

## Chạy local

```bash
python3 -m http.server 8765
# Mở http://localhost:8765
```

## Deploy

### GitHub Pages

1. Vào repo trên GitHub → **Settings** → **Pages**.
2. **Source**: chọn nhánh `main`, thư mục `/ (root)`.
3. Lưu và đợi build xong, site sẽ chạy ở `https://louispham38.github.io/money-leak-test/`.

### Netlify Drop

Kéo thả thư mục dự án lên [Netlify Drop](https://app.netlify.com/drop).

## Tham gia cộng đồng

Nhóm Zalo **Thịnh Vượng - Hạnh Phúc**: <https://zalo.me/g/gkbvgqaoxnggs2p8euih>

## License

Mã nguồn dùng cho mục đích giáo dục. Nội dung không phải tư vấn tài chính.
