# SEO-Proxy – Deployment in 15 Minuten

Diese kleine Vercel-Funktion löst das CORS-Problem:
Statt dass der Browser fremde URLs direkt aufruft (blockiert),
fragt er bei deinem Vercel-Server an – der fetcht serverseitig, kein CORS.

---

## Schritt 1: GitHub-Account anlegen (falls noch keiner vorhanden)
→ https://github.com/signup (kostenlos)

## Schritt 2: Neues Repository erstellen
1. Geh auf https://github.com/new
2. Name: `seo-proxy` (oder was du willst)
3. Auf "Create repository" klicken

## Schritt 3: Die drei Dateien hochladen
Klick auf "uploading an existing file" und lade hoch:
- `package.json`
- `vercel.json`
- Den Ordner `api/` mit der Datei `fetch.js` darin

Struktur muss so aussehen:
```
seo-proxy/
├── package.json
├── vercel.json
└── api/
    └── fetch.js
```

## Schritt 4: Vercel-Account anlegen
→ https://vercel.com/signup
Mit GitHub-Account einloggen (gleiche E-Mail).

## Schritt 5: Projekt deployen
1. Auf "Add New Project" klicken
2. Dein GitHub-Repo `seo-proxy` auswählen
3. Auf "Deploy" klicken — fertig!

## Schritt 6: Deine Proxy-URL notieren
Nach dem Deploy bekommst du eine URL wie:
`https://seo-proxy-britta.vercel.app`

Deine Proxy-Adresse ist dann:
`https://seo-proxy-britta.vercel.app/api/fetch`

## Schritt 7: URL ins SEO-Tool eintragen
Im SEO-Artifact (React) ganz oben diese Zeile finden und ersetzen:

```js
const PROXY = "https://DEINE-URL.vercel.app/api/fetch";
```

---

## Testen
Ruf im Browser auf:
`https://seo-proxy-britta.vercel.app/api/fetch?url=https://britta-distel.de`

Du solltest den HTML-Quelltext von deiner Website sehen. Dann klappt alles.

---

## Kosten
Vercel Free Tier: 100.000 Aufrufe/Monat – mehr als genug für einen Leadmagneten.
Nichts zahlen, nichts konfigurieren.
