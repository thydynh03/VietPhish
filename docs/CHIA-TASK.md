# Chia việc ngày thi 14/11/2026: mỗi người dán vào agent là chạy

File này là **nguồn duy nhất** để biết mình làm gì, lúc nào, dán câu gì cho agent. Ba người làm hết phần của mình thì toàn bộ dự án xong: mọi file trong bảng "Chưa có, viết trong ngày thi" của `PREBUILT.md` đều có đúng một người làm (mục 6).

Chi tiết từng bước nằm trong `.agent/workflows/`. Lịch gốc ở `NGAY-THI.md`. File này chỉ thêm hai bước mới, **A4** và **A5** (điểm khác biệt so với ChongLuaDao và J2TEAM, xem `KHAC-BIET.md`), và sắp lại thứ tự cho khớp.

## 1. Cách dùng trong 1 phút

1. Mỗi bước mở **một phiên agent mới**. Không làm hai bước trong một phiên.
2. Mở PowerShell ở gốc repo, dán đúng câu lệnh của bước. Câu lệnh nào cũng cùng một khuôn, chỉ đổi tên file bước. Bản đầy đủ cho từng bước có sẵn trong `docs/tasks/`:

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md rồi làm đúng theo .agent/workflows/<TEN-BUOC>.md. Đọc hết file bước trước khi viết dòng code đầu tiên. Chỉ tạo hoặc sửa các file ghi trong mục 'File được sửa'. Chạy các lệnh kiểm tra trong file bước mà agent chạy được và dán output thật. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

   Dùng IDE Antigravity thì mở thư mục repo, tạo cuộc trò chuyện agent mới rồi dán phần trong dấu ngoặc kép.

3. Agent báo xong thì **người** chạy mục "Nghiệm thu" của file bước. Đạt thì commit bằng đúng khối lệnh ở cuối file bước. Không đạt thì xem mục "Khi agent làm sai" của `NGAY-THI.md`.
4. Bước ghi "người làm" thì không giao cho agent. Làm theo checklist ở dưới.

Đường dẫn repo trên mỗi laptop có thể khác nhau. Mỗi người tự `cd` cho đúng.

## 2. Ai sở hữu file nào, lúc nào

Hai người **không bao giờ** sửa cùng một file trong cùng một khoảng giờ. Nhờ vậy `git pull --rebase` luôn tự ghép, không có xung đột.

| File | Người và bước | Khoảng giờ |
| --- | --- | --- |
| `server/**` | B: B1 đến B5 | 07:45–09:25, sửa lỗi tới 10:45 |
| `deploy.env.yaml` (không commit) | B: B6 | 09:25–10:15 |
| `extension/manifest.json` | A: A1, rồi A3 | Nối tiếp |
| `extension/background.js`, `extension/config.js` | A: A2, rồi A5, rồi A3 | Nối tiếp, không bao giờ hai phiên cùng lúc |
| `extension/content.js` | A: A1 (07:45–08:30). **C: A4 (09:20–09:55)**. Sau 09:55 trả lại A để sửa lỗi giao diện | Không chồng giờ |
| `extension/popup.html`, `popup.js`, `demo-cache.json` | A: A3 | 10:00–10:40 |
| `eval/**`, `scripts/**`, `demo-sites/**` | C: C1, C2 | Cả buổi |
| `README.md`, `docs/**` trừ `docs/process/` | C | Cả buổi |
| `docs/process/A-*`, `docs/process/B-*`, `docs/process/C-*` | Mỗi người chỉ ghi file có tiền tố tên mình | Cả buổi |
| `docs/API.md`, `shared/**` | Không ai sửa nếu chưa báo cả đội | |
| Tag `v1.0-demo` | A | 11:20 |

Riêng A4 là ngoại lệ của bảng phân vùng trong `AGENTS.md`: C sửa `extension/content.js`, nhưng chỉ ở bước A4, khi A không đụng file đó.

## 3–5. Việc của từng người

Lịch theo giờ, việc phải chờ ai, và **câu lệnh đầy đủ để dán vào agent cho từng bước** nằm trong file riêng của mỗi người:

| Người | File | Các bước |
| --- | --- | --- |
| A | [`docs/tasks/A.md`](tasks/A.md) | 00, A1, A2, A5, A3, gắn tag |
| B | [`docs/tasks/B.md`](tasks/B.md) | 00, B1, B2, B4, B3, B5, B6 |
| C | [`docs/tasks/C.md`](tasks/C.md) | 00, C1, C3, C2, A4, eval qua API, README, nộp bài |

Yêu cầu sản phẩm và tiêu chí "xong": [`docs/YEU-CAU.md`](YEU-CAU.md).

## 6. Kiểm tra "xong toàn bộ dự án"

Mỗi dòng trong bảng "Chưa có, viết trong ngày thi" của `PREBUILT.md`, cộng hai bước mới, đều có đúng một người:

| Phần | File | Bước | Người |
| --- | --- | --- | --- |
| Whitelist, lý do tiếng Việt | `server/src/official.js`, `server/src/reasons.js` | B1 | B |
| Heuristic tên miền | `server/src/heuristics.js` | B2 | B |
| Gộp điểm, luật cứng | `server/src/fusion.js` | B3 | B |
| Gemini, Safe Browsing | `server/src/vision.js`, `server/src/safebrowsing.js` | B4 | B |
| `/analyze` | `server/src/analyze.js`, `server/src/index.js` | B5 | B |
| Test | `server/test/*.test.js`, `smoke.js`, `try-gemini.js` | B1 đến B5 | B |
| Deploy | Cloud Run, `deploy.env.yaml` | B6 | B |
| Đọc tín hiệu, overlay | `extension/content.js` | A1 | A |
| Luồng kiểm tra, chụp ảnh, huy hiệu | `extension/background.js`, `extension/config.js` | A2 | A |
| **Khóa ô nhập, hỏi lại (K1, K2)** | `extension/content.js` | **A4** | **C** |
| **Lệnh khóa, chế độ cơ bản, bỏ query (K1, K3, K4)** | `extension/background.js` | **A5** | **A** |
| Popup, demo offline | `extension/popup.*`, `extension/demo-cache.json` | A3, tùy chọn | A |
| Script đo | `eval/run_eval.js` | C2 | C |
| Video, README, slide so sánh | `README.md`, file MP4 | C3 | C |
| Bằng chứng quá trình | `docs/process/` | Mọi bước | Mỗi người một tiền tố |
| Tag, nộp bài | `v1.0-demo` | | A gắn tag, C nộp |

Đến 11:20 mà mọi dòng trên đã commit (A3 có thể vắng mặt) thì dự án xong.

## 7. Thứ tự cắt khi trễ

1. A3 (popup). Hết 10:40 chưa đạt thì bỏ.
2. Nửa sau của A4: hộp hỏi lại K2. Giữ khóa gửi K1.
3. Eval qua API. Giữ số eval cục bộ.

**Không cắt:** overlay DANGER, lý do tiếng Việt, A5 (chế độ cơ bản trả lời câu "server sập thì sao"), video.

## 8. Các câu báo nhau qua nhóm Zalo

| Ai báo | Câu | Người chờ |
| --- | --- | --- |
| A | "A1 đã push" | C, để bắt đầu A4 |
| B | "B1 đã push", "B2 đã push" | C, cho C2 |
| B | "B5 đã push" | A, để nghiệm thu A2 |
| B | "URL Cloud Run: …" | A đổi `API_BASE`, C chạy eval qua API |
| C | "A4 đã push" | A, cho bước 4 nghiệm thu A5 |
| Cả 3 | "Đã push xong" lúc 11:20 | A, để gắn tag |
