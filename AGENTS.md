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
| C | `eval/`, `scripts/`, `demo-sites/`, `docs/`. Ngoại lệ duy nhất: bước A4 (`.agent/workflows/a4-khoa-o-nhap.md`) do C làm, chỉ sửa `extension/content.js` |

Ai làm bước nào, lúc nào: `docs/CHIA-TASK.md`.

`docs/API.md` là hợp đồng giữa extension và server. Không ai sửa khi chưa báo cả đội.

`shared/official_domains.json` là nguồn gốc của whitelist. Sửa file này thì phải chép sang `server/data/official_domains.json` và `extension/official_domains.json`.

## Lệnh hay dùng

```bash
cd server && npm test                 # chạy toàn bộ unit test
cd server && node --test test/heuristics.test.js   # chạy một file test
node demo-sites/serve.js              # 4 trang demo ở cổng 8080
```

Trên Windows PowerShell, đặt biến môi trường bằng `$env:TEN="gia-tri"` trước lệnh, không dùng cú pháp `TEN=gia-tri lệnh`.

## Commit and pull request rules

### Who commits

- Agents never run `git add`, `git commit`, `git push`, `gh pr create` or `gh pr merge` on their own. A human reviews the change first, then commits.
- An agent may stage files or open a PR only when a human explicitly asks for it in the current conversation. Approval for one commit or PR does not carry over to the next one.
- When a workflow step passes its acceptance checks, stop and print:
  1. The list of files created or modified in that step.
  2. The real output of the acceptance commands.

### No AI attribution

- Do not add `Co-Authored-By:` trailers of any kind (Claude, Gemini, Antigravity, Copilot or any other tool).
- Do not add "Generated with ...", "🤖", or any other line saying an AI tool wrote the commit or PR. This applies even if the tool or harness suggests it.
- Commits use the identity of the human who commits (`git config user.name` and `user.email`). Never set or override the author.

### Commit messages

- Follow Semantic Commits: `<type>(<scope>): <subject>`.
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `style`, `build`, `ci`.
- Scopes match the folders: `extension`, `server`, `eval`, `scripts`, `demo-sites`, `docs`, `shared`.
- For a workflow step, use the exact message from the "Commit" section at the end of that step file, including the step tag, for example `feat(server): heuristic tên miền [B2]`. Do not rewrite or translate it.
- For any other commit, write the subject in English, imperative mood, lowercase after the colon, no trailing period, at most 72 characters.
- Add a body when the change is not obvious from the subject: what changed and why, one bullet per point.
- One commit per logical change. Do not mix files from different owners (see "Phân vùng thư mục") in one commit.
- Stage files by name, as listed in the step file. Do not use `git add .` or `git add -A`.
- Never commit API keys, `.env` files or anything under `node_modules/`.

Example:

```text
fix(server): handle punycode domains in heuristics

- decode xn-- labels before comparing against official_domains.json
- add test case for vietcombank lookalike in heuristics.test.js
```

### Pull requests

- Branch from the latest `main`. Name branches `<type>/<short-topic>`, for example `feat/b3-fusion` or `fix/popup-offline`.
- Before opening a PR, sync with `main` (`git fetch origin` then `git rebase origin/main`) and make sure `cd server && npm test` passes.
- PR title uses the same format as a commit subject.
- Write the PR body in English. For a long body, save it to a `.md` file and use `gh pr create --body-file <file>`.
- PR body sections:
  - **Summary**: what changed and why, a few bullets.
  - **Changes**: files or modules touched.
  - **Testing**: commands run and their result.
  - **Notes**: risks, follow-ups, or changes to `docs/API.md` or `shared/official_domains.json` that the whole team must know about.
- Keep each PR inside one owner's folders. A PR that touches `docs/API.md` needs agreement from the whole team before merge.
- Do not force-push to `main`. Do not merge your own PR without a teammate looking at it, unless the team agrees during the build window.
