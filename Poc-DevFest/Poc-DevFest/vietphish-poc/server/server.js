// Server PoC: POST /analyze. Chạy local, không cần Firebase.
import { createServer } from "node:http";
import { analyze } from "./pipeline.js";

const PORT = Number(process.env.PORT || 8787);
const cache = new Map(); // url → { at, result }
const CACHE_MS = 10 * 60 * 1000;

function send(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
  });
  res.end(JSON.stringify(body));
}

createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method === "GET" && req.url === "/health") return send(res, 200, { ok: true });
  if (req.method !== "POST" || req.url !== "/analyze") return send(res, 404, { error: "Not found" });

  let raw = "";
  for await (const chunk of req) raw += chunk;
  let body;
  try {
    body = JSON.parse(raw);
    new URL(body.url);
  } catch {
    return send(res, 400, { error: "Body phải là JSON và có trường url hợp lệ." });
  }

  const key = `${body.mode || "full"}|${body.url}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) {
    console.log(`[cache ${hit.result.verdict} ${hit.result.riskScore}] ${body.url}`);
    return send(res, 200, { ...hit.result, cached: true });
  }

  try {
    const result = await analyze(body);
    cache.set(key, { at: Date.now(), result });
    const { vision, ...layers } = result.layers;
    const shot = body.screenshot ? `ảnh ${Math.round((body.screenshot.length * 3) / 4 / 1024)}KB` : "không ảnh";
    console.log(`[${result.verdict} ${result.riskScore}] ${body.url} (${shot})`, layers, `${result.latencyMs.total}ms`);
    send(res, 200, result);
  } catch (e) {
    console.error(e);
    send(res, 500, { error: String(e.message || e) });
  }
}).listen(PORT, () => {
  console.log(`VietPhish PoC server: http://localhost:${PORT}`);
  console.log(`Gemini: ${process.env.VISION_MOCK === "1" ? "MOCK (đoán từ tiêu đề)" : process.env.GEMINI_API_KEY ? "bật" : "tắt (thiếu GEMINI_API_KEY)"}`);
  console.log(`Safe Browsing: ${process.env.SAFE_BROWSING_KEY ? "bật" : "tắt (thiếu SAFE_BROWSING_KEY)"}`);
});
