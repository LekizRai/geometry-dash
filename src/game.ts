import Phaser from 'phaser'

import Preload from './scenes/Preload'
import Start from './scenes/Start'
import Scene from './scenes/Scene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 6400 },
            debug: true,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Preload, Start, Scene],
}

export default new Phaser.Game(config)
