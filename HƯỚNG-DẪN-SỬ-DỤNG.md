# HƯỚNG DẪN SỬ DỤNG — Bộ Não Thứ 2

> Đã cài xong (xem `README.md`)? Đây là cách dùng hằng ngày. Mọi thao tác chỉ là **nói chuyện bằng tiếng Việt** với Claude trong Terminal.

---

## 1. Ba việc bạn sẽ làm nhất

### a) Nạp tri thức (cho não "học")
Thả file vào thư mục `raw/` (bài viết, PDF, ảnh chụp màn hình, transcript video, ghi âm…), rồi gõ:
> *"Nạp nguồn mới trong raw/"*

Claude sẽ đọc, viết trang tóm tắt trong `wiki/sources/`, tạo/cập nhật các trang thực thể & khái niệm liên quan, và ghi vào `index.md` + `log.md`. Càng nạp nhiều, não càng thông minh.

### b) Hỏi & lấy kết quả
> *"Từ những gì đã học, viết cho tôi một bài về chủ đề X"*
> *"So sánh giúp tôi A và B trong wiki"*

Claude tổng hợp từ wiki (kèm trích dẫn `[[nguồn]]`) và **lưu kết quả vào `output/YYYY-MM-DD-mô-tả/`** để dùng lại sau.

### c) Gọi skill làm việc chuyên môn
Gõ `/` để thấy danh sách, hoặc gõ thẳng tên. Ví dụ:
> `/gcd-mkt-chan-dung-dau-suong` → dựng chân dung khách hàng
> `/gcd-mkt-hook-video` → viết hook video chống lướt
> `/gcd-sale-dinh-gia-offer` → định giá & đóng gói offer

Xem đầy đủ 23 skill trong `.claude/skills/index.md`.

> **Lần đầu dùng bộ não?** Chạy `/gcd-AIOS-hoan-tat-ho-so-doanh-nghiep` trước — nó điền hồ sơ doanh nghiệp (định vị, ICP, giọng thương hiệu, sản phẩm) vào `wiki/` để mọi skill sau đó không phải hỏi lại từ đầu.

---

## 2. Một luồng làm việc mẫu (từ số 0 → có content bán hàng)

1. Thả vài bài viết/video của lĩnh vực bạn vào `raw/` → *"Nạp nguồn"*.
2. `/gcd-AIOS-hoan-tat-ho-so-doanh-nghiep` → điền hồ sơ doanh nghiệp vào `wiki/` (làm 1 lần, dùng mãi).
3. `/gcd-mkt-validate-ngach` → đo cầu thật của ngách, quyết định có làm hay không.
4. `/gcd-sale-bmc-phong-van-chi-tiet` → dựng mô hình kinh doanh 9 ô chi tiết + sơ đồ canvas.
5. `/gcd-mkt-chan-dung-dau-suong` → hiểu khách hàng, biết nên làm content gì.
6. `/gcd-mkt-lead-magnet` → chọn 1 mồi câu để thu khách.
7. `/gcd-mkt-leadpage` hoặc `/gcd-mkt-ladipage` → dựng trang thu lead / bán hàng.
8. `/gcd-mkt-hook-video` + `/gcd-mkt-content-30-ngay` → sản xuất nội dung đều đặn.
9. `/gcd-sale-dinh-gia-offer` + `/gcd-sale-ke-hoach-loi-nhuan` → chốt mô hình tiền.

Mỗi bước đều để lại kết quả trong `output/` — bộ não của bạn lớn dần theo thời gian.

---

## 3. Nguyên tắc để não luôn khỏe

- **Nguồn thô là bất biến:** đừng sửa file trong `raw/`. Muốn sửa tri thức thì sửa trong `wiki/`.
- **Định kỳ nhờ lint:** *"Kiểm tra sức khỏe wiki giúp tôi"* → Claude tìm mâu thuẫn, trang mồ côi, lỗ hổng.
- **Bảo mật:** khóa/mật khẩu chỉ để trong `.env`. Không dán vào chat, wiki, hay output. Khi chia bộ não cho người khác, **không** đưa file `.env`.

---

## 4. Mở rộng bộ não

- **Thêm skill mới:** *"Tạo skill mới về …"* — Claude theo chuẩn `gcd-AIOS-tao-skill` (đặt tên `gcd-<lĩnh-vực>-<công-dụng>`, grounded từ chuyên gia gốc).
- **Sửa quy ước:** cứ bảo Claude cập nhật `CLAUDE.md` — đó là "hiến pháp" của bộ não, nên tiến hóa theo bạn.

---

## 5. Kẹt ở đâu?
Hỏi thẳng trong Terminal:
> *"Bộ não này hoạt động thế nào?"* · *"Skill nào giúp tôi làm X?"* · *"Vì sao skill Y báo lỗi?"*
