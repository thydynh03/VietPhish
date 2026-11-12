# VietPhish Lens

Tiện ích Chrome cảnh báo trang giả mạo ngân hàng và cơ quan nhà nước Việt Nam, kể cả trang mới tạo vài giờ chưa có trong danh sách đen nào. Ý tưởng cốt lõi: trang **trông giống** thương hiệu X, **tên miền không thuộc** X, và **đòi** mật khẩu, OTP hay số thẻ, thì gần như chắc chắn là lừa đảo.

Bài thi Mini Hackathon GDG DevFest MienTrung 2026, đội 3 người.

## Trạng thái hiện tại

**Trước 07:30 ngày 14/11/2026, repo này chỉ là khung rỗng.** Server chỉ có `GET /health`, extension chỉ in "hello". Repo chứa dữ liệu, trang demo, hợp đồng API và đặc tả từng bước để giao cho agent. Toàn bộ logic phát hiện, giao diện cảnh báo và script đo được viết trong giờ thi.

Danh sách đầy đủ những gì làm trước nằm ở [`docs/PREBUILT.md`](docs/PREBUILT.md). Mốc phân ranh là tag `pre-event`:

```powershell
git log pre-event..HEAD --oneline    # commit viết trong ngày thi
```

## Kiến trúc 4 lớp

1. **Whitelist:** tên miền chính thức của ngân hàng, ví điện tử và mọi tên miền `.gov.vn`. Trùng thì kết luận an toàn, không gửi gì đi.
2. **Google Safe Browsing:** trang đã bị báo cáo thì chặn ngay.
3. **Heuristic tên miền:** punycode, tên gần giống tên chính thức, subdomain đánh lừa, đuôi rủi ro, form gửi sang máy chủ khác.
4. **Gemini nhìn ảnh chụp trang:** nhận diện trang trông giống thương hiệu nào và có đòi dữ liệu nhạy cảm không. Việc so thương hiệu với tên miền do code làm, không giao cho mô hình.

Ba lớp sau chạy song song. Server gộp thành điểm 0 đến 100 và trả lý do bằng tiếng Việt. Extension hiện huy hiệu xanh (SAFE), banner vàng (SUSPICIOUS) hoặc phủ đỏ toàn trang (DANGER). Ảnh chụp chỉ được gửi khi trang không thuộc whitelist và có ô nhập nhạy cảm hoặc tên miền chứa tên thương hiệu.

## Công nghệ Google

| Công nghệ | Dùng để |
| --- | --- |
| Gemini API | Nhận diện thương hiệu từ ảnh chụp trang, đầu ra JSON theo schema |
| Google Cloud Run | Chạy server `/analyze` |
| Safe Browsing API v4 | Lớp danh sách đen |
| Antigravity | Agent viết code trong ngày thi theo đặc tả ở `.agent/workflows/` |

## Cấu trúc thư mục

```text
extension/    Chrome MV3, JavaScript thuần, không có bước build; official_domains.json là bản sao whitelist
server/       Node.js, GET /health và POST /analyze; data/ chứa bản sao whitelist, test/vectors/ chứa bảng kết quả mong đợi
shared/       official_domains.json (16 thương hiệu), nguồn gốc của whitelist
eval/         domains.csv (28 URL có nhãn) và script đo
demo-sites/   3 trang demo tĩnh có watermark và serve.js, chạy local trên 4 tên miền giả ở cổng 8080
scripts/      chrome-demo.ps1 mở Chrome riêng cho demo
docs/         KE-HOACH.md, API.md, NGAY-THI.md, PREBUILT.md, DEBUG-CHROME.md
.agent/       workflows/: đặc tả từng bước cho agent (00, A1 đến A3, B1 đến B6, C1 đến C3)
AGENTS.md     quy tắc chung cho agent làm việc trong repo
```

## Cách chạy

Cần Node 22 trở lên và PowerShell 7 (`pwsh`).

```powershell
cd server
npm install
cd ..
node server/src/index.js          # server ở cổng 8787
node demo-sites/serve.js          # trang demo ở cổng 8080, chạy ở tab khác
pwsh -File scripts\chrome-demo.ps1
```

Trong Chrome vừa mở: bật Developer mode, bấm Load unpacked, chọn thư mục `extension`. Sau đó mở `http://vietcombank-xacthuc.top:8080/`.

Server đọc key từ biến môi trường `GEMINI_API_KEY` và `SAFE_BROWSING_KEY`. Key không bao giờ nằm trong repo hay trong extension.

Trang demo do đội tự dựng, có watermark, form không gửi đi đâu, và chỉ chạy trên máy local. Đội không truy cập hay phát tán trang lừa đảo thật.

## Kết quả đo

Điền trong ngày thi.

| Cấu hình | TP | FP | TN | FN | Precision | Recall | Báo nhầm |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [...] | | | | | | | |

Cỡ mẫu: [...]. Hạn chế: bộ mẫu nhỏ, phần trang giả do đội tự đặt tên.

## Video demo

Điền trong ngày thi: [link video].

URL Cloud Run: [điền trong ngày thi].
