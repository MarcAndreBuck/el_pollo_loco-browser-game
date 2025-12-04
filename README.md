# 🐔 El Pollo Loco – Browser Game  
A modern, responsive JavaScript Jump-and-Run game powered by HTML5 Canvas.

---

# 🇬🇧 English

## 🎮 Description
**El Pollo Loco** is a browser-based jump-and-run game built entirely with  
**HTML, CSS, and vanilla JavaScript** using the HTML5 Canvas API.

It features animated enemies, a final boss, mobile controls, UI overlays, smooth physics, and a complete audio system.  
The project follows clean code principles, modular architecture, and includes full responsiveness for desktop and mobile devices.

---

## ✨ Features

### 🕹 Gameplay
- Fully animated player character (idle, walk, jump, hurt, long idle/sleep)
- Smooth movement, gravity, collision system
- Collectible items: **Coins** and **Bottles**
- Bottle throwing mechanic with physics and splash animation
- Multiple enemy types + final boss with alert/attack/hurt/death states
- Status bars for health, bottles, and boss HP
- Randomized win/lose screens

### 🎧 Audio
- Background music for level and boss fight  
- Sound effects for player, enemies, items, UI  
- Global sound manager (mute, stop, categories)  
- Persistent mute state (LocalStorage)

### 📱 Mobile Support
- Touch controls (left, right, jump, throw)
- Visible only on mobile/tablet
- Orientation lock with overlay ("Turn your device")
- Context menu disabled for mobile UI buttons

### 🖥 UI & Screens
- Startscreen with buttons for Start / Story / Controls
- Pause menu with:
  - Resume  
  - Restart  
  - Controls  
  - Back to Start  
  - Privacy Policy  
  - Legal Notice  
- Controls overlay
- Header bar with mute, menu and fullscreen buttons

### 🎨 Visuals
- Multi-layer parallax background  
- Randomized start, win and game-over screens  
- Canvas-rendered wooden/green UI buttons  
- Custom font **Rye**

---

## 🗂 Project Structure (simplified)
```text
.
├── index.html
├── style.css
├── js/
│   ├── world.class.js
│   ├── level/
│   ├── ui/
│   ├── engine/
│   ├── entities/
│   └── utils/
└── assets/



# DE Deutsch

# 🐔 El Pollo Loco – Browser Game  
Deutsche Projektbeschreibung

## 🎮 Beschreibung
**El Pollo Loco** ist ein browserbasiertes Jump-and-Run-Spiel, entwickelt mit HTML, CSS und reinem JavaScript (Canvas API).  
Das Spiel enthält animierte Gegner, einen Endboss, mobile Steuerung, Overlays, Soundeffekte und ein vollständiges UI-System.  
Es folgt Clean-Code-Prinzipien und ist vollständig responsiv.

## ✨ Funktionen

### 🕹 Gameplay
- Voll animierter Charakter (Idle, Walk, Jump, Hurt, Sleep)
- Schwerkraft, Kollisionen und flüssige Bewegung
- Sammelbare Items: Münzen & Flaschen
- Wurfmechanik mit Flugbahn + Splash-Animation
- Unterschiedliche Gegner + Endboss
- Statusleisten für Leben, Flaschen & Boss-HP
- Zufällige Win- und Game-Over-Screens

### 🎧 Sound
- Hintergrundmusik für Level & Bossfight
- SFX für Spieler, Gegner, UI und Gegenstände
- Globaler Soundmanager (Mute, Kategorien)
- Mute-Zustand wird gespeichert (LocalStorage)

### 📱 Mobile Unterstützung
- Touch-Steuerung: Links, Rechts, Springen, Werfen
- Nur auf mobilen Geräten sichtbar
- Hochformat-Sperre mit Overlay
- Kontextmenü für Buttons deaktiviert

### 🖥 UI & Overlays
- Startscreen: Start / Story / Controls
- Pause-Menü: Resume / Restart / Controls / Start / Datenschutz / Impressum
- Header-Bar: Mute, Menü, Fullscreen

### 🎨 Design
- Parallax-Hintergründe
- Holz- und Grün-Buttons im Canvas gerendert
- Custom Font "Rye"
- Zufällige Start-, Win- & Game-Over-Bilder

## 📝 Lizenzhinweise
Einige Grafiken stammen von **Pixabay** (frei verwendbar).  
Weitere Assets aus frei nutzbaren Lernprojekten (El Pollo Loco).  
Sounds: Freepik / Freesound lizenzfreie Inhalte.  
Projekt dient ausschließlich Lern- und Ausbildungszwecken.

## 🚀 Installation
```bash
git clone https://github.com/MarcAndreBuck/el_pollo_loco-browser-game
```

`index.html` im Browser öffnen oder Live Server nutzen.

## ❤️ Viel Spaß beim Spielen!