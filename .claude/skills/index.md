# Danh mục Skill — Bộ Não Thứ 2 (chuẩn Gia Cát Duẩn)

24 kỹ năng marketing, bán hàng & vận hành. Trong Claude Code gõ `/` để chọn, hoặc gõ `/tên-skill`.
Mỗi skill được "grounded" từ kiến thức của các chuyên gia gốc trong lĩnh vực đó.

## 🎯 Marketing — Khách hàng & Nội dung
| Skill | Công dụng | Cần khóa? |
|---|---|---|
| `GCD-mkt-chan-dung-dau-suong` | Dựng chân dung khách + bản đồ nỗi đau ↔ sung sướng, xếp hạng, gom cụm nội dung | Không |
| `GCD-mkt-research-thi-truong` | Nghiên cứu thị trường & đối thủ 360° bằng tìm kiếm web thật | Không |
| `GCD-mkt-validate-ngach` | Đo cầu thật của ngách + chấm Niche Score 100 (7 chiều) → go/no-go | Không |
| `GCD-mkt-phan-tich-doi-thu` | Phân tích đối thủ chuyên sâu | Không |
| `GCD-mkt-research-youtube` | Tìm video YouTube viral theo chủ đề, lọc theo view/sub thật | `YOUTUBE_API_KEY` |

## ✍️ Marketing — Viết & Trang bán
| Skill | Công dụng | Cần khóa? |
|---|---|---|
| `GCD-mkt-hook-video` | Viết hook "chống lướt" cho video ngắn / tiêu đề | Không |
| `GCD-mkt-lead-magnet` | Tạo ≥20 ý tưởng mồi câu + outline chi tiết | Không |
| `GCD-mkt-leadpage` | Viết trọn landing page thu lead (16 bước) | Không |
| `GCD-mkt-leadpage-ebook-tron-goi` | Trọn phễu tặng ebook: copy → bìa → trang → Cloudflare + tên miền → lead vào Lark Base → thư tự gửi bằng Lark Mail | Cloudflare + Lark |
| `GCD-mkt-ladipage` | Viết trang bán hàng chuẩn "trang WIN" 12 khối | Không |
| `GCD-mkt-web-dich-vu` | Dựng nội dung website ngành dịch vụ chuẩn chuyển đổi | Không |

## 🎨 Marketing — Sản phẩm nội dung
| Skill | Công dụng | Cần khóa? |
|---|---|---|
| `GCD-mkt-content-da-kenh` | Chiến lược & template content đa nền tảng (FB/IG/TikTok/YouTube) | Không |
| `GCD-mkt-content-30-ngay` | Lịch content 30 ngày | Không |
| `GCD-mkt-infographic-html` | Tự thiết kế infographic HTML → xuất ảnh PNG nét cao | Không |
| `GCD-mkt-ebook-sach-lat` | Chủ đề → ebook có thương hiệu → PDF → (tùy chọn) sách lật | `HEYZINE_*` (tùy chọn) |

## 💰 Sale — Mô hình & Bán hàng
| Skill | Công dụng | Cần khóa? |
|---|---|---|
| `GCD-sale-business-model-canvas` | Coach Business Model Canvas 9 ô (Osterwalder) — bản nhanh, ghi Lark + ảnh PNG | Không* |
| `GCD-sale-bmc-phong-van-chi-tiet` | BMC bản sâu: phỏng vấn 9 ô → bộ tài liệu + sơ đồ `.canvas` + trang từng phân khúc/giá trị + đánh giá | Không |
| `GCD-sale-dinh-gia-offer` | Định giá & đóng gói offer (Value Equation — Hormozi) | Không* |
| `GCD-sale-ke-hoach-loi-nhuan` | Kế hoạch lợi nhuận 9 bước CEO (điểm hòa vốn CVP) | Không* |
| `GCD-sale-muc-tieu-tai-chinh` | Đặt mục tiêu tài chính | Không* |
| `GCD-sale-pheu-ltv` | Phễu & giá trị vòng đời khách (LTV) | Không |
| `GCD-sale-xu-ly-tu-choi` | Kịch bản xử lý từ chối khi bán | Không |

## 🛠️ Meta
| Skill | Công dụng | Cần khóa? |
|---|---|---|
| `GCD-AIOS-tao-skill` | Chuẩn & khuôn mẫu để tự tạo skill mới cho hệ thống | Không |
| `GCD-AIOS-hoan-tat-ho-so-doanh-nghiep` | Audit & điền nốt hồ sơ doanh nghiệp trong `wiki/` (định vị, ICP, brand voice, CEO, sản phẩm) | Không |

> `*` Skill sale vẫn chạy và lưu kết quả ở `output/` mà không cần gì. Chỉ khi muốn lưu kế hoạch thẳng vào **Lark Base** mới cần `LARK_BASE_TOKEN` + công cụ `lark-cli` (nâng cao, không bắt buộc).
