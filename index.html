// ============================================================
//  MenuScene.js – Hauptmenü & Siegerbildschirm
// ============================================================

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  init(data) {
    this.winner = data?.winner || null;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Hintergrund
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x050510, 0x050510, 0x0d1a2e, 0x0d1a2e, 1);
    bg.fillRect(0, 0, W, H);

    // Partikel-Effekt (Sterne)
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H);
      const r = Phaser.Math.FloatBetween(0.5, 2.5);
      const a = Phaser.Math.FloatBetween(0.2, 0.8);
      this.add.circle(x, y, r, 0xffffff, a);
    }

    // Football-Emoji als dekoratives Element
    this.add.text(W / 2, H * 0.15, '🏈', {
      fontSize: '64px'
    }).setOrigin(0.5);

    // Titel
    this.add.text(W / 2, H * 0.30, 'FOOTBALL', {
      fontSize: '72px',
      fontFamily: 'Arial Black',
      color: '#ffcc00',
      stroke: '#aa6600',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.44, 'LEAGUE OF LEGENDS', {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      stroke: '#003366',
      strokeThickness: 5,
    }).setOrigin(0.5);

    // Sterne-Dekoration
    this.add.text(W / 2, H * 0.53, '★  ★  ★  ★  ★', {
      fontSize: '20px',
      color: '#ffaa00',
    }).setOrigin(0.5);

    if (this.winner) {
      // --- Siegerbildschirm ---
      const isDraw = this.winner === 'Unentschieden';

      this.add.text(W / 2, H * 0.63, isDraw ? '🤝 UNENTSCHIEDEN!' : `🏆 ${this.winner} GEWINNT!`, {
        fontSize: '36px',
        fontFamily: 'Arial Black',
        color: isDraw ? '#aaaaff' : '#ffdd00',
        stroke: '#000000',
        strokeThickness: 5,
      }).setOrigin(0.5);
    }

    // Start-Button
    const btnY = this.winner ? H * 0.80 : H * 0.68;
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x1a5fa0, 1);
    btnBg.fillRoundedRect(W / 2 - 160, btnY - 28, 320, 56, 12);
    btnBg.lineStyle(2, 0x44aaff, 0.8);
    btnBg.strokeRoundedRect(W / 2 - 160, btnY - 28, 320, 56, 12);

    const btnText = this.add.text(W / 2, btnY, this.winner ? '▶  NOCHMAL SPIELEN' : '▶  SPIEL STARTEN', {
      fontSize: '22px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Button interaktiv machen
    const btnZone = this.add.zone(W / 2, btnY, 320, 56).setInteractive();
    btnZone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0x2a7fd0, 1);
      btnBg.fillRoundedRect(W / 2 - 160, btnY - 28, 320, 56, 12);
      btnBg.lineStyle(2, 0x88ccff, 1);
      btnBg.strokeRoundedRect(W / 2 - 160, btnY - 28, 320, 56, 12);
      this.input.setDefaultCursor('pointer');
    });
    btnZone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0x1a5fa0, 1);
      btnBg.fillRoundedRect(W / 2 - 160, btnY - 28, 320, 56, 12);
      btnBg.lineStyle(2, 0x44aaff, 0.8);
      btnBg.strokeRoundedRect(W / 2 - 160, btnY - 28, 320, 56, 12);
      this.input.setDefaultCursor('default');
    });
    btnZone.on('pointerdown', () => this._startGame());

    // Leertaste zum Starten
    this.input.keyboard.once('keydown-SPACE', () => this._startGame());
    this.input.keyboard.once('keydown-ENTER', () => this._startGame());

    // Steuerungsübersicht
    this._drawControls(W, H);

    // Pulsier-Animation auf "DRÜCKE LEERTASTE"
    const pressText = this.add.text(W / 2, btnY + 55, 'oder LEERTASTE drücken', {
      fontSize: '14px', fontFamily: 'Arial', color: '#667788'
    }).setOrigin(0.5);
    this.tweens.add({
      targets: pressText, alpha: 0.2, duration: 900,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    // Versionsnummer
    this.add.text(W - 10, H - 10, 'v0.1 – Prototyp', {
      fontSize: '11px', fontFamily: 'Arial', color: '#334455'
    }).setOrigin(1, 1);
  }

  _drawControls(W, H) {
    const y = H * 0.91;
    this.add.text(W / 2, y, '🎮  STEUERUNG', {
      fontSize: '13px', fontFamily: 'Arial Black', color: '#556677'
    }).setOrigin(0.5);

    this.add.text(W * 0.3, y + 20,
      'P1:  A/D = Bewegen  |  W = Springen  |  S = Fast Fall  |  F = Angriff',
      { fontSize: '11px', fontFamily: 'Arial', color: '#445566' }
    ).setOrigin(0.5);

    this.add.text(W * 0.3, y + 36,
      'P2:  ←/→ = Bewegen  |  ↑ = Springen  |  ↓ = Fast Fall  |  L = Angriff',
      { fontSize: '11px', fontFamily: 'Arial', color: '#445566' }
    ).setOrigin(0.5);
  }

  _startGame() {
    this.scene.start('GameScene');
  }
}
