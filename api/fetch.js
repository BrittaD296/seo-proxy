export default async function handler(req, res) {
  // CORS — erlaubt Aufrufe aus dem Browser (z.B. aus Claude Artifacts oder deiner Website)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Parameter 'url' fehlt." });

  // URL validieren
  let targetUrl;
  try {
    targetUrl = new URL(url);
    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      return res.status(400).json({ error: "Nur HTTP/HTTPS erlaubt." });
    }
  } catch {
    return res.status(400).json({ error: "Ungültige URL." });
  }

  // HTML serverseitig holen (kein CORS-Problem auf dem Server)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(targetUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
      },
    });

    clearTimeout(timer);

    const html = await response.text();

    if (!html || html.length < 100) {
      return res.status(422).json({ error: "Seite hat keinen lesbaren Inhalt zurückgegeben." });
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.status(200).send(html);
  } catch (err) {
    if (err.name === "AbortError") {
      return res.status(504).json({ error: "Timeout – Seite hat zu lange nicht geantwortet." });
    }
    return res.status(500).json({ error: `Fehler beim Abrufen: ${err.message}` });
  }
}
