# SOP triển khai — từ con số 0 tới trang chạy quảng cáo được

Lần đầu mất khoảng 2 tiếng (chủ yếu chờ người dùng lấy khoá). Từ lần thứ hai: **20 phút.**

---

## Bố cục thư mục — dựng đúng ngay từ đầu

```
<thư-mục-chiến-dịch>/
├── config-ebook.json          # mọi chữ trên trang
├── bia/
│   ├── anh-bia-goc.png        # ảnh bìa gốc từ công cụ tạo ảnh
│   └── bia-hero.webp          # bản đã nới đáy + nén (config trỏ vào file này)
├── ebook/
│   └── <ten>.md → .pdf        # ruột ebook
├── site/                      # ⬅ THƯ MỤC ĐEM DEPLOY
│   ├── index.html             # do build script sinh ra
│   └── assets/hero-<hash>.webp
└── functions/                 # ⬅ NGANG HÀNG với site/, KHÔNG nằm trong site/
    └── api/lead.js
```

> ⚠️ **KHÔNG tạo `wrangler.toml`.** Xem bẫy số 7 — nó giết mọi secret. Deploy bằng cờ dòng lệnh.

---

## GIAI ĐOẠN 1 — Nội dung (30 phút)

1. **Hỏi người dùng thông tin thương hiệu.** BẮT BUỘC, không được bịa:
   tên thương hiệu · địa chỉ · hotline · email. Script sẽ dừng nếu `brand_name` rỗng.
2. **Viết copy** theo `references/cong-thuc-copy.md`. Đưa người dùng duyệt trước khi build.
3. **Ảnh bìa:** tạo bằng công cụ sinh ảnh (kết quả đẹp hơn hẳn tự ghép chữ), rồi:
   ```powershell
   .\scripts\render-bia-hero.ps1 -Nguon "...\bia\anh-bia-goc.png" -Ra "...\bia\bia-hero.webp"
   ```
4. **Dựng trang + xem thử:**
   ```powershell
   python .\scripts\build_ebook_leadpage.py --config "<...>\config-ebook.json" --out "<...>\site"
   & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu `
     --hide-scrollbars --window-size=460,2300 --virtual-time-budget=6000 `
     --screenshot="<...>\preview.png" "file:///<...>/site/index.html"
   ```
5. **CỔNG DUYỆT — người dùng xem `preview.png` và gật đầu.** Chưa duyệt thì chưa deploy.

---

## GIAI ĐOẠN 2 — Đưa lên mạng (15 phút)

6. **Đăng nhập Cloudflare** (mở trình duyệt, người dùng bấm Allow):
   ```powershell
   npx --yes wrangler@latest login
   npx --yes wrangler@latest whoami        # lấy Account ID, ghi lại
   ```
7. **Tạo project + đẩy lên:**
   ```powershell
   npx --yes wrangler@latest pages project create <ten-du-an> --production-branch main
   npx --yes wrangler@latest pages deploy site --cwd "<gốc dự án>" `
       --project-name <ten-du-an> --branch main --commit-dirty=true
   ```
   ✅ Phải thấy **`✨ Compiled Worker successfully`** — thiếu dòng này nghĩa là
   `functions/` đặt sai chỗ (bẫy 6).

8. **Gắn tên miền con** (wrangler không có lệnh này — phải gọi API, bẫy 4):
   ```powershell
   $tok = [regex]::Match(
     [IO.File]::ReadAllText("$env:APPDATA\xdg.config\.wrangler\config\default.toml"),
     'oauth_token\s*=\s*"([^"]+)"').Groups[1].Value
   Invoke-RestMethod -Method Post `
     -Uri "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/pages/projects/<ten-du-an>/domains" `
     -Headers @{ Authorization = "Bearer $tok" } -ContentType "application/json" `
     -Body '{"name":"ten.mien.cua.ban"}'
   ```
9. **Nhờ người dùng bấm tay 1 bản ghi CNAME** (bẫy 5) — bảng điều khiển Cloudflare →
   tên miền → DNS → Add record: `CNAME` · name = phần con · target = `<ten-du-an>.pages.dev` ·
   **Proxied, đám mây CAM**.
10. Chờ ~1 phút rồi kiểm tra `status/verification/validation` đều `active`.

---

## GIAI ĐOẠN 3 — Nối nơi nhận lead (20 phút)

11. **Lấy `app_token` THẬT của Base** — token trong link wiki KHÔNG dùng được để ghi:
    ```powershell
    lark-cli api GET /open-apis/bitable/v1/apps/<token-trong-link> --as bot -q ".data.app.app_token"
    lark-cli api GET /open-apis/bitable/v1/apps/<app_token>/tables --as bot   # tìm table_id
    lark-cli api GET /open-apis/bitable/v1/apps/<app_token>/tables/<tbl>/fields --as bot
    ```
12. **KIỂM TRA BOT GHI ĐƯỢC — làm trước khi viết mã.** Bot đọc được không có nghĩa là ghi được:
    ```powershell
    lark-cli base +record-upsert --base-token <app_token> --table-id <tbl> `
      --json "@./ban-ghi-thu.json" --as bot
    ```
    Chạy được → xoá bản ghi thử → yên tâm đi tiếp. Lỗi → cần thêm bot làm cộng tác viên của Base.
13. **Sửa `functions/api/lead.js`** — tìm chữ `ĐỔI:` để thấy mọi chỗ cần thay.
14. **Nạp secret** (người dùng tự dán, đừng để AI đọc kho mật khẩu của họ):
    ```powershell
    npx --yes wrangler@latest pages secret put LARK_APP_SECRET --project-name <ten-du-an>
    ```
    → **Dán bằng CHUỘT PHẢI, không Ctrl+V** (bẫy 10). Màn hình không hiện chữ là bình thường.
    → Chỉ MỘT secret. **Không có khoá nhà gửi thư** — hàm Cloudflare không gửi thư.
15. **Deploy lại** — secret chỉ có tác dụng với bản deploy MỚI.

---

## GIAI ĐOẠN 4 — Nối máy gửi thư bằng Lark Mail (15 phút)

> ⛔ **Đừng thay bằng Resend / Brevo / SMTP.** Quyền gửi thư của Lark **chỉ cấp cho token
> NGƯỜI DÙNG** nằm trên máy đã `lark-cli login`. Hàm Cloudflare và hosting **không gửi được**.
> Đường đi bắt buộc: `hàm Cloudflare → Lark Base → máy bạn quét bảng → lark-cli mail +send`.

16. **Tạo cột `Đã gửi thư` kiểu Checkbox** trong bảng đích.
    **Bỏ bước này là hỏng nặng:** mỗi lượt quét sẽ gửi lại toàn bộ danh sách, khách nhận
    thư trùng mỗi 2 phút. Script tự dừng và báo lỗi nếu không thấy cột này.

17. **Chép `scripts/gui-thu-lark.mjs`, `chay-gui-thu.cmd`, `chay-an.vbs`** vào một thư mục
    trên máy bạn (KHÔNG để trong `site/`, KHÔNG deploy lên đâu cả). Sửa mọi chỗ có chữ `ĐỔI:`
    — `BASE_TOKEN` và `TABLE_ID` phải TRÙNG với giá trị trong `lead.js`.

18. **Đăng nhập Lark trên máy** rồi kiểm hộp thư gửi được:
    ```powershell
    lark-cli login
    lark-cli mail +send --from <hop-thu-cua-ban> --to <email-cua-ban> `
      --subject "thu thu" --body-file than-thu.html --confirm-send
    ```

19. **CHẠY THỬ trước khi gửi thật** — dựng thư ra file, không gửi, không tích ô:
    ```powershell
    node gui-thu-lark.mjs --thu
    ```
    Mở `than-thu.html` bằng Chrome xem mặt thư. Ưng rồi mới bỏ cờ `--thu`.

20. **Đặt lịch quét** — Task Scheduler, mỗi 2 phút, trỏ vào **`chay-an.vbs`**
    (không phải `.cmd`, để khỏi nhảy cửa sổ đen mỗi lượt). Chọn *"Run whether user is
    logged on or not"* nếu muốn chạy cả khi khoá màn hình.
    **Máy tắt thì thư nằm chờ, không mất ai** — bật lên là lượt quét kế tiếp gửi bù.

21. **Nghiệm thu đủ 13 mục** ở cuối `references/BAY-DA-DINH.md`.
    Muốn gửi lại thư thử: dùng `lark-cli base +record-upsert` bỏ tích ô `Đã gửi thư`
    của một dòng, lượt quét kế tiếp gửi lại ngay.

---

## Sửa nội dung về sau

| Muốn đổi | Sửa ở đâu | Rồi làm gì |
|---|---|---|
| Chữ trên trang | `config-ebook.json` | build + deploy |
| Ảnh bìa | tạo lại ảnh → `render-bia-hero.ps1` | build + deploy |
| Nội dung ebook | file `.md` | dựng lại PDF |
| Nội dung thư | `MAU_THU` trong `gui-thu-lark.mjs` | lưu file là xong, **không cần deploy** |
| Thiết kế trang | `references/template.html` | ⚠️ đổi file này là **mọi trang sau** đổi theo |

Lệnh deploy lại (dùng hoài):
```powershell
npx --yes wrangler@latest pages deploy site --cwd "<gốc dự án>" `
    --project-name <ten-du-an> --branch main --commit-dirty=true
```

Xem log khi endpoint lỗi:
```powershell
npx --yes wrangler@latest pages deployment tail <deployment-id> --project-name <ten-du-an>
```
