import { GameScene } from './scenes/GameScene.js';
import { HUDScene } from './scenes/HUDScene.js';
import { MenuScene } from './scenes/MenuScene.js';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1800 },
      debug: false   // auf true setzen um Hitboxen zu sehen
    }
  },
  scene: [MenuScene, GameScene, HUDScene]
};

const game = new Phaser.Game(config);
