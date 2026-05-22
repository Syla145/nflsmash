# 🏈 Football League of Legends – Prototyp v0.1

Ein 2D-Platform-Fighter im Stil von Super Smash Bros, als Browser-Spiel.

---

## 🚀 Schnellstart

Da das Spiel ES6-Module verwendet, braucht es einen lokalen Webserver.

### Option A – VS Code (empfohlen für Anfänger)
1. VS Code öffnen
2. Extension **"Live Server"** installieren (Ritwick Dey)
3. `index.html` öffnen → Rechtsklick → **"Open with Live Server"**
4. Browser öffnet sich automatisch ✅

### Option B – Node.js (falls installiert)
```bash
npx serve .
# oder
npx http-server .
```
Dann `http://localhost:3000` im Browser öffnen.

### Option C – Python (falls installiert)
```bash
python -m http.server 8080
```
Dann `http://localhost:8080` öffnen.

> ⚠️ Doppelklick auf `index.html` funktioniert NICHT (CORS-Fehler wegen ES6-Modulen)

---

## 🎮 Steuerung

| Aktion        | Spieler 1 | Spieler 2     |
|---------------|-----------|---------------|
| Bewegen       | A / D     | ← / →         |
| Springen      | W         | ↑             |
| Fast Fall     | S (in Luft) | ↓ (in Luft) |
| Angriff       | F         | L             |

---

## 📁 Projektstruktur

```
football-legend/
├── index.html              # Einstiegspunkt
├── src/
│   ├── main.js             # Phaser-Konfiguration
│   ├── characters/
│   │   └── Fighter.js      # Basis-Klasse für alle Charaktere
│   └── scenes/
│       ├── MenuScene.js    # Hauptmenü & Siegerbildschirm
│       ├── GameScene.js    # Spielfeld & Spiellogik
│       └── HUDScene.js     # HUD (Schaden, Leben, Stocks)
└── assets/                 # Bilder, Sounds (noch leer)
```

---

## 🔧 Nächste Schritte (Phase 1 → 2)

- [ ] Sprite-Grafiken statt Rechtecke
- [ ] Verschiedene Angriffe (Neutral, Smash, Special)
- [ ] 4-Spieler-Unterstützung
- [ ] Durchfallplattformen
- [ ] Sound-Effekte
- [ ] Zweiter Charakter mit anderem Moveset
- [ ] Gamepad-Unterstützung (Browser Gamepad API)

---

## 💡 Debug-Tipps

In `src/main.js` → `arcade: { debug: true }` aktivieren, um Hitboxen zu sehen.

---

*Prototyp erstellt: Mai 2025 | Engine: Phaser 3.60*
