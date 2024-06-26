import Phaser from 'phaser'

import Preload from "./scenes/Preload"
import Scene from "./scenes/Scene"

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 2000},
            debug: false,
        }
    },
    scene: [Preload, Scene]
}

export default new Phaser.Game(config)