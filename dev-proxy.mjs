/**
 * Dev-only CORS proxy for web testing.
 * Forwards requests to the production API adding CORS headers for localhost.
 *
 * Usage: node dev-proxy.mjs
 * Then set EXPO_PUBLIC_API_URL=http://localhost:3001 in .env.local
 */
import http from "http";
import https from "https";
import { URL } from "url";

const TARGET = "https://cashin-api-production.up.railway.app";
const PORT = 3001;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
  "Access-Control-Max-Age": "86400",
};

const server = http.createServer((req, res) => {
  // Handle preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  const targetUrl = new URL(req.url, TARGET);
  const options = {
    hostname: targetUrl.hostname,
    port: 443,
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: targetUrl.hostname,
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      ...CORS_HEADERS,
    });
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message);
    res.writeHead(502, CORS_HEADERS);
    res.end(JSON.stringify({ error: "Proxy error", detail: err.message }));
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PORT, () => {
  console.log(`\n✅ Dev proxy running at http://localhost:${PORT}`);
  console.log(`   Forwarding → ${TARGET}\n`);
});
