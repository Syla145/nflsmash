// ============================================================
//  Fighter.js – Basis-Klasse für alle Charaktere
//  Mechaniken: Bewegung, Sprung, Angriff, Knockback, Stocks
// ============================================================

export class Fighter {
  constructor(scene, x, y, playerIndex, config = {}) {
    this.scene = scene;
    this.playerIndex = playerIndex; // 0 = P1, 1 = P2

    // --- Stats (können pro Charakter überschrieben werden) ---
    this.stats = {
      walkSpeed:    220,
      runSpeed:     360,
      jumpPower:    -750,
      airSpeed:     200,
      fallSpeed:    900,     // max. Fallgeschwindigkeit
      fastFallSpeed:1400,
      weight:       100,     // beeinflusst Knockback-Resistenz
      jumpCount:    2,       // Doppelsprung
      ...config.stats
    };

    this.name    = config.name    || `P${playerIndex + 1}`;
    this.color   = config.color   || (playerIndex === 0 ? 0x00ff88 : 0xff4466);
    this.stocks  = 4;
    this.damage  = 0;        // Schadensprozentwert (0–999%)
    this.jumpsLeft = this.stats.jumpCount;

    // --- Zustände ---
    this.state = {
      attacking:  false,
      hitstun:    0,
      shielding:  false,
      fastFalling:false,
      facingRight: playerIndex === 0,
    };

    // --- Phaser-Sprite (einfaches Rechteck als Placeholder) ---
    this.sprite = scene.physics.add.rectangle(x, y, 48, 64, this.color);
    this.sprite.setMaxVelocity(800, 1800);
    this.sprite.setDragX(1200);
    this.sprite.owner = this;

    // Nummern-Label
    this.label = scene.add.text(x, y - 40, this.name, {
      fontSize: '14px', fontFamily: 'Arial Black',
      color: '#ffffff', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    // Schadensanzeige über dem Charakter
    this.damageLabel = scene.add.text(x, y - 56, '0%', {
      fontSize: '12px', fontFamily: 'Arial Black',
      color: '#ffdd00', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    // Hitbox-Objekte für Angriffe
    this.hitbox = null;
    this.attackCooldown = 0;
  }

  // ============================================================
  //  Update – wird jeden Frame aufgerufen
  // ============================================================
  update(cursors, delta) {
    const body  = this.sprite.body;
    const onGround = body.blocked.down;

    // Hitstun reduzieren
    if (this.state.hitstun > 0) {
      this.state.hitstun -= delta;
      this._updateLabelPositions();
      return; // Während Hitstun keine Kontrolle
    }

    if (this.attackCooldown > 0) this.attackCooldown -= delta;

    // --- Bewegung ---
    if (cursors.left.isDown) {
      const spd = onGround ? this.stats.runSpeed : this.stats.airSpeed;
      this.sprite.body.setVelocityX(-spd);
      this.state.facingRight = false;
    } else if (cursors.right.isDown) {
      const spd = onGround ? this.stats.runSpeed : this.stats.airSpeed;
      this.sprite.body.setVelocityX(spd);
      this.state.facingRight = true;
    }

    // --- Sprung ---
    if (Phaser.Input.Keyboard.JustDown(cursors.jump)) {
      if (onGround) {
        this.jumpsLeft = this.stats.jumpCount;
      }
      if (this.jumpsLeft > 0) {
        this.sprite.body.setVelocityY(this.stats.jumpPower);
        this.jumpsLeft--;
        this.state.fastFalling = false;
      }
    }

    // --- Fast Fall ---
    if (!onGround && cursors.down.isDown && body.velocity.y > 0) {
      this.state.fastFalling = true;
    }
    if (this.state.fastFalling) {
      body.setMaxVelocityY(this.stats.fastFallSpeed);
    } else {
      body.setMaxVelocityY(this.stats.fallSpeed);
    }

    // Landung: Sprünge zurücksetzen
    if (onGround) {
      this.jumpsLeft = this.stats.jumpCount;
      this.state.fastFalling = false;
    }

    // --- Angriff ---
    if (Phaser.Input.Keyboard.JustDown(cursors.attack) && this.attackCooldown <= 0) {
      this._doAttack(cursors.down.isDown, cursors.up.isDown);
    }

    // Sprite optisch spiegeln (Tint zeigt Richtung)
    this.sprite.setAlpha(this.state.facingRight ? 1.0 : 0.85);

    this._updateLabelPositions();
  }

  // ============================================================
  //  Angriff ausführen
  // ============================================================
  _doAttack(down, up) {
    this.state.attacking = true;
    this.attackCooldown = 400; // ms

    const dir   = this.state.facingRight ? 1 : -1;
    const ox    = this.sprite.x + dir * 50;
    const oy    = up   ? this.sprite.y - 40
                : down ? this.sprite.y + 40
                :        this.sprite.y;

    // Hitbox temporär erzeugen
    const hb = this.scene.add.rectangle(ox, oy, 60, 50, 0xffff00, 0.4);
    this.scene.physics.add.existing(hb, true); // static

    // Kollision mit Gegnern prüfen
    this.scene.fighters.forEach(other => {
      if (other === this) return;
      const bounds1 = new Phaser.Geom.Rectangle(ox - 30, oy - 25, 60, 50);
      const bounds2 = other.sprite.getBounds();
      if (Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2)) {
        other.receiveHit(12, dir, up ? -1 : 0);
      }
    });

    // Hitbox nach kurzer Zeit entfernen
    this.scene.time.delayedCall(120, () => {
      hb.destroy();
      this.state.attacking = false;
    });

    // Visuelles Feedback
    this.sprite.setFillStyle(0xffffff);
    this.scene.time.delayedCall(80, () => this.sprite.setFillStyle(this.color));
  }

  // ============================================================
  //  Treffer erhalten – Smash Bros Knockback-Formel
  // ============================================================
  receiveHit(baseDamage, dirX, dirY = 0) {
    this.damage += baseDamage;

    // Knockback-Formel (angelehnt an Smash Bros):
    // kb = (damage * 0.1 + 0.1) * (baseDamage + 5) * (200 / (weight + 100)) * 1.4 + 4
    const kb = ((this.damage * 0.1 + 0.1) * (baseDamage + 5) *
                (200 / (this.stats.weight + 100)) * 1.4 + 4) * 18;

    const kbX = dirX * kb;
    const kbY = dirY !== 0 ? dirY * kb * 0.8 : -kb * 0.6;

    this.sprite.body.setVelocity(kbX, kbY);
    this.state.hitstun = Math.min(kb * 1.2, 600); // max 600ms Hitstun

    // Treffer-Flash
    this.sprite.setFillStyle(0xff0000);
    this.scene.time.delayedCall(150, () => this.sprite.setFillStyle(this.color));

    // Kamera-Shake
    this.scene.cameras.main.shake(80, 0.006);
  }

  // ============================================================
  //  Stock verlieren & Respawn
  // ============================================================
  loseStock() {
    this.stocks--;
    this.damage = 0;
    this.scene.events.emit('stockLost', this.playerIndex, this.stocks);

    if (this.stocks <= 0) {
      this.scene.events.emit('playerOut', this.playerIndex);
      this.sprite.setVisible(false);
      this.label.setVisible(false);
      this.damageLabel.setVisible(false);
      return;
    }

    // Respawn
    const spawnX = this.playerIndex === 0 ? 320 : 960;
    this.sprite.setPosition(spawnX, 200);
    this.sprite.body.setVelocity(0, 0);
    this.state.hitstun = 0;

    // Spawn-Schutz (kurz transparent)
    this.sprite.setAlpha(0.5);
    this.scene.time.delayedCall(1500, () => this.sprite.setAlpha(1.0));
  }

  // ============================================================
  //  Hilfsfunktionen
  // ============================================================
  _updateLabelPositions() {
    this.label.setPosition(this.sprite.x, this.sprite.y - 42);
    this.damageLabel.setPosition(this.sprite.x, this.sprite.y - 58);
    this.damageLabel.setText(`${Math.floor(this.damage)}%`);
    // Farbe: grün → gelb → rot je nach %
    const p = Math.min(this.damage / 150, 1);
    const r = Math.floor(p * 255);
    const g = Math.floor((1 - p) * 200);
    this.damageLabel.setColor(`rgb(${r},${g},50)`);
  }

  isOutOfBounds(width, height) {
    return (
      this.sprite.x < -200 || this.sprite.x > width + 200 ||
      this.sprite.y < -300 || this.sprite.y > height + 100
    );
  }

  destroy() {
    this.sprite.destroy();
    this.label.destroy();
    this.damageLabel.destroy();
  }
}
