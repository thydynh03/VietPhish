# Chia việc ngày thi 14/11/2026: mỗi người dán vào agent là chạy

File này là **nguồn duy nhất** để biết mình làm gì, lúc nào, dán câu gì cho agent. Ba người làm hết phần của mình thì toàn bộ dự án xong: mọi file trong bảng "Chưa có, viết trong ngày thi" của `PREBUILT.md` đều có đúng một người làm (mục 6).

Chi tiết từng bước nằm trong `.agent/workflows/`. Lịch gốc ở `NGAY-THI.md`. File này chỉ thêm hai bước mới, **A4** và **A5** (điểm khác biệt so với ChongLuaDao và J2TEAM, xem `KHAC-BIET.md`), và sắp lại thứ tự cho khớp.

## 1. Cách dùng trong 1 phút

1. Mỗi bước mở **một phiên agent mới**. Không làm hai bước trong một phiên.
2. Mở PowerShell ở gốc repo, dán đúng câu lệnh của bước. Câu lệnh nào cũng cùng một khuôn, chỉ đổi tên file bước:

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

## 3. Người A: extension

| Giờ | Bước | Chờ ai trước | Câu lệnh hoặc việc |
| --- | --- | --- | --- |
| 07:30–07:45 | 00, người làm | | Theo `.agent/workflows/00-khoi-dong.md`: `git pull`, Load unpacked `extension/`, console service worker in "hello". Chụp màn hình bắt đầu, lưu `docs/process/A-0730.png` |
| 07:45–08:30 | A1 | | Dán câu lệnh với `a1-content-overlay`. Nghiệm thu bằng `vpSend`, không cần server. Commit, push, **báo C "A1 đã push"** |
| 08:30–09:25 | A2 | | Dán câu lệnh với `a2-background`. Agent xong thì làm mục "Tự kiểm trước khi báo xong" |
| 09:25–09:35 | A2 nghiệm thu | B báo "B5 đã push" | `git pull`, chạy server mock trên máy mình (`$env:VISION_MOCK="1"; node server/src/index.js`), làm bảng nghiệm thu A2. Commit, push |
| 09:35–10:00 | **A5** | A2 đã commit | Dán câu lệnh với `a5-che-do-co-ban`. Bước 4 của nghiệm thu cần A4: nếu C chưa push A4 thì làm bước 1–3, 5–8 trước, `git pull` rồi làm bước 4 sau. Commit, push |
| Khoảng 09:50 | Đổi `API_BASE` | B báo URL Cloud Run | Chen giữa A5: sửa `API_BASE` trong `extension/config.js`, tải lại extension, chạy lại 3 kịch bản. Commit `chore(extension): trỏ API_BASE tới Cloud Run` |
| 10:00–10:40 | A3, tùy chọn | A5 đã commit | Dán câu lệnh với `a3-popup-offline`. 10:40 chưa đạt thì `git checkout -- extension/` bỏ hẳn, không commit dở |
| 10:40–10:45 | Kiểm toàn bộ | | Chạy lại 3 kịch bản và bảng nghiệm thu A5 với Cloud Run |
| 10:45–11:20 | C3, người làm | | Điều khiển máy theo kịch bản quay của C |
| 11:20 | Tag | Cả 3 đã báo push xong | Theo mục "Tag cuối buổi" của `NGAY-THI.md` |

## 4. Người B: server và AI

| Giờ | Bước | Chờ ai trước | Câu lệnh hoặc việc |
| --- | --- | --- | --- |
| 07:30–07:45 | 00, người làm | | `git pull`, `cd server; npm install`, `node src/index.js`, `/health` trả `ok`. Lưu `docs/process/B-0730.png` |
| 07:45–07:55 | B1 | | Dán câu lệnh với `b1-official-reasons`. Đạt: `# pass 22`. Commit, push, **báo C "B1 đã push"** |
| 07:55–08:20 | B2 | | Phiên 1: dán câu lệnh với `b2-heuristics`. Đạt: `# pass 24`. Commit, push, **báo C "B2 đã push"** |
| 07:55–08:45 | B4, song song | B1 đã commit | Phiên 2: dán câu lệnh với `b4-vision-safebrowsing`. Đạt: `# pass 16`. Lượt thử Gemini thật bằng `try-gemini.js` do B chạy. Commit xen giữa B2, B3 |
| 08:20–08:45 | B3 | B2 đã commit | Phiên 1: dán câu lệnh với `b3-fusion`. Đạt: `# pass 15`. Commit, push |
| 08:45–09:25 | B5 | B1 đến B4 đã commit | Dán câu lệnh với `b5-analyze-server`. Đạt: `npm test` ra `# pass 96`, smoke 6/6 `ĐẠT`. Commit, push, **báo A "B5 đã push"** |
| 09:25–09:50 | B6 phần D1–D3, người làm | B5 đã push | Theo `b6-deploy-cloud-run.md`, deploy `VISION_MOCK=1`, `node test/smoke.js $URL` ra 6/6. **Báo A và C URL Cloud Run**. Agent chỉ giúp đọc lỗi, B tự chạy lệnh deploy |
| 09:50–10:15 | B6 phần D4–D6, người làm | | Bật Gemini và Safe Browsing thật, `/health` có `vision: on` |
| 10:15–10:45 | Sửa lỗi | | Chỉ sửa lỗi trong `server/`. Làm nóng server bằng vài request trước 10:45 |
| 10:45–11:20 | C3, người làm | | Đọc lời phần giải pháp |
| 11:20 | Báo push xong | | Kiểm trên GitHub đủ `server/`, báo A |

B không sửa gì ở `extension/`. A4 và A5 không đổi hợp đồng `docs/API.md`, nên server không phải làm thêm gì. Server chỉ dùng hostname và protocol nên URL không còn query vẫn chạy đúng.

## 5. Người C: dữ liệu, đo lường, A4, video

| Giờ | Bước | Chờ ai trước | Câu lệnh hoặc việc |
| --- | --- | --- | --- |
| 07:30–07:45 | 00, người làm | | `git pull`, kiểm tag `pre-event`. **Thử lại ChongLuaDao và J2TEAM** trên bộ trang demo, ghi kết quả cho slide so sánh (mục 2 của `KHAC-BIET.md`). Lưu `docs/process/C-0730.png` |
| 07:45–08:10 | C1, người làm | | Theo `c1-moi-truong-demo.md`: Chrome demo mở được 4 trang demo, extension đã nạp |
| 08:10–08:30 | C3 soạn lời | | Điền lời đọc theo mục 5 của `KHAC-BIET.md` (có cảnh K1, K2, K3) |
| 08:30–08:50 | C2 | B2 đã push | Dán câu lệnh với `c2-eval`. Đạt: `TP 11, FP 0, TN 15, FN 2`. Commit, push |
| 08:50–09:15 | Bản nháp | | Sắp màn hình, slide, lời đọc. Chưa có server thì dùng overlay của A1 bằng `vpSend` |
| 09:15 | CP1 | | Quay bản nháp video lần 1, xuất MP4 |
| 09:20–09:55 | **A4** | A1 đã push | `git pull`, dán câu lệnh với `a4-khoa-o-nhap`. Nghiệm thu bằng `vpSend` trên Chrome demo của C, không cần server. Commit, push, **báo A "A4 đã push"**. Từ giờ không sửa `extension/` nữa |
| 09:55–10:15 | Eval qua API | B báo URL Cloud Run | `node eval/run_eval.js --api <URL>` chạy đủ 3 cấu hình |
| 10:15–10:45 | README, tập đọc | | `README.md` có số đo thật. Đọc lời video có bấm giờ, dưới 2:00 |
| 10:45–11:20 | C3 quay | | Quay theo mục 5 của `KHAC-BIET.md`. Cảnh K1 (chip "đang kiểm tra") quay với Cloud Run có Gemini thật, vì server mock quá nhanh. Cảnh K3: tắt mạng hoặc đổi `API_BASE` sai rồi F5 trang VCB giả |
| 11:20–12:00 | Nộp | A đã gắn tag | Theo mục "Nộp bài" của `NGAY-THI.md` |

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
