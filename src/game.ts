import Phaser from 'phaser'

import Preload from './scenes/PreloadScene'
import Start from './scenes/start-scene/StartScene'
import Scene from './scenes/GameplayScene'
import Init from './scenes/InitScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // 8264.46
            debug: true,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Init, Preload, Start, Scene],
}

export default new Phaser.Game(config)
