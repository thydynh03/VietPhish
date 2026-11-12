# Quy tắc cho agent làm việc trong repo này

Repo này là bài thi Mini Hackathon DevFest MienTrung 2026 của đội VietPhish Lens. Thời gian build chỉ có 4 giờ. Ưu tiên số một là code chạy đúng ngay lần đầu, không phải code đẹp.

## Cách làm việc

1. Mỗi lần chỉ làm **một bước**, theo đúng một file trong `.agent/workflows/`. Đọc hết file đó trước khi viết dòng code đầu tiên.
2. Chỉ tạo hoặc sửa những file ghi trong mục "File được sửa" của bước đó. Không đụng file khác, kể cả khi thấy có thể cải tiến.
3. Làm đúng tên file, tên hàm, chữ ký hàm, hằng số và câu chữ tiếng Việt ghi trong bước. Không đổi tên, không "tối ưu", không gộp hay tách file.
4. Viết xong thì chạy đúng các lệnh ở mục "Nghiệm thu". Chưa đạt thì sửa code cho tới khi đạt. Dán output thật của lệnh vào câu trả lời cuối. Không tự commit, xem mục "Commit" ở cuối file này.
5. Test fail thì sửa **code**, không sửa test vector trong `server/test/vectors/`. Vector đã được kiểm chứng. Nếu tin chắc vector sai thì dừng lại và hỏi người.
6. Gặp một lỗi mà sửa 2 lần chưa được thì dừng, báo rõ lỗi và những gì đã thử. Không thử lung tung quá 2 lần.
7. Xong bước thì dừng. Không tự làm sang bước tiếp theo.

## Ràng buộc kỹ thuật

- JavaScript thuần, ES modules ở server (`"type": "module"`). Không TypeScript, không bundler, không framework, không Express.
- Node >= 22 (script `node --test "test/*.test.js"` cần glob, có từ Node 21). Test bằng `node --test` có sẵn. Không thêm thư viện test.
- Server chỉ dùng 3 dependency đã có trong `server/package.json`: `tldts`, `fastest-levenshtein`, `@google/genai`. **Không thêm dependency.** Không chạy `npm install <gói mới>`.
- Extension là Chrome Manifest V3, script kiểu classic, không có bước build. Không dùng `import` hay `export` trong file của extension.
- Import trong server luôn ghi đủ đuôi `.js`, ví dụ `import { reason } from "./reasons.js"`.
- Đọc file JSON bằng `readFileSync(new URL("../data/x.json", import.meta.url), "utf8")`. Không dùng `__dirname`, không dùng `import ... assert { type: "json" }`.
- File lưu UTF-8 không BOM. Chuỗi hiển thị và comment viết tiếng Việt có dấu. Tên biến và tên hàm bằng tiếng Anh.
- API key chỉ đọc từ `process.env` ở server. Không ghi key vào bất kỳ file nào, không đưa key vào extension.

## Phân vùng thư mục

| Người | Thư mục được sửa |
| --- | --- |
| A | `extension/` |
| B | `server/` |
| C | `eval/`, `scripts/`, `demo-sites/`, `docs/` |

`docs/API.md` là hợp đồng giữa extension và server. Không ai sửa khi chưa báo cả đội.

`shared/official_domains.json` là nguồn gốc của whitelist. Sửa file này thì phải chép sang `server/data/official_domains.json` và `extension/official_domains.json`.

## Lệnh hay dùng

```bash
cd server && npm test                 # chạy toàn bộ unit test
cd server && node --test test/heuristics.test.js   # chạy một file test
node demo-sites/serve.js              # 4 trang demo ở cổng 8080
```

Trên Windows PowerShell, đặt biến môi trường bằng `$env:TEN="gia-tri"` trước lệnh, không dùng cú pháp `TEN=gia-tri lệnh`.

## Commit

Agent không chạy `git add`, `git commit` hay `git push`. Người làm bước tự kiểm lại rồi mới commit.

Nghiệm thu đạt thì dừng và in ra hai thứ:

1. Danh sách file đã tạo hoặc đã sửa trong bước này.
2. Output thật của các lệnh nghiệm thu.

Người sẽ commit bằng thông điệp ghi ở mục "Commit" cuối file bước, dạng `feat(server): heuristic tên miền [B2]`.
