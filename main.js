// ============================================================
//  GameScene.js – Hauptspielszene
//  Enthält: Stage, Plattformen, 2 Kämpfer, Spiellogik
// ============================================================

import { Fighter } from '../characters/Fighter.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.fighters = [];
    this.gameOver = false;

    // --- Hintergrund ---
    this._buildBackground(W, H);

    // --- Plattformen erstellen ---
    this.platforms = this.physics.add.staticGroup();
    this._buildStage(W, H);

    // --- Kämpfer erstellen ---
    const p1 = new Fighter(this, 320, 400, 0, {
      name: 'P1', color: 0x00ddff,
      stats: { walkSpeed: 220, runSpeed: 370, jumpPower: -760, weight: 100 }
    });
    const p2 = new Fighter(this, 960, 400, 1, {
      name: 'P2', color: 0xff4466,
      stats: { walkSpeed: 220, runSpeed: 340, jumpPower: -780, weight: 110 }
    });
    this.fighters = [p1, p2];

    // Plattform-Kollision für beide Kämpfer
    this.fighters.forEach(f => {
      this.physics.add.collider(f.sprite, this.platforms);
    });

    // --- Steuerung ---
    this._setupControls();

    // --- HUD-Szene parallel starten ---
    this.scene.launch('HUDScene', { fighters: this.fighters });
    this.hudScene = this.scene.get('HUDScene');

    // --- Events ---
    this.events.on('stockLost', (pIdx, stocks) => {
      // HUD aktualisieren
    });
    this.events.on('playerOut', (pIdx) => {
      this._checkGameOver();
    });

    // Abgrenz-Linie (Blast Zone Visualisierung)
    this._drawBlastZone(W, H);
  }

  // ============================================================
  //  Hintergrund – Stadion-Atmosphäre
  // ============================================================
  _buildBackground(W, H) {
    // Himmel-Gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a2e, 0x0a0a2e, 0x1a1a4e, 0x1a1a4e, 1);
    bg.fillRect(0, 0, W, H);

    // Stadion-Lichter (Punkte)
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H * 0.5);
      const r = Phaser.Math.FloatBetween(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.3, 0.9);
      this.add.circle(x, y, r, 0xffffff, alpha);
    }

    // Rasen-Anzeige unten
    const grass = this.add.graphics();
    grass.fillGradientStyle(0x1a5c1a, 0x1a5c1a, 0x0d3d0d, 0x0d3d0d, 1);
    grass.fillRect(0, H - 80, W, 80);

    // 50-Yard-Linie
    const line = this.add.graphics();
    line.lineStyle(2, 0x44ff44, 0.3);
    line.lineBetween(W / 2, H * 0.3, W / 2, H - 80);
  }

  // ============================================================
  //  Stage bauen – Battlefield-ähnliches Layout
  // ============================================================
  _buildStage(W, H) {
    const gfx = this.add.graphics();

    // Hilfsfunktion: Plattform zeichnen + als Physik-Objekt anlegen
    const addPlatform = (x, y, w, h, color = 0x556688) => {
      // Visuell
      gfx.fillStyle(color, 1);
      gfx.fillRoundedRect(x - w / 2, y - h / 2, w, h, 6);
      gfx.lineStyle(2, 0x8899aa, 0.8);
      gfx.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 6);

      // Physik (unsichtbares statisches Rechteck)
      const plat = this.add.rectangle(x, y, w, h);
      this.physics.add.existing(plat, true);
      this.platforms.add(plat);
      return plat;
    };

    // Hauptbühne (Boden)
    addPlatform(W / 2, H - 100, 760, 24, 0x4a7fa5);

    // 3 schwebende Plattformen (wie Battlefield)
    addPlatform(W / 2,       H - 280, 280, 18, 0x3a6f95); // Mitte oben
    addPlatform(W / 2 - 240, H - 210, 220, 18, 0x3a6f95); // Links
    addPlatform(W / 2 + 240, H - 210, 220, 18, 0x3a6f95); // Rechts

    // Plattform-Beschriftungen
    this.add.text(W / 2, H - 87, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', {
      fontSize: '8px', color: '#88aacc', alpha: 0.4
    }).setOrigin(0.5);
  }

  // ============================================================
  //  Blast Zone anzeigen
  // ============================================================
  _drawBlastZone(W, H) {
    const bz = this.add.graphics();
    bz.lineStyle(1, 0xff3333, 0.2);
    bz.strokeRect(200, 100, W - 400, H - 150);

    this.add.text(W / 2, 108, '— BLAST ZONE —', {
      fontSize: '11px', fontFamily: 'Arial', color: '#ff3333', alpha: 0.4
    }).setOrigin(0.5);
  }

  // ============================================================
  //  Steuerung
  //  P1: WASD + F   |   P2: Pfeiltasten + L
  // ============================================================
  _setupControls() {
    const kb = this.input.keyboard;

    this.p1Controls = {
      left:   kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:   kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      jump:   kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      attack: kb.addKey(Phaser.Input.Keyboard.KeyCodes.F),
    };

    this.p2Controls = {
      left:   kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      up:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down:   kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      jump:   kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      attack: kb.addKey(Phaser.Input.Keyboard.KeyCodes.L),
    };
  }

  // ============================================================
  //  Update – jeder Frame
  // ============================================================
  update(time, delta) {
    if (this.gameOver) return;

    const W = this.scale.width;
    const H = this.scale.height;

    // Kämpfer updaten
    if (this.fighters[0] && this.fighters[0].stocks > 0)
      this.fighters[0].update(this.p1Controls, delta);
    if (this.fighters[1] && this.fighters[1].stocks > 0)
      this.fighters[1].update(this.p2Controls, delta);

    // Out-of-bounds prüfen
    this.fighters.forEach(f => {
      if (f.stocks > 0 && f.isOutOfBounds(W, H)) {
        f.loseStock();
      }
    });
  }

  // ============================================================
  //  Spiel-Ende prüfen
  // ============================================================
  _checkGameOver() {
    const alive = this.fighters.filter(f => f.stocks > 0);
    if (alive.length <= 1) {
      this.gameOver = true;
      const winner = alive.length === 1 ? alive[0].name : 'Unentschieden';
      this.time.delayedCall(600, () => {
        this.scene.stop('HUDScene');
        this.scene.start('MenuScene', { winner });
      });
    }
  }
}
