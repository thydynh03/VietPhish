# Người A: extension

**Sở hữu:** `extension/` (trừ `extension/content.js` trong khung 09:20–09:55, lúc đó C làm A4). Gắn tag `v1.0-demo` lúc 11:20.

**Đọc trước khi bắt đầu:** `docs/YEU-CAU.md`, `AGENTS.md`, `.agent/skills/vietphish/SKILL.md`.

**Các bước của bạn, theo thứ tự:** 00 → A1 → A2 → **A5** → A3 (tùy chọn). Lịch chung ở `docs/CHIA-TASK.md`.

## Cách giao một bước cho agent

Mỗi bước mở **một phiên agent mới**, PowerShell ở gốc repo, dán đúng khối lệnh của bước đó. Agent báo xong thì **bạn** chạy mục "Nghiệm thu" trong file bước. Đạt thì commit bằng khối lệnh ở cuối file bước. Agent không bao giờ tự commit.

## Lịch và câu lệnh

| Giờ | Bước | Chờ ai | Xong khi |
| --- | --- | --- | --- |
| 07:30–07:45 | 00 (người làm) | | `git pull`, Load unpacked `extension/`, console service worker in "hello". Chụp màn hình, lưu `docs/process/A-0730.png` |
| 07:45–08:30 | A1 | | Overlay đỏ hiện trên trang VCB giả khi gửi kết quả giả bằng `vpSend`. Commit, push, **báo C "A1 đã push"** |
| 08:30–09:25 | A2 | | Agent xong, bạn làm mục "Tự kiểm trước khi báo xong" |
| 09:25–09:35 | A2 nghiệm thu | B báo "B5 đã push" | `git pull`, `$env:VISION_MOCK="1"; node server/src/index.js`, làm bảng nghiệm thu A2. Commit, push |
| 09:35–10:00 | **A5** | A2 đã commit | Bảng nghiệm thu A5 đạt. Bước 4 cần A4: C chưa push thì làm các bước khác trước, `git pull` rồi làm sau. Commit, push |
| Khoảng 09:50 | Đổi `API_BASE` | B báo URL Cloud Run | Sửa `API_BASE` trong `extension/config.js`, tải lại extension, chạy lại 3 kịch bản. Commit `chore(extension): point API_BASE to Cloud Run` |
| 10:00–10:40 | A3 (tùy chọn) | A5 đã commit | 10:40 chưa đạt thì `git checkout -- extension/` bỏ hẳn, không commit dở |
| 10:40–10:45 | Kiểm toàn bộ | | 4 kịch bản trong `docs/YEU-CAU.md` mục 3 đúng với Cloud Run |
| 10:45–11:20 | C3 (người làm) | | Điều khiển máy theo kịch bản quay của C |
| 11:20 | Tag | Cả 3 báo push xong | Theo mục "Tag cuối buổi" của `docs/NGAY-THI.md` |

### A1

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/a1-content-overlay.md. Đọc hết file bước trước khi viết dòng code đầu tiên. Chỉ tạo hoặc sửa các file ghi trong mục 'File được sửa'. Chạy các lệnh kiểm tra agent chạy được và dán output thật. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

### A2

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/a2-background.md. Đọc hết file bước trước khi viết dòng code đầu tiên. Chỉ tạo hoặc sửa các file ghi trong mục 'File được sửa'. Chạy các lệnh kiểm tra agent chạy được và dán output thật. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

### A5

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/a5-che-do-co-ban.md. Chỉ sửa đúng 4 chỗ trong extension/background.js ghi trong file bước. Khai báo let sensitive TRƯỚC khối try. Chạy node --check extension/background.js và dán output. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

### A3 (tùy chọn)

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/a3-popup-offline.md. A5 đã sửa background.js trước bước này: chỉ chèn đúng 4 chỗ của A3, không sửa dòng nào A5 đã viết. Chạy các lệnh kiểm tra agent chạy được và dán output thật. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

## Báo cho ai

| Khi | Câu báo | Người nhận |
| --- | --- | --- |
| A1 push xong | "A1 đã push" | C, để bắt đầu A4 |
| Gắn tag xong | "Đã gắn v1.0-demo" | C, để nộp bài |

## Khi trễ

Cắt A3 trước. Không cắt A5: chế độ cơ bản là câu trả lời cho "server sập thì sao".
