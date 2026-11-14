# Người B: server và AI

**Sở hữu:** `server/`, `deploy.env.yaml` (ở gốc repo, chứa key, **không commit**). Không sửa gì trong `extension/`.

**Đọc trước khi bắt đầu:** `docs/YEU-CAU.md`, `AGENTS.md`, `.agent/skills/vietphish/SKILL.md`, `docs/API.md`.

**Các bước của bạn, theo thứ tự:** 00 → B1 → B2 và B4 song song → B3 → B5 → B6. Lịch chung ở `docs/CHIA-TASK.md`.

## Cách giao một bước cho agent

Mỗi bước mở **một phiên agent mới**, PowerShell ở gốc repo, dán đúng khối lệnh của bước đó. B4 chạy ở tab terminal thứ hai, song song với B2 và B3. Agent báo xong thì **bạn** chạy mục "Nghiệm thu" trong file bước. Đạt thì commit bằng khối lệnh ở cuối file bước. Test fail thì bắt agent sửa code, không sửa `server/test/vectors/`.

## Lịch và câu lệnh

| Giờ | Bước | Chờ ai | Xong khi |
| --- | --- | --- | --- |
| 07:30–07:45 | 00 (người làm) | | `git pull`, `cd server; npm install`, `node src/index.js`, `/health` trả `ok`. Lưu `docs/process/B-0730.png` |
| 07:45–07:55 | B1 | | `node --test test/official.test.js test/reasons.test.js` ra `# pass 22`. Commit, push, **báo C "B1 đã push"** |
| 07:55–08:20 | B2 (phiên 1) | | `node --test test/heuristics.test.js` ra `# pass 24`. Commit, push, **báo C "B2 đã push"** |
| 07:55–08:45 | B4 (phiên 2) | B1 đã commit | `node --test test/vision.test.js test/safebrowsing.test.js` ra `# pass 16`. Lượt thử Gemini thật bằng `node test/try-gemini.js <ảnh>` do bạn chạy |
| 08:20–08:45 | B3 (phiên 1) | B2 đã commit | `node --test test/fusion.test.js` ra `# pass 15` |
| 08:45–09:25 | B5 | B1 đến B4 đã commit | `npm test` ra `# pass 96`, `# fail 0`. `node test/smoke.js http://127.0.0.1:8787` với server mock ra 6/6 `ĐẠT`. Commit, push, **báo A "B5 đã push"** |
| 09:25–09:50 | B6 D1–D3 (người làm) | B5 đã push | Deploy Cloud Run với `VISION_MOCK=1`, `node test/smoke.js $URL` ra 6/6. **Báo A và C URL Cloud Run** |
| 09:50–10:15 | B6 D4–D6 (người làm) | | Bật Gemini và Safe Browsing thật, `/health` có `vision: on` |
| 10:15–10:45 | Sửa lỗi | | Chỉ sửa trong `server/`. Làm nóng server bằng vài request trước 10:45 |
| 10:45–11:20 | C3 (người làm) | | Đọc lời phần giải pháp trong video |
| 11:20 | Báo push xong | | Kiểm trên GitHub đủ `server/`, báo A |

### B1

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/b1-official-reasons.md. Đọc hết file bước trước khi viết dòng code đầu tiên. Chỉ tạo hoặc sửa các file ghi trong mục 'File được sửa'. Chạy lệnh test của bước và dán output thật. Không sửa server/test/vectors/. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

### B2

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/b2-heuristics.md. Đọc hết file bước trước khi viết dòng code đầu tiên. Chỉ tạo hoặc sửa các file ghi trong mục 'File được sửa'. Chạy lệnh test của bước và dán output thật. Không sửa server/test/vectors/. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

### B4 (tab terminal thứ hai)

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/b4-vision-safebrowsing.md. Đọc hết file bước trước khi viết dòng code đầu tiên. Chỉ tạo hoặc sửa các file ghi trong mục 'File được sửa'. Chạy lệnh test của bước và dán output thật. Không gọi Gemini thật, người sẽ tự chạy try-gemini.js. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

### B3

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/b3-fusion.md. Đọc hết file bước trước khi viết dòng code đầu tiên. Chỉ tạo hoặc sửa các file ghi trong mục 'File được sửa'. Chạy lệnh test của bước và dán output thật. Không sửa server/test/vectors/. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

### B5

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc AGENTS.md và .agent/skills/vietphish/SKILL.md, rồi làm đúng theo .agent/workflows/b5-analyze-server.md. Đọc hết file bước trước khi viết dòng code đầu tiên. Chỉ tạo hoặc sửa các file ghi trong mục 'File được sửa'. Chạy npm test trong server/ và smoke test với server mock, dán output thật. Không chạy git add, git commit, git push. Xong bước thì dừng."
```

### B6 (bạn tự chạy lệnh deploy)

```powershell
agy --model gemini-4-argon-medium --mode accept-edits -i "Đọc .agent/workflows/b6-deploy-cloud-run.md. Bạn chỉ giúp đọc lỗi và tra bảng trong file bước khi người hỏi. Không tự chạy lệnh gcloud, không tạo hay sửa file chứa key, không chạy git."
```

## Báo cho ai

| Khi | Câu báo | Người nhận |
| --- | --- | --- |
| B1, B2 push xong | "B1 đã push", "B2 đã push" | C, cho bước C2 |
| B5 push xong | "B5 đã push" | A, để nghiệm thu A2 |
| Deploy xong | "URL Cloud Run: …" | A đổi `API_BASE`, C chạy eval qua API |

## Khi trễ

B4 chưa xong lúc 09:15 thì dồn sức cho B4 rồi mới sang B5. Phần thử Gemini thật dời sang B6. Gemini lỗi lúc 10:15 thì chạy với kết quả `degraded` từ heuristic và nói thẳng trong video.
