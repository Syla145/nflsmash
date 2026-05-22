// ============================================================
//  HUDScene.js – Heads-Up-Display
//  Zeigt: Schadensprozent, Stocks, Spielernamen
//  Läuft parallel zur GameScene
// ============================================================

export class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' });
  }

  init(data) {
    this.fighters = data.fighters || [];
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Semi-transparenter HUD-Balken unten
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0x000000, 0.65);
    hudBg.fillRect(0, H - 130, W, 130);
    hudBg.lineStyle(1, 0x4488aa, 0.5);
    hudBg.lineBetween(0, H - 130, W, H - 130);

    // Mittel-Divider
    hudBg.lineStyle(1, 0x334455, 0.8);
    hudBg.lineBetween(W / 2, H - 130, W / 2, H);

    // Stocks-Anzeige und % für jeden Spieler
    this.hudElements = this.fighters.map((fighter, i) => {
      const side = i === 0 ? 'left' : 'right';
      const cx   = i === 0 ? W * 0.25 : W * 0.75;
      const cy   = H - 65;

      // Spieler-Farbe als Balken oben
      const colorBar = this.add.graphics();
      colorBar.fillStyle(fighter.color, 0.8);
      colorBar.fillRect(i === 0 ? 0 : W / 2, H - 130, W / 2, 4);

      // Name
      const nameText = this.add.text(cx, cy - 28, fighter.name, {
        fontSize: '20px',
        fontFamily: 'Arial Black',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);

      // Schadensprozentwert – groß
      const dmgText = this.add.text(cx, cy + 2, '0%', {
        fontSize: '42px',
        fontFamily: 'Arial Black',
        color: '#00ff88',
        stroke: '#000000',
        strokeThickness: 5,
      }).setOrigin(0.5);

      // Stocks als Symbole (kleine Kreise)
      const stockIcons = [];
      for (let s = 0; s < 4; s++) {
        const sx = cx - 30 + s * 22;
        const sy = cy + 46;
        const icon = this.add.circle(sx, sy, 8, fighter.color, 1);
        icon.setStrokeStyle(2, 0xffffff, 0.6);
        stockIcons.push(icon);
      }

      return { dmgText, stockIcons, nameText, fighter };
    });

    // Titel oben mittig
    this.add.text(W / 2, 18, 'FOOTBALL LEAGUE OF LEGENDS', {
      fontSize: '16px',
      fontFamily: 'Arial Black',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 3,
      alpha: 0.9
    }).setOrigin(0.5);

    // Timer-Platzhalter
    this.timerText = this.add.text(W / 2, 50, 'FREE FOR ALL', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    // Steuerungshinweis (verschwindet nach 4 Sekunden)
    const hint = this.add.text(W / 2, H - 145, 'P1: WASD + F  |  P2: Pfeiltasten + L', {
      fontSize: '12px', fontFamily: 'Arial', color: '#888888'
    }).setOrigin(0.5);
    this.tweens.add({
      targets: hint,
      alpha: 0,
      delay: 3500,
      duration: 800
    });
  }

  update() {
    if (!this.hudElements) return;

    this.hudElements.forEach(({ dmgText, stockIcons, fighter }) => {
      // Schadensprozentwert aktualisieren
      const pct = Math.floor(fighter.damage);
      dmgText.setText(`${pct}%`);

      // Farbe: grün → gelb → orange → rot
      if (pct < 50)       dmgText.setColor('#00ff88');
      else if (pct < 100) dmgText.setColor('#ffdd00');
      else if (pct < 150) dmgText.setColor('#ff8800');
      else                dmgText.setColor('#ff2244');

      // Stocks aktualisieren: ausgefüllte = verbleibend, leere = verloren
      stockIcons.forEach((icon, s) => {
        if (s < fighter.stocks) {
          icon.setFillStyle(fighter.color, 1);
          icon.setScale(1);
        } else {
          icon.setFillStyle(0x222222, 1);
          icon.setScale(0.7);
        }
      });
    });
  }
}
