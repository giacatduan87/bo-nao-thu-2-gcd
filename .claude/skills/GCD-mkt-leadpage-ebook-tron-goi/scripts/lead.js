/**
 * KHUÔN MẪU — Cloudflare Pages Function nhận lead từ leadpage và GHI vào Lark Base.
 * Hàm này KHÔNG gửi thư. Thư do `scripts/gui-thu-lark.mjs` chạy trên MÁY BẠN gửi.
 *
 * ĐẶT FILE NÀY Ở:  <gốc dự án>/functions/api/lead.js
 * ⚠️ KHÔNG đặt trong `site/`. Wrangler tìm `functions/` ở GỐC dự án, cạnh `site/`.
 *    Đặt sai chỗ thì nó IM LẶNG bỏ qua: không báo lỗi, chỉ thiếu dòng
 *    "Compiled Worker successfully", và /api/lead trả về index.html thay vì JSON.
 *
 * ═══ TÌM CHỮ  ĐỔI:  ĐỂ THẤY MỌI CHỖ CẦN SỬA ═══
 *
 * VÌ SAO PHẢI CÓ FILE NÀY (đừng gỡ đi rồi trỏ form thẳng vào API Lark):
 *   1. Cùng tên miền với trang → trình duyệt KHÔNG gửi preflight CORS.
 *      Trỏ thẳng sang open.larksuite.com là dính CORS, mọi lead rơi vào .catch().
 *   2. app_secret nằm ở biến môi trường phía máy chủ. Nhét vào JavaScript của trang
 *      thì ai xem mã nguồn cũng lấy được toàn quyền Base.
 *
 * ═══ VÌ SAO HÀM NÀY KHÔNG GỬI THƯ ═══
 *   Thư đi bằng LARK MAIL. Quyền gửi thư của Lark **chỉ cấp cho token NGƯỜI DÙNG**,
 *   mà token đó nằm trên máy đã chạy `lark-cli login`. Hàm Cloudflare và hosting
 *   **không gửi được** — chúng chỉ được phép GHI vào Lark Base.
 *
 *   ⛔ ĐỪNG "sửa" bằng cách gọi Resend / Brevo / SMTP từ đây. Đó là đi chệch khỏi
 *      hộp thư thương hiệu, và với tên miền đặt SPF `-all` thì thư sẽ bị chặn thẳng.
 *
 *   Đường đi đúng:
 *      form → hàm này → Lark Base → (máy bạn) gui-thu-lark.mjs → lark-cli mail +send
 *
 *   Hệ quả: ghi Base hỏng thì TRẢ LỖI để khách bấm lại (chưa ai gửi gì nên không trùng thư).
 *
 * BIẾN MÔI TRƯỜNG (đặt bằng: npx wrangler pages secret put <TÊN> --project-name <dự-án>)
 *   LARK_APP_SECRET  — BẮT BUỘC, bí mật.
 *   LARK_APP_ID      — tuỳ chọn, mặc định dùng hằng số dưới đây.
 *   LARK_BASE_TOKEN  — tuỳ chọn, ghi đè hằng số (tiện khi đổi Base mà khỏi sửa mã).
 *   LARK_TABLE_ID    — tuỳ chọn, ghi đè hằng số.
 *   (KHÔNG có khoá nhà gửi thư nào ở đây — hàm này không gửi thư.)
 */

/* ══════════════════ ĐỔI: CẤU HÌNH LARK ══════════════════ */
// Lark quốc tế (tên miền *.larksuite.com) dùng open.larksuite.com.
// Feishu Trung Quốc thì đổi thành https://open.feishu.cn
const LARK_HOST = "https://open.larksuite.com";
const DEFAULT_APP_ID = "cli_xxxxxxxxxxxxxxxx";      // ĐỔI: App ID trong Lark Developer Console
// ⚠️ Đây phải là app_token THẬT, KHÔNG phải token trong link wiki.
//    Link Base copy từ Lark thường là .../wiki/<node_token>?table=tbl...
//    node_token KHÔNG dùng ghi được. Lấy app_token thật bằng:
//      lark-cli api GET /open-apis/bitable/v1/apps/<token-trong-link> --as bot
//    rồi lấy data.app.app_token.
//    Chỗ hiểm: API ĐỌC vẫn nhận node_token nên dò bảng thấy chạy ngon, chỉ API GHI mới chết.
const BASE_TOKEN_MAC_DINH = "xxxxxxxxxxxxxxxxxxxxxxxxxxx";  // ĐỔI
const TABLE_ID_MAC_DINH = "tblxxxxxxxxxxxxxx";              // ĐỔI

// ĐỔI: tên cột trong bảng Lark của bạn. Chạy lệnh này để xem tên cột thật:
//   lark-cli api GET /open-apis/bitable/v1/apps/<app_token>/tables/<table_id>/fields --as bot
// ⚠️ ĐỪNG ghi vào cột kiểu CreatedTime (Lark tự điền), Lookup, Button, User — sẽ lỗi.
const COT = {
  ho_ten: "Họ và Tên",
  so_dien_thoai: "Số điện thoại",
  email: "Email",
  nguon: "SourceID",
};

/* ══════════════════ TỪ ĐÂY XUỐNG: KHÔNG CẦN SỬA ══════════════════ */

// Số điện thoại Việt Nam — giữ khớp với bản kiểm tra ở trình duyệt.
// Kiểm lại ở máy chủ vì dữ liệu từ trình duyệt không bao giờ đáng tin.
const PHONE_RE = /^(\+84|84|0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-46-9])[0-9]{7}$/;

// Chặn dấu phẩy/chấm phẩy/ngoặc nhọn và mọi khoảng trắng (\s gồm cả \r \n).
// Không phải để bắt lỗi chính tả, mà để không ai nhét được người nhận thứ hai vào thư.
const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>.]+(\.[^\s@,;<>.]+)+$/;

/**
 * Làm sạch secret trước khi dùng.
 * Dán vào cửa sổ cmd bằng Ctrl+V thì Windows chèn ký tự điều khiển 0x16 (SYN) vào đầu
 * chuỗi — mắt thường không thấy, Lark trả "10014 app secret invalid" và không ai hiểu
 * vì sao. Dấu hiệu: độ dài 33 thay vì 32. Lọc mọi ký tự điều khiển + khoảng trắng thừa.
 */
const sachSecret = (s) =>
  Array.from(String(s || "")).filter(c => c.charCodeAt(0) > 31 && c.charCodeAt(0) !== 127).join("").trim();

// tenant_access_token sống 2 tiếng. Giữ trong bộ nhớ isolate để đỡ gọi lại mỗi lead.
let tokenCache = { value: null, expiresAt: 0 };

async function tenantToken(appId, appSecret) {
  const now = Date.now();
  if (tokenCache.value && now < tokenCache.expiresAt) return tokenCache.value;
  const r = await fetch(`${LARK_HOST}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const j = await r.json();
  if (j.code !== 0 || !j.tenant_access_token) {
    throw new Error(`lay tenant_access_token that bai: code=${j.code} msg=${j.msg}`);
  }
  tokenCache = { value: j.tenant_access_token, expiresAt: now + (j.expire - 300) * 1000 };
  return tokenCache.value;
}

function utmTu(urlStr) {
  const out = {};
  try {
    const p = new URL(urlStr).searchParams;
    for (const k of ["utm_source", "utm_medium", "utm_content", "utm_term"]) {
      const v = p.get(k);
      if (v) out[k] = v.slice(0, 200);
    }
  } catch (_) { /* url hỏng thì bỏ qua, không được để chết cả lead */ }
  return out;
}

/* ─────────── NHẬN LEAD ─────────── */

export async function onRequestPost({ request, env }) {
  const ok = (b) => new Response(JSON.stringify(b), {
    status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } });
  const fail = (s, m) => new Response(JSON.stringify({ ok: false, error: m }), {
    status: s, headers: { "Content-Type": "application/json; charset=utf-8" } });

  let d;
  try { d = await request.json(); } catch (_) { return fail(400, "body khong phai JSON"); }

  // Bẫy bot: trường ẩn "website" có chữ nghĩa là bot điền. Trả 200 để nó không thử lại.
  if (d.website) return ok({ ok: true });

  const hoTen = String(d.full_name || "").trim().slice(0, 200);
  const sdt = String(d.phone_number || "").replace(/[\s.\-()]/g, "");
  const email = String(d.email || "").trim().slice(0, 200);

  if (!hoTen) return fail(400, "thieu ho ten");
  if (!PHONE_RE.test(sdt)) return fail(400, "so dien thoai khong hop le");
  // Email BẮT BUỘC vì ebook giao bằng thư. Không có email = khách ra về tay trắng.
  // (Bỏ dòng này nếu bạn giao ebook bằng cách chuyển thẳng sang trang tải.)
  if (!EMAIL_RE.test(email)) return fail(400, "email khong hop le");

  const appSecret = sachSecret(env.LARK_APP_SECRET);
  if (!appSecret) {
    console.error("THIEU LARK_APP_SECRET — lead khong duoc luu!");
    return fail(500, "server chua cau hinh");
  }
  const appId = env.LARK_APP_ID || DEFAULT_APP_ID;
  const baseToken = env.LARK_BASE_TOKEN || BASE_TOKEN_MAC_DINH;
  const tableId = env.LARK_TABLE_ID || TABLE_ID_MAC_DINH;

  const fields = {
    [COT.ho_ten]: hoTen,
    [COT.so_dien_thoai]: sdt,
    [COT.email]: email,
    [COT.nguon]: String(d.page || "").slice(0, 100),
    utm_source: "leadpage",
    ...utmTu(d.url || ""),
  };

  let recordId;
  try {
    const token = await tenantToken(appId, appSecret);
    const ghi = (t) => fetch(
      `${LARK_HOST}/open-apis/bitable/v1/apps/${baseToken}/tables/${tableId}/records`,
      { method: "POST",
        headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ fields }) }
    ).then(r => r.json());

    let j = await ghi(token);
    if (j.code === 99991663 || j.code === 99991661) {
      tokenCache = { value: null, expiresAt: 0 };          // token chết sớm → thử lại đúng 1 lần
      j = await ghi(await tenantToken(appId, appSecret));
      if (j.code !== 0) throw new Error(`Lark tu choi lan 2: code=${j.code} msg=${j.msg}`);
    } else if (j.code !== 0) {
      throw new Error(`Lark tu choi: code=${j.code} msg=${j.msg}`);
    }
    recordId = j.data?.record?.record_id;
  } catch (e) {
    console.error("Ghi lead that bai:", e.message, "| du lieu:", JSON.stringify(fields));
    // Không trả lý do thật ra ngoài — chỉ ghi log.
    // Xem log: npx wrangler pages deployment tail <deployment-id> --project-name <dự-án>
    return fail(502, "khong luu duoc, vui long thu lai");
  }

  // Lead đã an toàn trong Base. Việc gửi ebook KHÔNG xảy ra ở đây —
  // xem khối "VÌ SAO HÀM NÀY KHÔNG GỬI THƯ" ở đầu file.
  console.log("Da ghi lead:", email, "| record:", recordId);

  return ok({ ok: true, record_id: recordId });
}

/** GET để tự kiểm tra: endpoint sống chưa, secret có chưa — KHÔNG lộ giá trị secret. */
export async function onRequestGet({ env }) {
  return new Response(JSON.stringify({
    ok: true,
    endpoint: "/api/lead",
    nhan: "POST",
    da_co_secret: Boolean(env.LARK_APP_SECRET),
    base: env.LARK_BASE_TOKEN || BASE_TOKEN_MAC_DINH,
    table: env.LARK_TABLE_ID || TABLE_ID_MAC_DINH,
    gui_thu: "KHONG — thu do script gui-thu-lark.mjs tren may ban gui bang Lark Mail",
  }, null, 2), { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } });
}
