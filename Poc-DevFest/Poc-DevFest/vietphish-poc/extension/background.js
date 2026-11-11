// Service worker: trang tải xong → whitelist cục bộ → lấy tín hiệu → chụp màn hình → gọi server → báo kết quả.
const API = "http://localhost:8787/analyze";
let official = null;
const inFlight = new Set();

async function loadOfficial() {
  if (!official) official = await (await fetch(chrome.runtime.getURL("official_domains.json"))).json();
  return official;
}

async function isWhitelisted(hostname) {
  const o = await loadOfficial();
  const match = (d) => hostname === d || hostname.endsWith("." + d);
  return o.trustedSuffixes.some(match) || o.brands.some((b) => b.domains.some(match));
}

async function hasBrandKeyword(hostname) {
  const o = await loadOfficial();
  return o.brands.some((b) => b.keywords.some((k) => hostname.includes(k)));
}

// Thu nhỏ ảnh về rộng tối đa 1024px để gửi nhanh hơn.
async function shrink(dataUrl) {
  const bitmap = await createImageBitmap(await (await fetch(dataUrl)).blob());
  const scale = Math.min(1, 1024 / bitmap.width);
  const canvas = new OffscreenCanvas(Math.round(bitmap.width * scale), Math.round(bitmap.height * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.6 });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return "data:image/jpeg;base64," + btoa(bin);
}

function setBadge(tabId, verdict) {
  const map = { SAFE: ["✓", "#26734a"], SUSPICIOUS: ["!", "#a8670f"], DANGER: ["✕", "#c0322b"], CHECKING: ["…", "#566576"] };
  const [text, color] = map[verdict] || ["", "#566576"];
  chrome.action.setBadgeText({ tabId, text });
  chrome.action.setBadgeBackgroundColor({ tabId, color });
}

async function check(tab) {
  const url = new URL(tab.url);
  if (!/^https?:$/.test(url.protocol) || inFlight.has(tab.id)) return;
  if (await isWhitelisted(url.hostname)) return setBadge(tab.id, "SAFE"); // không gửi gì lên server

  inFlight.add(tab.id);
  setBadge(tab.id, "CHECKING");
  try {
    const signals = await chrome.tabs.sendMessage(tab.id, { type: "getSignals" }).catch(() => ({}));
    const sensitive = signals.hasPasswordField || signals.hasOtpField || signals.hasCardField;
    let screenshot;
    // Chỉ chụp khi trang lạ có ô nhập nhạy cảm hoặc tên miền chứa tên thương hiệu.
    if (sensitive || (await hasBrandKeyword(url.hostname))) {
      const raw = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg", quality: 70 });
      screenshot = await shrink(raw);
    }
    const res = await fetch(API, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: tab.url, title: tab.title, screenshot, signals, mode: "full" }),
    });
    const result = await res.json();
    setBadge(tab.id, result.verdict);
    if (result.verdict !== "SAFE") chrome.tabs.sendMessage(tab.id, { type: "verdict", result }).catch(() => {});
  } catch (e) {
    console.warn("VietPhish: lỗi khi kiểm tra", e);
    setBadge(tab.id, "");
  } finally {
    inFlight.delete(tab.id);
  }
}

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === "complete" && tab.active && tab.url) setTimeout(() => check(tab), 300);
});
