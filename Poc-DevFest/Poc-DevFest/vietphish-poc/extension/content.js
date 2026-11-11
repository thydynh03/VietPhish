// Content script: đọc tín hiệu trên trang và vẽ cảnh báo trong Shadow DOM.
function getSignals() {
  const inputs = [...document.querySelectorAll("input")];
  const text = (el) => `${el.name} ${el.id} ${el.placeholder} ${el.getAttribute("autocomplete") || ""}`.toLowerCase();
  const form = document.querySelector("form[action]");
  let formActionHost = null;
  try { if (form) formActionHost = new URL(form.action, location.href).hostname; } catch {}
  return {
    hasPasswordField: inputs.some((i) => i.type === "password"),
    hasOtpField: inputs.some((i) => /otp|one-time-code|mã xác thực|ma xac thuc/.test(text(i))),
    hasCardField: inputs.some((i) => /card|cc-number|cvv|số thẻ/.test(text(i))),
    formActionHost,
  };
}

function render(result) {
  document.getElementById("vietphish-lens-root")?.remove();
  const host = document.createElement("div");
  host.id = "vietphish-lens-root";
  const root = host.attachShadow({ mode: "closed" });
  const danger = result.verdict === "DANGER";
  const reasons = result.reasons.slice(0, 4).map((r) => `<li>${escapeHtml(r.text)}</li>`).join("");
  const official = result.brand?.officialUrl;

  root.innerHTML = `
    <style>
      :host{all:initial}
      .wrap{position:fixed;z-index:2147483647;font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff}
      .full{inset:0;background:rgba(150,20,20,.96);display:flex;align-items:center;justify-content:center;padding:16px}
      .bar{left:0;right:0;top:0;background:#a8670f;padding:10px 16px}
      .card{max-width:620px;width:100%}
      h1{font-size:26px;margin:0 0 8px}
      .score{font-size:13px;opacity:.85;margin-bottom:12px}
      ul{margin:0 0 18px;padding-left:20px}
      li{margin:4px 0}
      .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
      button,a.btn{font:inherit;border:0;border-radius:6px;padding:10px 16px;cursor:pointer;text-decoration:none}
      .primary{background:#fff;color:#8f1d1d;font-weight:700}
      .ghost{background:transparent;color:#fff;text-decoration:underline;padding:10px 4px}
      .bar .ghost{padding:0 4px}
    </style>
    ${danger ? `
      <div class="wrap full" role="alertdialog" aria-label="Cảnh báo trang giả mạo">
        <div class="card">
          <h1>⚠ CẢNH BÁO: CÓ THỂ LÀ TRANG GIẢ MẠO</h1>
          <div class="score">Điểm rủi ro ${result.riskScore}/100${result.degraded ? " · chưa có kết quả phân tích hình ảnh" : ""}</div>
          <ul>${reasons}</ul>
          <div class="row">
            ${official ? `<a class="btn primary" href="${official}">Về trang chính thức ${escapeHtml(result.brand.name)}</a>` : ""}
            <button class="ghost" id="dismiss">Tôi hiểu rủi ro, vẫn tiếp tục</button>
          </div>
        </div>
      </div>` : `
      <div class="wrap bar" role="alert">
        <strong>Trang đáng ngờ (${result.riskScore}/100):</strong> ${escapeHtml(result.reasons[0]?.text || "")}
        <button class="ghost" id="dismiss">Đóng</button>
      </div>`}
  `;
  root.getElementById("dismiss").addEventListener("click", () => host.remove());
  document.documentElement.appendChild(host);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "getSignals") sendResponse(getSignals());
  if (msg.type === "verdict") render(msg.result);
});
