// Proxied Claude API — API-Key bleibt auf dem Server, nie im Browser sichtbar
// Vercel Environment Variable setzen: ANTHROPIC_API_KEY = sk-ant-...

export default async function handler(req, res) {
  // CORS — für alle Origins
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Nur POST erlaubt" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY fehlt in Vercel Environment Variables" });
    return;
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    res.status(400).json({ error: "Ungültiger JSON-Body" });
    return;
  }

  const { prompt, max_tokens = 1200 } = body || {};
  if (!prompt) {
    res.status(400).json({ error: "Feld 'prompt' fehlt" });
    return;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Claude API Fehler: " + err.message });
  }
}
