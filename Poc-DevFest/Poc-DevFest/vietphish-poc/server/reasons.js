// Mẫu lý do cảnh báo bằng tiếng Việt. {key} được thay bằng giá trị thật.
const TEMPLATES = {
  WHITELIST: { w: 0, t: "Tên miền {domain} nằm trong danh sách chính thức." },
  SAFE_BROWSING_HIT: { w: 100, t: "Google Safe Browsing đã xác định trang này là lừa đảo." },
  BRAND_DOMAIN_MISMATCH: { w: 40, t: "Trang này trông giống {brand} nhưng địa chỉ {domain} không phải tên miền chính thức ({official})." },
  ASKS_OTP: { w: 20, t: "Trang yêu cầu nhập mã OTP. Ngân hàng và cơ quan nhà nước không bao giờ hỏi OTP trên trang lạ." },
  ASKS_PASSWORD: { w: 20, t: "Trang yêu cầu mật khẩu đăng nhập {brand} trên một tên miền lạ." },
  ASKS_CARD: { w: 20, t: "Trang yêu cầu số thẻ hoặc CVV, dấu hiệu đánh cắp thông tin thẻ." },
  LOOKALIKE_DOMAIN: { w: 40, t: "Tên miền {domain} gần giống {official} (chỉ khác {n} ký tự)." },
  HOMOGLYPH: { w: 40, t: "Tên miền dùng ký tự đánh lừa thị giác: {uni} (thực chất là {puny})." },
  SUBDOMAIN_TRICK: { w: 40, t: "Tên miền thật là {registrable}; phần chữ {brand} phía trước chỉ là phần giả." },
  BRAND_KEYWORD: { w: 25, t: "Tên miền {domain} chứa tên {brand} nhưng không thuộc {brand}." },
  SUSPICIOUS_TLD: { w: 15, t: "Đuôi .{tld} thường bị lợi dụng trong lừa đảo." },
  NO_HTTPS: { w: 10, t: "Trang không dùng kết nối bảo mật HTTPS." },
  FORM_OTHER_HOST: { w: 10, t: "Dữ liệu bạn nhập sẽ được gửi sang máy chủ khác ({host})." },
  URGENCY: { w: 5, t: "Trang dùng lời lẽ hối thúc (khóa tài khoản, cập nhật gấp…)." },
  VNEID_OFFLINE: { w: 0, t: "VNeID chỉ xác thực qua ứng dụng chính thức và vneid.gov.vn, không qua website lạ." },
};

export function reason(code, vars) {
  const tpl = TEMPLATES[code];
  const text = tpl.t.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
  return { code, text, weight: tpl.w };
}
