/**
 * KHUÔN MẪU — Gửi ebook cho người vừa điền form, bằng LARK MAIL.
 *
 * ĐẶT FILE NÀY Ở: một thư mục trên MÁY BẠN (không phải trong `site/`, không deploy lên đâu cả).
 *
 * Đường đi:
 *   Leadpage → hàm Cloudflare `functions/api/lead.js` → GHI vào Lark Base   [hàm dừng ở đây]
 *                                                              ↓
 *   Máy bạn (đã `lark-cli login`) chạy file này theo lịch → quét bảng
 *                                                              ↓
 *   lark-cli mail +send → hộp thư khách → tích ô "Đã gửi thư" trong bảng
 *
 * ⛔ ĐỪNG đổi sang Resend / Brevo / SMTP để "cho nhanh".
 *    Quyền gửi thư của Lark **chỉ cấp cho token NGƯỜI DÙNG**, mà token đó nằm trên máy này.
 *    Hàm Cloudflare và hosting **không gửi được** — chúng chỉ được phép GHI vào Lark Base.
 *
 * Hệ quả phải chấp nhận: thư KHÔNG tới ngay lập tức mà theo nhịp quét (mặc định 2 phút).
 *    Máy tắt thì thư nằm chờ, **không mất ai** — bật lên là lượt quét kế tiếp gửi bù.
 *    Trang cảm ơn nên nói "trong ít phút", đừng hứa "ngay lập tức".
 *
 * ═══ TÌM CHỮ  ĐỔI:  ĐỂ THẤY MỌI CHỖ CẦN SỬA ═══
 *
 * CHẠY:
 *   node gui-thu-lark.mjs --thu     → chạy thử: dựng thư ra file, KHÔNG gửi, KHÔNG tích ô
 *   node gui-thu-lark.mjs           → gửi thật
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/**
 * BẪY 1 — gọi THẲNG điểm vào JS của lark-cli, đừng gọi qua lớp `.cmd`.
 * Lớp `.cmd` bóp méo tiếng Việt trong tham số dòng lệnh, mà tiêu đề thư thì đầy dấu.
 */
const CLI = path.join(
  process.env.APPDATA || "",
  "npm", "node_modules", "@larksuite", "cli", "scripts", "run.js"
);

/* ══════════════════ ĐỔI: CẤU HÌNH BẢNG ══════════════════ */
// ⚠️ Phải là app_token THẬT, KHÔNG phải token trong link wiki. Lấy bằng:
//   lark-cli api GET /open-apis/bitable/v1/apps/<token-trong-link> --as bot   → data.app.app_token
// Chỗ hiểm: API ĐỌC vẫn nhận node_token nên dò bảng thấy chạy ngon, chỉ API GHI mới chết.
const BASE_TOKEN = "xxxxxxxxxxxxxxxxxxxxxxxxxxx";   // ĐỔI — trùng với LARK_BASE_TOKEN trong lead.js
const TABLE_ID = "tblxxxxxxxxxxxxxx";               // ĐỔI — trùng với LARK_TABLE_ID trong lead.js

// ĐỔI: tên cột trong bảng của bạn. Xem tên cột thật bằng:
//   lark-cli api GET /open-apis/bitable/v1/apps/<app_token>/tables/<table_id>/fields --as bot
const COT_HO_TEN = "Họ và Tên";
const COT_EMAIL = "Email";
const COT_NGUON = "SourceID";
// ⚠️ BẮT BUỘC tạo cột này trong bảng, kiểu **Checkbox**. Không có nó thì mỗi lượt quét
//    gửi lại toàn bộ danh sách — khách nhận thư trùng mỗi 2 phút.
const COT_DA_GUI = "Đã gửi thư";

// ĐỔI: chỉ gửi cho lead đến từ trang này (khớp giá trị hàm lead.js ghi vào cột SourceID).
// Để chuỗi rỗng "" nếu bảng chỉ dùng riêng cho một ebook và muốn gửi cho tất cả.
const LOC_NGUON = "";

/* ══════════════════ ĐỔI: CẤU HÌNH THƯ ══════════════════ */
// ⚠️ Địa chỉ này phải là hộp thư Lark BẠN ĐANG ĐĂNG NHẬP trên máy (`lark-cli login`).
const DIA_CHI_GUI = "ebook@tenmiencuaban.com";                  // ĐỔI
const EBOOK_URL = "https://ebook.tenmiencuaban.com/";           // ĐỔI: nơi khách đọc/tải ebook
const TIEU_DE_THU = "Ebook “<TÊN EBOOK>” đã sẵn sàng rồi đây";  // ĐỔI
const DONG_XEM_TRUOC = "Link đọc ebook ở bên trong, kèm 3 bước áp dụng ngay.";  // ĐỔI
const CHAN_THU_TRANG = "tenmiencuaban.com";                     // ĐỔI
const CHAN_THU_DIA_CHI = "<Tên bạn> — <địa chỉ> · Hotline: <số điện thoại>";  // ĐỔI

/**
 * ĐỔI: NỘI DUNG THƯ — nguồn sự thật DUY NHẤT, chỉ sửa ở đây.
 * Bản HTML sinh ra TỪ chuỗi này nên hai bản không bao giờ lệch nhau.
 * Quy ước: dòng nào chỉ chứa đúng một địa chỉ https:// sẽ thành NÚT bấm.
 * {customer_name} là chỗ thay tên khách.
 *
 * ⚠️ BẪY ĐÃ DÍNH THẬT: thư gửi đi bị **cắt cụt giữa câu** trong khi file trên máy vẫn đầy đủ.
 *    Cách né đã kiểm chứng: tách thành nhiều đoạn ngắn (cách nhau một dòng trống) và
 *    **tránh gạch ngang dài `—` giữa câu**. Xem thư mẫu ở references/thu-mau.md.
 */
const MAU_THU = `Chào {customer_name},

Ebook “<TÊN EBOOK>” đã sẵn sàng rồi đây.

👉 Đọc ebook tại đây:
${EBOOK_URL}

<Một đoạn ngắn nói vì sao đừng áp dụng tất cả cùng lúc, cho khách một
việc duy nhất để làm ngay. Thư dạy được một điều nhỏ thì mở tỉ lệ đọc
thư sau cao hơn hẳn thư chỉ đưa link.>

① <Bước 1>
② <Bước 2>
③ <Bước 3>

👉 Mở ebook tại đây:
${EBOOK_URL}

Thân mến,

<TÊN BẠN>`;

/* ══════════════════ TỪ ĐÂY XUỐNG: KHÔNG CẦN SỬA ══════════════════ */

/**
 * BẪY 2 — `--body-file` chỉ nhận đường dẫn TƯƠNG ĐỐI trong cwd.
 * Đưa đường dẫn tuyệt đối là hỏng. Nên ghi file thân thư vào cwd rồi truyền đúng tên file.
 */
const FILE_THAN_THU = "than-thu.html";
const FILE_LOG = path.join(HERE, "nhat-ky-gui-thu.log");
const CHI_THU = process.argv.includes("--thu");

function ghiLog(dong) {
  const t = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const s = `[${t}] ${dong}`;
  console.log(s);
  try { fs.appendFileSync(FILE_LOG, s + "\n", "utf8"); } catch { /* log hỏng không được giết việc gửi */ }
}

function lark(args) {
  const out = execFileSync(process.execPath, [CLI, ...args], {
    encoding: "utf8", maxBuffer: 32 * 1024 * 1024, cwd: HERE,
  });
  const j = JSON.parse(out);
  if (j.ok === false) throw new Error(JSON.stringify(j.error || j).slice(0, 400));
  return j;
}

/**
 * Khách gõ toàn thường ("nguyen van an") hoặc toàn hoa thì chuẩn lại hoa đầu mỗi từ —
 * thư chào "Chào nguyen van an," trông như thư rác. Tên đã có hoa lẫn thường
 * (kể cả "TS. Nguyễn An") thì TÔN TRỌNG nguyên bản.
 */
function tenDep(hoTen) {
  const t = String(hoTen || "").replace(/\s+/g, " ").trim();
  if (!t) return "bạn";
  const thap = t.toLocaleLowerCase("vi");
  const cao = t.toLocaleUpperCase("vi");
  if (t !== thap && t !== cao) return t;
  return thap.split(" ").map(w => (w ? w[0].toLocaleUpperCase("vi") + w.slice(1) : w)).join(" ");
}

// Tên khách đi vào HTML → phải chặn thẻ, kẻo một cái tên chứa "<script>" là thư bị méo.
const escHtml = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Dựng thân thư HTML từ bản chữ trơn. Dòng chỉ có một https:// → nút bấm to. */
function thanhHtml(text) {
  const P = "margin:0 0 18px;font-size:16px;line-height:1.7;color:#222";
  const linkify = (s) => s.replace(/(https?:\/\/[^\s<]+)/g,
    '<a href="$1" style="color:#C7170C;text-decoration:underline">$1</a>');
  const out = [];
  for (const doan of text.split(/\n\s*\n/)) {
    let cho = [];
    const xa = () => { if (cho.length) { out.push(`<p style="${P}">${cho.join("<br>")}</p>`); cho = []; } };
    for (const dong of doan.split("\n")) {
      const d = dong.trim();
      if (/^https?:\/\/\S+$/.test(d)) {
        xa();
        out.push(
          `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 26px">` +
          `<tr><td align="center" bgcolor="#C7170C" style="border-radius:8px">` +
          `<a href="${escHtml(d)}" style="display:inline-block;padding:15px 30px;font-family:Arial,Helvetica,sans-serif;` +
          `font-size:17px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:8px">` +
          `ĐỌC EBOOK NGAY</a></td></tr></table>`
        );
      } else {
        cho.push(linkify(escHtml(d)));
      }
    }
    xa();
  }
  return out.join("\n");
}

function soanThu(hoTen) {
  const ten = tenDep(hoTen);
  const text = MAU_THU.split("{customer_name}").join(ten);
  const html = `<!doctype html>
<html lang="vi"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escHtml(TIEU_DE_THU)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escHtml(DONG_XEM_TRUOC)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5">
<tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
         style="width:100%;max-width:600px;background:#ffffff;border-radius:12px">
    <tr><td style="padding:32px 28px 8px;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif">
${thanhHtml(text)}
    </td></tr>
    <tr><td style="padding:8px 28px 30px">
      <hr style="border:0;border-top:1px solid #e6e6e8;margin:0 0 14px">
      <p style="margin:0;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;font-size:12px;line-height:1.6;color:#8a8a8f">
        Bạn nhận được thư này vì đã để lại thông tin tại
        <a href="https://${escHtml(CHAN_THU_TRANG)}/" style="color:#8a8a8f">${escHtml(CHAN_THU_TRANG)}</a>
        để nhận ebook.<br>${escHtml(CHAN_THU_DIA_CHI)}
      </p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
  return { text, html };
}

/**
 * BẪY 3 — `base +record-list` trả DẠNG CỘT, không phải dạng hàng:
 *   data.fields = mảng TÊN CỘT · data.data = mảng HÀNG (mỗi hàng là mảng giá trị khớp thứ tự)
 *   data.record_id_list = ID nằm RIÊNG.
 * Đọc kiểu `item.fields["Email"]` sẽ LUÔN rỗng và script lặng lẽ báo "không có ai"
 * trong khi người vẫn nằm trong bảng.
 */
function layNguoiChuaGui() {
  const j = lark([
    "base", "+record-list",
    "--base-token", BASE_TOKEN, "--table-id", TABLE_ID,
    "--page-size", "200", "--format", "json",
  ]);
  const d = j.data || {};
  const cot = d.fields || [];
  const hang = d.data || [];
  const ids = d.record_id_list || [];
  const iOf = (ten) => cot.indexOf(ten);

  const iTen = iOf(COT_HO_TEN);
  const iEmail = iOf(COT_EMAIL);
  const iGui = iOf(COT_DA_GUI);
  const iNguon = iOf(COT_NGUON);

  if (iEmail < 0) {
    throw new Error(`Bảng thiếu cột "${COT_EMAIL}". Cột đang có: ${cot.join(", ")}`);
  }
  if (iGui < 0) {
    throw new Error(
      `Chưa có cột "${COT_DA_GUI}" (kiểu Checkbox) — tạo trước, ` +
      `nếu không mỗi lượt quét sẽ gửi trùng cho toàn bộ danh sách.`
    );
  }

  const ra = [];
  hang.forEach((r, k) => {
    const email = String(r[iEmail] || "").trim();
    if (!email || r[iGui] === true) return;
    if (LOC_NGUON && iNguon >= 0 && !String(r[iNguon] ?? "").includes(LOC_NGUON)) return;
    ra.push({ recordId: ids[k], ten: String(iTen >= 0 ? r[iTen] || "" : ""), email });
  });
  return ra;
}

function gui(nguoi) {
  const thu = soanThu(nguoi.ten);
  fs.writeFileSync(path.join(HERE, FILE_THAN_THU), thu.html, "utf8");

  if (CHI_THU) {
    ghiLog(`[CHẠY THỬ] ${nguoi.email} — đã dựng ${FILE_THAN_THU}, KHÔNG gửi, KHÔNG tích ô.`);
    return;
  }

  lark([
    "mail", "+send",
    "--from", DIA_CHI_GUI,
    "--to", nguoi.email,
    "--subject", TIEU_DE_THU,
    "--body-file", FILE_THAN_THU,
    "--confirm-send",
  ]);

  // Tích ô NGAY sau khi gửi. Bước này hỏng thì lượt sau gửi trùng —
  // nên để nó ném lỗi ra ngoài cho thấy, đừng nuốt.
  lark([
    "base", "+record-upsert",
    "--base-token", BASE_TOKEN, "--table-id", TABLE_ID,
    "--record-id", nguoi.recordId,
    "--json", JSON.stringify({ [COT_DA_GUI]: true }),
  ]);

  ghiLog(`ĐÃ GỬI → ${nguoi.email}`);
}

function main() {
  let ds;
  try {
    ds = layNguoiChuaGui();
  } catch (e) {
    ghiLog(`LỖI đọc bảng: ${String(e.message).slice(0, 300)}`);
    process.exit(1);
  }

  if (!ds.length) { ghiLog("Không có ai chờ gửi thư."); return; }

  ghiLog(`Có ${ds.length} người chờ gửi thư.`);
  let ok = 0, loi = 0;
  for (const n of ds) {
    try { gui(n); ok++; }
    catch (e) { loi++; ghiLog(`LỖI gửi cho ${n.email}: ${String(e.message).slice(0, 300)}`); }
  }
  ghiLog(`Xong: ${ok} gửi được, ${loi} lỗi.`);
  if (loi) process.exit(1);
}

main();
