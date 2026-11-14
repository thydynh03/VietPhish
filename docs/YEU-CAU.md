# Yêu cầu dự án VietPhish Lens

Đọc file này trước khi code. Nó trả lời ba câu: sản phẩm phải làm được gì, thế nào là "xong", và cái gì **không** làm.

Thứ tự đọc khi mới clone: `README.md` → file này → `docs/CHIA-TASK.md` → file task của mình trong `docs/tasks/` → `AGENTS.md`.

## 1. Bài toán

Người dùng Việt Nam bị lừa vào trang giả ngân hàng, ví điện tử, VNeID, dịch vụ công, rồi nhập mật khẩu hoặc OTP. Danh sách đen luôn chậm một bước, vì trang giả chỉ sống vài giờ. ChongLuaDao và J2TEAM Security đều dựa vào danh sách, nên trang vừa tạo thì không bắt được (xem `docs/KHAC-BIET.md`).

**Nguyên tắc lõi:** trang **trông giống** thương hiệu X, **tên miền không thuộc** X, và **đòi** mật khẩu, OTP hoặc số thẻ, thì gần như chắc chắn là lừa đảo. Không cần chờ ai báo cáo.

Phạm vi: 16 thương hiệu trong `shared/official_domains.json`.

## 2. Yêu cầu chức năng

| Mã | Yêu cầu | Bước làm |
| --- | --- | --- |
| R1 | Trang thuộc whitelist: huy hiệu xanh, không gửi ảnh, không gọi Gemini | B1, A2 |
| R2 | Trang lạ: gửi URL, tiêu đề, tín hiệu trang (ô mật khẩu, OTP, số thẻ, nơi form gửi đi) lên `/analyze`. Chỉ chụp ảnh khi trang có ô nhạy cảm hoặc tên miền chứa tên thương hiệu | A1, A2 |
| R3 | Server chấm theo 4 lớp: whitelist, Safe Browsing, heuristic tên miền, Gemini nhìn ảnh. Gộp thành điểm 0–100: từ 70 là DANGER, từ 40 là SUSPICIOUS | B2–B5 |
| R4 | Luật cứng: giống thương hiệu, tên miền sai, đòi bí mật thì điểm ít nhất 85 | B3 |
| R5 | DANGER: phủ đỏ toàn trang, tối đa 4 lý do tiếng Việt, nút "Về trang chính thức". SUSPICIOUS: dải vàng ở mép trên | A1 |
| R6 | Lý do cụ thể, ví dụ "Trang này trông giống Vietcombank nhưng địa chỉ … không phải tên miền chính thức (vietcombank.com.vn)" | B1, B3 |
| R7 | **K1.** Trang lạ có ô nhạy cảm: khóa gửi biểu mẫu trong lúc chờ kết luận, tự mở sau 15 giây | A4, A5 |
| R8 | **K2.** Trang SUSPICIOUS: hỏi lại trước khi người dùng gõ vào ô mật khẩu, OTP, số thẻ | A4 |
| R9 | **K3.** Server lỗi: chế độ cơ bản vẫn cảnh báo trang có tên thương hiệu trong tên miền | A5 |
| R10 | **K4.** Chỉ gửi `origin + pathname`, không gửi query và hash | A5 |
| R11 | Popup hiện kết luận của tab, nút "Kiểm tra lại". Chế độ demo offline. Tùy chọn, bị cắt đầu tiên | A3 |
| R12 | Đo được: eval 3 cấu hình (chỉ danh sách đen, heuristic, heuristic + Gemini) trên `eval/domains.csv` | C2 |

## 3. Bốn kịch bản demo bắt buộc

| # | Trang | Phải thấy |
| --- | --- | --- |
| 1 | `https://www.vietcombank.com.vn` | Huy hiệu xanh, không overlay |
| 2 | `http://vietcombank-xacthuc.top:8080/` | Chip "đang kiểm tra", bấm Đăng nhập không gửi được, rồi phủ đỏ có lý do tiếng Việt và nút về trang chính thức |
| 3 | `http://vneid-capnhat.cc:8080/` | Phủ đỏ với lý do OTP và VNeID |
| 4 | `http://tintuc-demo.vn:8080/` | Không cảnh báo (bài báo nhắc Vietcombank không bị báo nhầm) |

Cảnh thêm cho video: tắt server rồi mở lại kịch bản 2, phải thấy dải vàng "chế độ cơ bản" và hộp hỏi lại khi bấm vào ô mật khẩu.

## 4. Yêu cầu phi chức năng

- **An toàn:** mọi chuỗi từ server qua `escapeHtml` trước khi vào `innerHTML`. Shadow DOM `closed`. Nút về trang chính thức chỉ nhận `https://`.
- **Riêng tư:** trang whitelist không bao giờ bị chụp. Không gửi query, hash. Log server chỉ ghi hostname.
- **Không khóa nhầm:** trang ngân hàng thật không bao giờ bị khóa form. Khóa nào cũng tự mở.
- **Bí mật:** API key chỉ ở biến môi trường của server. Không có key trong extension hay trong commit.
- **Độ trễ:** server mock dưới 1 giây. Gemini thật vài giây, có timeout 10 giây.

## 5. Thế nào là "xong"

- [ ] `cd server && npm test` đạt toàn bộ (`# pass 96`, `# fail 0` sau B5)
- [ ] `node server/test/smoke.js <URL>` ra 6/6 `ĐẠT` với server Cloud Run
- [ ] 4 kịch bản ở mục 3 đúng trên Chrome demo với `API_BASE` là URL Cloud Run
- [ ] Bảng nghiệm thu A4 và A5 đạt
- [ ] `node eval/run_eval.js` ra `TP 11, FP 0, TN 15, FN 2`, có số 3 cấu hình
- [ ] `README.md` có số đo thật và link video
- [ ] Video MP4 dưới 2:00, có tiếng, có cảnh K1 và K3
- [ ] Tag `v1.0-demo` trên GitHub, đã nộp link repo và link video

## 6. Không làm

- Không thêm thương hiệu ngoài 16 thương hiệu (Facebook, Shopee để sau cuộc thi).
- Không thêm dependency, không TypeScript, không bundler, không framework.
- Không đưa trang demo lên Internet.
- Không chép code từ `VietPhish_Demo` hay `Poc-DevFest/` vào thư mục code. Mọi logic viết trong giờ thi theo `.agent/workflows/`.
- Không sửa `docs/API.md`, `shared/` khi chưa báo cả đội.

## 7. Ràng buộc của cuộc thi

- Dự án mang vào hoàn thiện tối đa 30%. Mốc là tag `pre-event`. Mọi commit sau tag là phần làm trong giờ thi (`docs/PREBUILT.md`).
- Build 4 giờ, đóng băng tính năng ở CP2 lúc 10:15, quay video lúc 10:45, nộp 11:20–12:00 (`docs/NGAY-THI.md`).
