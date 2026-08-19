# BỘ NÃO THỨ 2 — Sổ tay vận hành Wiki tri thức (chuẩn Gia Cát Duẩn)

Đây là một **wiki tri thức bền vững** do AI duy trì. Khác với hỏi–đáp thông thường (mỗi câu hỏi lại đi tìm lại từ đầu), hệ thống này **biên dịch tri thức một lần rồi giữ cho luôn cập nhật**. Tri thức được tích lũy và bồi đắp theo thời gian, không tái tạo lại mỗi lần hỏi.

File này là cấu hình cốt lõi: nó dạy AI cách cư xử như một **người biên tập wiki có kỷ luật**, không phải một chatbot chung chung. Hãy cùng AI tiến hóa file này theo thời gian cho phù hợp lĩnh vực của bạn.

> **Bạn đang cầm bản STARTER (bộ khởi động).** Bộ này đã được bóc sạch mọi thông tin cá nhân/bảo mật của người tạo. Đọc `README.md` để cài trong 5 phút, rồi bắt đầu thả nguồn của **bạn** vào `raw/`.

---

## 1. Ba tầng kiến trúc

### Tầng 1 — Nguồn thô (`raw/`)
- Bộ sưu tập tài liệu gốc: bài viết, paper, ảnh, file dữ liệu, ghi âm, video.
- **BẤT BIẾN**. AI chỉ đọc, **không bao giờ sửa**. Đây là nguồn sự thật.
- Ảnh và file đính kèm để trong `raw/assets/`.

### Tầng 2 — Wiki (`wiki/`)
- Thư mục các trang markdown do AI tạo ra: tóm tắt nguồn, trang thực thể, trang khái niệm, so sánh, tổng quan, tổng hợp.
- **AI sở hữu hoàn toàn tầng này.** AI tạo trang, cập nhật khi có nguồn mới, duy trì liên kết chéo, giữ mọi thứ nhất quán.
- Bạn đọc; AI viết.

### Tầng 3 — Sổ tay (`CLAUDE.md` — file này)
- Mô tả cấu trúc wiki, quy ước, và quy trình làm việc.

---

## 2. Cấu trúc thư mục

```
BỘ NÃO THỨ 2/
├── CLAUDE.md            # Sổ tay này (schema)
├── README.md           # Hướng dẫn cài đặt 5 phút
├── HƯỚNG-DẪN-SỬ-DỤNG.md # Cách dùng hằng ngày + danh sách skill
├── .env.example        # Mẫu cấu hình (copy thành .env rồi điền)
├── index.md            # Mục lục nội dung — đọc đầu tiên khi trả lời
├── log.md              # Nhật ký theo thời gian (append-only)
├── raw/                # Nguồn thô, bất biến
│   └── assets/         # Ảnh & file đính kèm
├── wiki/               # Trang do AI tạo
│   ├── overview.md     # Trang tổng hợp/tổng quan toàn cục
│   ├── sources/        # Tóm tắt từng nguồn (1 trang / 1 nguồn)
│   ├── entities/       # Trang thực thể (người, tổ chức, sản phẩm, nơi chốn...)
│   ├── concepts/       # Trang khái niệm/chủ đề
│   └── analyses/       # Phân tích đã tích hợp vào mạng wiki (có liên kết chéo)
├── output/             # MỌI kết quả AI trả về được lưu ở đây
│   └── YYYY-MM-DD-mô-tả/   # MỖI kết quả = MỘT thư mục riêng; mọi file của kết quả nằm trong đó
└── .claude/
    └── skills/         # Bộ kỹ năng marketing & bán hàng (dùng lệnh /tên-skill)
```

> **Quy tắc bắt buộc cho `output/`:** không để file rời rạc ngay dưới `output/`. Mỗi kết quả tạo **một thư mục con** `output/YYYY-MM-DD-mô-tả-ngắn/`, rồi lưu **tất cả** file của kết quả đó vào trong (trang markdown chính, file `.docx`/`.pdf`/`.html`, ảnh, script tạo file, asset…). Trang markdown chính giữ tên mô tả (vd `output/2026-06-01-checklist-video/2026-06-01-checklist-video.md`).

---

## 3. Quy ước trang wiki

### Đặt tên file
- Dùng tên mô tả, dễ đọc, tiếng Việt có dấu được phép (Obsidian hỗ trợ).
- Một thực thể/khái niệm = một trang. Không trùng lặp.

### Frontmatter (YAML đầu trang)
Mọi trang wiki bắt đầu bằng frontmatter để dùng được với Dataview:
```yaml
---
type: source | entity | concept | analysis | overview
title: Tên trang
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [tag1, tag2]
sources: [tên-nguồn-1, tên-nguồn-2]   # các nguồn hỗ trợ trang này
---
```

### Liên kết chéo
- Dùng wiki-link Obsidian `[[Tên trang]]` để nối các trang.
- Liên kết **rộng tay**: một `[[link]]` chưa có trang tương ứng là bình thường — nó đánh dấu việc cần viết trang đó sau.
- Mọi trang nên có ít nhất một liên kết vào (tránh trang mồ côi).

### Trích dẫn
- Khi nêu một sự thật, chỉ rõ nguồn: `(theo [[sources/tên-nguồn]])`.
- Khi nguồn mới mâu thuẫn nguồn cũ, **ghi rõ mâu thuẫn** thay vì âm thầm ghi đè. Nêu cả hai và ngày tháng.

---

## 4. Quy trình: NẠP NGUỒN (Ingest)

Khi bạn thả một nguồn vào `raw/` và yêu cầu xử lý:

1. **Đọc** nguồn đầy đủ (với file có ảnh: đọc text trước, rồi xem ảnh riêng để bổ sung ngữ cảnh).
2. **Trao đổi** điểm chính với bạn (mặc định nạp từng nguồn một, có giám sát).
3. **Viết trang tóm tắt** trong `wiki/sources/` — các ý chính, dữ liệu, trích dẫn quan trọng.
4. **Cập nhật `index.md`** — thêm dòng cho trang mới.
5. **Cập nhật các trang thực thể & khái niệm** liên quan khắp wiki (một nguồn có thể chạm 10–15 trang). Tạo trang mới nếu xuất hiện thực thể/khái niệm chưa có.
6. **Củng cố hoặc thách thức** phần tổng hợp trong `overview.md`. Ghi rõ chỗ dữ liệu mới mâu thuẫn dữ liệu cũ.
7. **Ghi log** một dòng vào `log.md`.

---

## 5. Quy trình: TRUY VẤN (Query)

Khi bạn đặt câu hỏi:

1. **Đọc `index.md` trước** để tìm trang liên quan, rồi đi sâu vào các trang đó.
2. **Tổng hợp** câu trả lời kèm trích dẫn (`[[link]]` tới trang/nguồn).
3. Định dạng câu trả lời tùy câu hỏi: trang markdown, bảng so sánh, slide, biểu đồ, canvas.
4. **LƯU MỌI KẾT QUẢ vào `output/`** — đây là nguyên tắc bắt buộc để bộ não mở rộng tri thức:
   - **TẠO THƯ MỤC TRƯỚC:** mỗi kết quả là một thư mục con `output/YYYY-MM-DD-mô-tả-ngắn/`. **Không** lưu file rời trực tiếp dưới `output/`.
   - Trong thư mục đó, tạo file markdown chính `YYYY-MM-DD-mô-tả-ngắn.md`, kèm frontmatter (`type: output`, `title`, `created`, `tags`, `sources`).
   - **Mọi file phụ của kết quả** (`.docx`, `.pdf`, `.html`, ảnh, script…) cũng lưu **trong cùng thư mục** đó.
   - Mở đầu file ghi lại câu hỏi gốc, sau đó là nội dung trả lời đầy đủ và trích dẫn `[[link]]`.
   - **Cập nhật `index.md`** (mục Output) và **ghi `log.md`**.
   - Nếu kết quả đã tồn tại và chỉ cần bổ sung, **cập nhật file trong thư mục cũ** thay vì tạo trùng (giữ frontmatter `updated`).
5. **Nâng cấp lên wiki khi đáng giá**: nếu kết quả chứa tri thức dùng lại lâu dài, tích hợp nó vào `wiki/` (trang thực thể/khái niệm/analyses) và liên kết chéo.

---

## 6. Quy trình: KIỂM TRA SỨC KHỎE (Lint)

Định kỳ, khi bạn yêu cầu, rà soát wiki tìm:
- **Mâu thuẫn** giữa các trang.
- **Tuyên bố lỗi thời** mà nguồn mới hơn đã thay thế.
- **Trang mồ côi** không có liên kết vào.
- **Khái niệm quan trọng** được nhắc tới nhưng chưa có trang riêng.
- **Thiếu liên kết chéo**.
- **Lỗ hổng dữ liệu** có thể lấp bằng tìm kiếm web.

Đề xuất câu hỏi mới để điều tra và nguồn mới nên tìm. Ghi log kết quả lint.

---

## 7. `index.md` — Mục lục (hướng nội dung)

- Catalog mọi thứ trong wiki: mỗi trang một dòng — link, tóm tắt một câu, kèm metadata (ngày, số nguồn) nếu hữu ích.
- Tổ chức theo nhóm (Tổng quan, Thực thể, Khái niệm, Nguồn, Phân tích, Output).
- **Cập nhật mỗi lần nạp nguồn.**

## 8. `log.md` — Nhật ký (theo thời gian)

- Append-only. Ghi việc gì xảy ra và khi nào: nạp nguồn, truy vấn, lint.
- Mỗi mục bắt đầu bằng prefix nhất quán để parse được:
  `## [YYYY-MM-DD] ingest | Tên nguồn`
  `## [YYYY-MM-DD] query | Câu hỏi`
  `## [YYYY-MM-DD] lint | Tóm tắt`

---

## 9. Bộ kỹ năng (Skills) & cấu hình

Bộ não này đi kèm **~20 skill marketing & bán hàng** trong `.claude/skills/`. Gõ `/` trong Claude Code để thấy danh sách, hoặc xem `HƯỚNG-DẪN-SỬ-DỤNG.md`.

**Phần lớn skill chạy được NGAY, không cần cấu hình gì** — chúng chỉ đọc nguồn, suy nghĩ, rồi viết kết quả vào `output/`.

**Một vài skill cần khóa API (tùy chọn).** Nếu muốn dùng, copy `.env.example` thành `.env` rồi điền khóa của **bạn**:

| Cần khóa | Skill dùng đến | Không có thì sao |
|---|---|---|
| `YOUTUBE_API_KEY` | `GCD-mkt-research-youtube`, `GCD-mkt-shorts-*` | Bỏ qua phần lấy số liệu YouTube |
| `HEYZINE_API_KEY` + `HEYZINE_CLIENT_ID` | `GCD-mkt-ebook-sach-lat` (bước xuất sách lật) | Vẫn tạo được ebook + PDF, chỉ thiếu bản flipbook |
| `LARK_BASE_TOKEN` (tùy chọn) | các skill `GCD-sale-*` (nếu muốn lưu kế hoạch vào Lark Base) | Kết quả vẫn lưu đầy đủ ở `output/` dạng markdown |

> **Nguyên tắc bảo mật:** mọi khóa/token/mật khẩu chỉ nằm trong `.env` (đã được `.gitignore` bỏ qua). **Tuyệt đối không** ghi khóa thẳng vào skill, wiki, hay output. Khi chia sẻ bộ não cho người khác, chỉ chia phần khung — không chia `.env`.

---

## 10. Nguyên tắc chung

- Wiki là **tạo tác bền vững, bồi đắp dần** — không phải lịch sử chat.
- Giữ trang súc tích, có cấu trúc, liên kết tốt.
- Khi nghi ngờ về cấu trúc hay quy ước, hỏi bạn rồi cập nhật chính file `CLAUDE.md` này.
- Ngôn ngữ mặc định: **Tiếng Việt**.
- **Tạo skill mới:** theo skill `GCD-AIOS-tao-skill` — đặt tên `GCD-<lĩnh-vực>-<công-dụng>` (`mkt-` marketing · `sale-` bán hàng · `AIOS-` vận hành), và grounded từ kiến thức guru gốc theo khung SKILL.md chuẩn. Đọc skill đó trước khi tạo/đổi tên bất kỳ skill nào.
