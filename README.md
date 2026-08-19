# BỘ NÃO THỨ 2 — Cài trong 5 phút

Đây là **bộ não thứ 2** chuẩn Gia Cát Duẩn: một wiki tri thức do AI (Claude) tự biên tập, tự tích lũy, cộng **~20 kỹ năng marketing & bán hàng** dùng được ngay.

Bạn **không cần lập trình**. Chỉ cần làm 4 bước dưới đây.

---

## Bước 1 — Cài Claude Code (một lần duy nhất)

Claude Code là công cụ để "nói chuyện" với bộ não này.

1. Cài **Node.js** (bản LTS): <https://nodejs.org> → tải, bấm Next tới hết.
2. Mở **Terminal** (Windows: gõ `cmd` ở menu Start · Mac: mở app *Terminal*).
3. Dán lệnh sau rồi Enter:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
4. Đăng nhập tài khoản Claude của bạn khi được hỏi (gõ `claude` rồi làm theo hướng dẫn).

> Chưa có tài khoản? Đăng ký tại <https://claude.ai>.

---

## Bước 2 — Đặt bộ não vào máy

1. Giải nén file `.zip` này ra một thư mục bạn dễ tìm, ví dụ:
   - Windows: `D:\BỘ NÃO THỨ 2`
   - Mac: `~/BỘ NÃO THỨ 2`
2. (Khuyến khích) Cài **Obsidian** miễn phí (<https://obsidian.md>) và "Open folder as vault" trỏ vào thư mục này — để đọc wiki đẹp, thấy liên kết `[[...]]` bấm được.

---

## Bước 3 — (Tùy chọn) Điền khóa API

**Bỏ qua được** — phần lớn skill chạy không cần gì.

Nếu muốn dùng các skill cần khóa (research YouTube, xuất sách lật, lưu vào Lark Base):
1. Copy file `.env.example` thành `.env` (giữ nguyên trong thư mục gốc).
2. Mở `.env` bằng Notepad, điền khóa của **bạn** vào chỗ trống. Xem hướng dẫn lấy khóa ngay trong file đó.

---

## Bước 4 — Chạy

1. Mở Terminal **ngay trong thư mục bộ não**:
   - Windows: mở thư mục → gõ `cmd` vào thanh địa chỉ → Enter.
   - Mac: chuột phải thư mục → *New Terminal at Folder*.
2. Gõ:
   ```
   claude
   ```
3. Xong! Giờ bạn có thể:
   - **Thả file** (bài viết, PDF, video, ảnh) vào thư mục `raw/` rồi bảo: *"Nạp nguồn mới trong raw/"*.
   - **Hỏi** bất cứ điều gì: *"Tổng hợp giúp tôi về chủ đề X từ wiki"*.
   - **Gọi skill**: gõ `/` để thấy danh sách, ví dụ `/gcd-mkt-hook-video` để viết hook video.

Mọi kết quả AI làm ra được lưu tự động trong `output/`.

---

## Bộ này có gì?

- **Cấu trúc wiki bền vững** (`raw/` → `wiki/` → `output/`) — đọc `CLAUDE.md` để hiểu triết lý.
- **~20 skill** marketing & bán hàng — xem danh sách trong `HƯỚNG-DẪN-SỬ-DỤNG.md`.
- Đã **bóc sạch** mọi token, mật khẩu, tài khoản cá nhân của người tạo. An toàn để dùng và chia sẻ khung.

## Cần trợ giúp?

Hỏi thẳng Claude trong Terminal: *"Giải thích cho tôi cách bộ não này hoạt động"* — nó đọc `CLAUDE.md` và hướng dẫn bạn.
