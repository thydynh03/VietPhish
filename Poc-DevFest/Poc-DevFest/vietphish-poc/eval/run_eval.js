// Đo heuristic tên miền (không gọi mạng) trên eval/domains.csv.
// Trang bị coi là "bị gắn cờ" khi whitelist không khớp và điểm heuristic ≥ 40 (ngưỡng SUSPICIOUS).
import { readFileSync } from "node:fs";
import { whitelistMatch, domainHeuristics } from "../server/pipeline.js";

const THRESHOLD = 40;
const rows = readFileSync(new URL("./domains.csv", import.meta.url), "utf8")
  .trim().split(/\r?\n/).slice(1)
  .map((line) => {
    const [url, label, ...note] = line.split(",");
    return { url, label, note: note.join(",") };
  });

let tp = 0, fp = 0, tn = 0, fn = 0;
const lines = [];
for (const r of rows) {
  const host = new URL(r.url).hostname;
  const wl = whitelistMatch(host);
  const h = wl ? { score: 0, reasons: [] } : domainHeuristics(r.url);
  const flagged = !wl && h.score >= THRESHOLD;
  const isPhish = r.label === "phish";
  if (flagged && isPhish) tp++;
  else if (flagged && !isPhish) fp++;
  else if (!flagged && !isPhish) tn++;
  else fn++;
  const ok = flagged === isPhish ? "✓" : "✗";
  lines.push(`${ok} ${String(h.score).padStart(2)}  ${r.label.padEnd(6)} ${r.url}  [${h.reasons.map((x) => x.code).join(", ") || (wl ? "WHITELIST" : "-")}]`);
}

const pct = (x) => (Number.isFinite(x) ? (x * 100).toFixed(1) + "%" : "n/a");
console.log(lines.join("\n"));
console.log("\nCấu hình: chỉ heuristic tên miền (không Safe Browsing, không Gemini)");
console.log(`Mẫu: ${rows.length} (phish ${tp + fn}, thật ${tn + fp}) · ngưỡng ${THRESHOLD}`);
console.log(`TP ${tp} · FP ${fp} · TN ${tn} · FN ${fn}`);
console.log(`Precision ${pct(tp / (tp + fp))} · Recall ${pct(tp / (tp + fn))} · Tỷ lệ báo nhầm ${pct(fp / (fp + tn))}`);
console.log("\nLưu ý: dữ liệu mẫu nhỏ và do PoC tự tạo; số liệu thật phải đo trên PhishVN + bộ ảnh có nhãn.");
