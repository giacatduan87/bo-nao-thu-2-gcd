# BỘ NÃO THỨ 2 — Cài trong 5 phút

Đây là **bộ não thứ 2** chuẩn Gia Cát Duẩn: một wiki tri thức do AI (Claude) tự biên tập, tự tích lũy, cộng **24 kỹ năng marketing & bán hàng** dùng được ngay.

Bạn **không cần lập trình**. Làm theo các bước dưới đây, khoảng 20 phút cho lần đầu.

---

## Bước 0 — Bạn cần có gì

| Thứ | Bắt buộc? | Lấy ở đâu |
|---|---|---|
| **Tài khoản Claude TRẢ PHÍ** | ✅ | <https://claude.ai/pricing> — **bản miễn phí KHÔNG chạy được** |
| Node.js (bản LTS) | ✅ | <https://nodejs.org> — tải, bấm Next tới hết |
| Git | ✅ | Windows: <https://git-scm.com/download/win> · Mac: gõ `git` một lần, máy tự hỏi cài |
| Máy tính Windows hoặc Mac | ✅ | Không dùng được trên điện thoại |
| Obsidian | ⬜ | <https://obsidian.md> — để đọc wiki đẹp, không có vẫn chạy |

**Không cần biết lập trình.** Toàn bộ thao tác là gõ tiếng Việt nói chuyện với máy.

---

## Bước 1 — Cài Claude Code (một lần duy nhất)

Claude Code là công cụ để "nói chuyện" với bộ não này.

1. Mở **Terminal** (Windows: gõ `cmd` ở menu Start · Mac: mở app *Terminal*).
2. Dán lệnh sau rồi Enter:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
3. Đăng nhập tài khoản Claude của bạn khi được hỏi (gõ `claude` rồi làm theo hướng dẫn).

---

## Bước 2 — Tải bộ não về máy

Vẫn trong Terminal, dán **cả ba dòng** này rồi Enter:

```bash
git clone https://github.com/giacatduan87/bo-nao-thu-2-gcd.git
cd bo-nao-thu-2-gcd
claude
```

Xong. Bộ não **và cả 24 skill** đã sẵn sàng — skill nằm trong `.claude/skills/` ngay bên trong
thư mục này, Claude Code tự nạp, **không có bước cài skill riêng**.

> Muốn đặt ở chỗ khác? Trước khi chạy `git clone`, gõ `cd` tới thư mục bạn muốn.
> Ví dụ Windows: `cd D:\` rồi mới clone.

> Không cài được Git? Vào <https://github.com/giacatduan87/bo-nao-thu-2-gcd> → nút xanh
> **Code** → **Download ZIP** → giải nén ra thư mục bạn dễ tìm. Cách này chạy y hệt, chỉ là
> sau này cập nhật phải tải lại bằng tay.

(Khuyến khích) Cài **Obsidian** rồi *"Open folder as vault"* trỏ vào thư mục này — để đọc wiki
đẹp, thấy liên kết `[[...]]` bấm được.

---

## Bước 3 — (Tùy chọn) Điền khóa API

**Bỏ qua được** — phần lớn skill chạy không cần gì.

Nếu muốn dùng các skill cần khóa (research YouTube, xuất sách lật, lưu vào Lark Base):
1. Copy file `.env.example` thành `.env` (giữ nguyên trong thư mục gốc).
2. Mở `.env` bằng Notepad, điền khóa của **bạn** vào chỗ trống. Xem hướng dẫn lấy khóa ngay trong file đó.

---

## Bước 4 — Chạy

Lần sau muốn mở lại bộ não, **luôn phải mở Terminal BÊN TRONG thư mục bộ não** rồi mới gõ `claude`:

- Windows: mở thư mục → gõ `cmd` vào thanh địa chỉ → Enter.
- Mac: chuột phải thư mục → *New Terminal at Folder*.

> ⚠️ **Lỗi hay gặp nhất:** mở Terminal ở chỗ khác rồi gõ `claude` — gõ `/` sẽ **không thấy skill nào**.
> Skill gắn với thư mục, không gắn với máy.

Giờ bạn có thể:
   - **Thả file** (bài viết, PDF, video, ảnh) vào thư mục `raw/` rồi bảo: *"Nạp nguồn mới trong raw/"*.
   - **Hỏi** bất cứ điều gì: *"Tổng hợp giúp tôi về chủ đề X từ wiki"*.
   - **Gọi skill**: gõ `/` để thấy danh sách, ví dụ `/GCD-mkt-hook-video` để viết hook video.

Mọi kết quả AI làm ra được lưu tự động trong `output/`.

---

## Bộ này có gì?

- **Cấu trúc wiki bền vững** (`raw/` → `wiki/` → `output/`) — đọc `CLAUDE.md` để hiểu triết lý.
- **24 skill** marketing & bán hàng — xem danh sách trong `HƯỚNG-DẪN-SỬ-DỤNG.md`.
- Đã **bóc sạch** mọi token, mật khẩu, tài khoản cá nhân của người tạo. An toàn để dùng và chia sẻ khung.

## Cập nhật khi có bản mới

Khi có thêm skill mới, mở Terminal **trong thư mục bộ não** và dán đúng một dòng:

```bash
git fetch origin && git checkout origin/main -- .claude/skills
```

Lệnh này **chỉ lấy về thư mục skill**. Mọi thứ bạn đã tích lũy trong `raw/`, `wiki/`, `output/`
được giữ nguyên, không mất gì.

> ⛔ **ĐỪNG dùng `git pull` để cập nhật.** Kho có theo dõi `wiki/`, `index.md`, `log.md` —
> đó chính là những file Claude sửa mỗi phiên bạn làm việc. `git pull` sẽ báo đụng độ và
> bạn sẽ mắc kẹt. Chỉ dùng đúng lệnh ở trên.

*(Tải bằng Download ZIP? Tải file mới rồi chỉ chép đè thư mục `.claude/skills/`, đừng chép đè cả thư mục.)*

---

## Cần trợ giúp?

Hỏi thẳng Claude trong Terminal: *"Giải thích cho tôi cách bộ não này hoạt động"* — nó đọc `CLAUDE.md` và hướng dẫn bạn.
