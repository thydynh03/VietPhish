# Người C: dữ liệu, đo lường, A4, video, nộp bài

**Sở hữu:** `eval/`, `scripts/`, `demo-sites/`, `docs/`, `README.md`. Ngoại lệ duy nhất: `extension/content.js` trong bước A4, khung 09:20–09:55.

**Đọc trước khi bắt đầu:** `docs/YEU-CAU.md`, `AGENTS.md`, `.agent/skills/vietphish/SKILL.md`, `docs/KHAC-BIET.md` (lời video và slide so sánh).

**Các bước của bạn, theo thứ tự:** 00 → C1 → C3 soạn lời → C2 → bản nháp video → **A4** → eval qua API → README → C3 quay → nộp. Lịch chung ở `docs/CHIA-TASK.md`.

## Cách giao một bước cho agent

Chỉ C2 và A4 giao cho agent. Mỗi bước mở **một phiên agent mới**, PowerShell ở gốc repo, dán đúng khối lệnh. Agent báo xong thì **bạn** chạy mục "Nghiệm thu" trong file bước. Đạt thì commit bằng khối lệnh ở cuối file bước. 00, C1, C3 là việc người làm.

## Lịch và câu lệnh

| Giờ | Bước | Chờ ai | Xong khi |
| --- | --- | --- | --- |
| 07:30–07:45 | 00 (người làm) | | `git pull`, kiểm tag `pre-event`. **Thử lại ChongLuaDao và J2TEAM** trên bộ trang demo, ghi kết quả cho slide so sánh. Lưu `docs/process/C-0730.png` |
| 07:45–08:10 | C1 (người làm) | | Theo `.agent/workflows/c1-moi-truong-demo.md`: Chrome demo mở được 4 trang demo, extension đã nạp |
| 08:10–08:30 | C3 soạn lời | | Lời đọc theo mục 5 của `docs/KHAC-BIET.md`, có cảnh K1, K2, K3 |
| 08:30–08:50 | C2 | B báo "B2 đã push" | `node eval/run_eval.js` ra `TP 11, FP 0, TN 15, FN 2`. Commit, push |
| 08:50–09:15 | Bản nháp | | Sắp màn hình, slide, lời đọc. Chưa có server thì dùng overlay A1 bằng `vpSend` |
| 09:15 | CP1 | | Quay bản nháp video lần 1, xuất MP4 |
| 09:20–09:55 | **A4** | A báo "A1 đã push" | `git pull` trước. Bảng nghiệm thu A4 đạt bằng `vpSend`, không cần server. Commit, push, **báo A "A4 đã push"**. Sau đó không sửa `extension/` nữa |
| 09:55–10:15 | Eval qua API | B báo URL Cloud Run | `node eval/run_eval.js --api <URL>` chạy đủ 3 cấu hình |
| 10:15–10:45 | README, tập đọc | | `README.md` có số đo thật. Đọc lời video có bấm giờ, dưới 2:00 |
| 10:45–11:20 | C3 quay | | Theo mục 5 của `docs/KHAC-BIET.md`. Cảnh K1 quay với Cloud Run có Gemini thật. Cảnh K3: đổi `API_BASE` sai hoặc tắt mạng rồi F5 trang VCB giả |
| 11:20–12:00 | Nộp | A đã gắn tag | Theo mục "Nộp bài" của `docs/NGAY-THI.md` |

### C2

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/c2-eval.md. Đọc hết file bước trước khi viết dòng code đầu tiên. Chỉ tạo hoặc sửa các file ghi trong mục 'File được sửa'. Chạy node eval/run_eval.js và dán output thật. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

### A4

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/a4-khoa-o-nhap.md. Đây là ngoại lệ trong bảng Folder ownership của AGENTS.md: C được sửa extension/content.js, chỉ trong bước này. Chỉ sửa đúng 3 chỗ ghi trong file bước, không sửa getSignals, render, STYLE. Chạy node --check extension/content.js và dán output. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

## Báo cho ai

| Khi | Câu báo | Người nhận |
| --- | --- | --- |
| A4 push xong | "A4 đã push" | A, cho bước 4 nghiệm thu A5 |
| Nộp xong | Ảnh chụp xác nhận đã nộp | Nhóm Zalo có mentor |

## Khi trễ

Cắt hộp hỏi lại (K2) trong A4, giữ khóa gửi (K1). Eval qua API chưa chạy được thì dùng số eval cục bộ, vẫn nêu cỡ mẫu 28 URL. Không lùi giờ quay 10:45.
