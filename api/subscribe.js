// ActiveCampaign-Integration — serverseitig, API-Key bleibt geheim
// Umgebungsvariablen in Vercel setzen:
//   AC_API_URL  = https://DEINACCOUNT.api-us1.com
//   AC_API_KEY  = dein ActiveCampaign API-Key
//   AC_LIST_ID  = ID der Liste (Zahl)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).json({ error: "Nur POST erlaubt" });

  const { email } = req.body || {};
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Ungültige E-Mail" });

  const AC_URL = process.env.AC_API_URL;
  const AC_KEY = process.env.AC_API_KEY;
  const AC_LIST = process.env.AC_LIST_ID;

  if (!AC_URL || !AC_KEY) {
    // Kein AC konfiguriert → trotzdem durchlassen (für Tests)
    return res.status(200).json({ ok: true, note: "AC nicht konfiguriert – E-Mail nicht gespeichert" });
  }

  try {
    // 1. Kontakt anlegen oder updaten
    const contactRes = await fetch(`${AC_URL}/api/3/contacts`, {
      method: "POST",
      headers: { "Api-Token": AC_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ contact: { email } }),
    });
    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;

    // 2. Zur Liste hinzufügen
    if (contactId && AC_LIST) {
      await fetch(`${AC_URL}/api/3/contactLists`, {
        method: "POST",
        headers: { "Api-Token": AC_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ contactList: { list: AC_LIST, contact: contactId, status: 1 } }),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
