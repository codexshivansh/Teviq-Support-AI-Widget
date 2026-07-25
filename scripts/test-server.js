const fs = require("fs");
const http = require("http");
const path = require("path");

const port = Number(process.env.PORT || 4174);
const root = path.join(__dirname, "..");

const fixtureHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Teviq widget test</title>
  </head>
  <body style="min-height: 1600px; margin: 0">
    <main><h1>Storefront fixture</h1></main>
    <script
      src="/widget.js"
      data-brand-id="vastra-demo"
      data-api-url="http://127.0.0.1:4174">
    </script>
  </body>
</html>`;

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function getReply(message) {
  const value = String(message || "").toLowerCase();

  if (value.includes("track")) {
    return {
      reply: "Please share your order ID so I can check its latest status.",
      source: "system",
      escalated: false,
      intent: "order_tracking",
      language: "english",
      sentiment: "neutral",
      warnings: []
    };
  }

  if (value.includes("return") || value.includes("exchange")) {
    return {
      reply: "Please share your order ID so I can check return or exchange eligibility.",
      source: "system",
      escalated: false,
      intent: "return_exchange",
      language: "english",
      sentiment: "neutral",
      warnings: []
    };
  }

  if (value.includes("human") || value.includes("support")) {
    return {
      reply: "Please share your name and phone number or email so our support team can follow up.",
      source: "system",
      escalated: false,
      intent: "human_support",
      language: "english",
      sentiment: "neutral",
      warnings: []
    };
  }

  return {
    reply: "Delivery usually takes three to five business days.",
    source: "system",
    escalated: false,
    intent: "shipping_policy",
    language: "english",
    sentiment: "neutral",
    warnings: []
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(fixtureHtml);
  }

  if (
    req.method === "GET" &&
    ["/widget.js", "/v1.0.0/widget.js"].includes(url.pathname)
  ) {
    const fileName =
      url.pathname === "/widget.js" ? "widget.js" : "v1.0.0/widget.js";
    res.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8" });
    return fs.createReadStream(path.join(root, fileName)).pipe(res);
  }

  if (
    req.method === "GET" &&
    url.pathname === "/api/brand-config/vastra-demo"
  ) {
    return sendJson(res, 200, {
      brandName: "Teviq Vastra Demo",
      widgetTitle: "Vastra Support",
      welcomeTitle: "How can I help?",
      welcomeBody:
        "I can help with orders, returns, shipping, and product questions.",
      themeColor: "#172033",
      position: "bottom-right",
      quickReplies: [
        { label: "📦 Track my order", message: "Track my order" },
        { label: "↩ Return / Exchange", message: "Return / Exchange" },
        { label: "🚚 Shipping & Delivery", message: "Shipping & Delivery" },
        { label: "👤 Talk to Support", message: "Talk to human" }
      ]
    });
  }

  if (req.method === "POST" && url.pathname === "/api/chat") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let payload = {};
      try {
        payload = JSON.parse(body || "{}");
      } catch {
        return sendJson(res, 400, { error: "invalid_json" });
      }

      if (
        payload.brandId !== "vastra-demo" ||
        payload.brand_id !== "vastra-demo"
      ) {
        return sendJson(res, 403, {
          error: "invalid_brand",
          reply: "Something went wrong. Please try again."
        });
      }

      return setTimeout(() => sendJson(res, 200, getReply(payload.message)), 70);
    });
    return;
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Widget test server listening on http://127.0.0.1:${port}`);
});
