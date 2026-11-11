# VietPhish Lens: PoC

> ⚠️ **Không mang code này vào ngày thi.** Đây là bản kiểm chứng ý tưởng và tài liệu học cho nhóm. Logic lõi (heuristic, Gemini, chấm điểm, extension) phải được viết lại trong ngày 14/11 bằng Antigravity, nếu không sẽ vượt giới hạn 30% làm trước và mất quyền nhận giải.

## Có gì trong này

| Thư mục | Nội dung |
|---|---|
| `shared/official_domains.json` | Whitelist 16 thương hiệu (ngân hàng, ví, cơ quan nhà nước) + mọi domain `.gov.vn` |
| `server/` | `POST /analyze`: whitelist → Safe Browsing → heuristic tên miền → Gemini Vision → điểm 0–100 + lý do tiếng Việt |
| `extension/` | Chrome MV3: chụp màn hình khi cần, gọi server, vẽ cảnh báo trong Shadow DOM |
| `demo-sites/` | 2 trang giả có watermark (Vietcombank đăng nhập, VNeID OTP), chỉ chạy local |
| `eval/` | 28 URL có nhãn, đo precision/recall/tỷ lệ báo nhầm của heuristic |

## Chạy thử

```bash
npm install
npm run eval
```

### Server

Không cần API key (Gemini giả lập: đoán thương hiệu từ tiêu đề trang):

```bash
VISION_MOCK=1 npm run server
```

Với Gemini thật và Safe Browsing (PowerShell: `$env:GEMINI_API_KEY="..."`):

```bash
GEMINI_API_KEY=... SAFE_BROWSING_KEY=... GEMINI_MODEL=gemini-3.5-flash-lite npm run server
```

### Trang demo + Chrome

```bash
npm run demo-sites
```

Mở một Chrome riêng, trỏ 2 tên miền giả về máy mình (không cần sửa file hosts, không cần quyền admin):

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="%TEMP%\vietphish-profile" --host-resolver-rules="MAP vietcombank-xacthuc.top 127.0.0.1, MAP vneid-capnhat.cc 127.0.0.1"
```

Trong Chrome đó: `chrome://extensions` → bật Developer mode → **Load unpacked** → chọn thư mục `extension/`. Rồi mở:

- `https://vietcombank.com.vn` → huy hiệu ✓ xanh, không gửi gì lên server
- `http://vietcombank-xacthuc.top:8080` → phủ đỏ toàn trang
- `http://vneid-capnhat.cc:8080` → phủ đỏ, lý do OTP + VNeID

Sửa `shared/official_domains.json` thì chạy `npm run sync-domains` để chép sang extension.

## Kết quả đã chạy (10/10/2026, chế độ Gemini giả lập)

Báo cáo đầy đủ kèm ảnh chụp: `../BaoCao_KiemThu_VietPhish_PoC.docx`. Ảnh và kết quả thô nằm trong `report/`. Extension đã được kiểm thử end-to-end trong Chrome for Testing: 4/4 trang demo cho kết quả đúng, cảnh báo hiện sau 0,4–0,9 giây.

| Kịch bản | Kết quả |
|---|---|
| vietcombank.com.vn | SAFE 0 (whitelist) |
| VCB giả, chỉ heuristic | SUSPICIOUS 60 |
| VCB giả, đầy đủ | DANGER 100 |
| VNeID giả đòi OTP | DANGER 100 |
| Bài báo nhắc Vietcombank (không có ô nhập) | SAFE 19 |
| Tên miền trung lập `xacthuc-taikhoan.com` giả giao diện VCB, có ô mật khẩu | DANGER 85 (chỉ lớp nhìn ảnh bắt được) |

Heuristic tên miền trên 28 URL: precision 100%, recall 84,6%, báo nhầm 0%. Bỏ sót 2 trang không có tên thương hiệu trong domain; đây chính là phần Gemini Vision phải bù.

**Hạn chế của số liệu này:** bộ URL nhỏ, do PoC tự tạo, và trọng số được chỉnh trên chính bộ này. Số liệu dùng để pitch phải đo trên PhishVN và bộ ảnh có nhãn, tách dev/test.

## Chưa kiểm chứng

- **Gọi Gemini thật:** chưa chạy vì chưa có API key. Code dùng REST `generateContent` với `responseSchema`; docs mới của Google chuyển sang Interactions API, nếu REST cũ báo lỗi thì chỉ cần sửa hàm `vision()` trong `server/pipeline.js`.
- **Extension trên trang ngân hàng thật:** vietcombank.com.vn từ chối trình duyệt tự động nên chưa quan sát được.
- **Safe Browsing:** chưa chạy vì chưa có key.

## Bài học cho ngày thi

1. Trọng số theo kế hoạch ban đầu (25/20/10) quá thấp: heuristic đứng một mình bắt được 0/13 trang giả. Phải chỉnh trên tập dev.
2. Không được đoán "đòi mật khẩu" từ hình ảnh hay tiêu đề khi trang không có ô nhập; nếu không, bài báo nhắc tên ngân hàng sẽ bị báo nhầm. Tín hiệu từ content script (có ô password/OTP thật) quan trọng hơn.
3. Mỗi thương hiệu chỉ cộng điểm "tên miền nhái" một lần (Techcombank có 2 domain chính thức nên từng bị cộng đôi).
4. Trang chỉ "trông giống" thương hiệu mà không đòi dữ liệu nhạy cảm thì cộng tối đa 10 điểm; nếu không, bài báo chạy HTTP bị SUSPICIOUS.
5. Lý do quan trọng nhất (sai tên miền, đòi OTP/mật khẩu) phải đứng đầu, vì overlay chỉ hiện 4 lý do.
6. Chrome bản thường từ 137 không cho nạp extension bằng dòng lệnh; dùng Chrome for Testing để tự động hóa demo/test.
