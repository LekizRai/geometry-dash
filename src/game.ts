import Phaser from 'phaser'
import configs from './configs/configs'
import BackgroundScene from './scenes/BackgroundScene'
import StartScene from './scenes/start-scene/StartScene'
import GameplayScene from './scenes/GameplayScene'
import PreloadScene from './scenes/PreloadScene'
import InitScene from './scenes/InitScene'
import PlayerChoosingScene from './scenes/start-scene/PlayerChoosingScene'
import LevelChoosingScene from './scenes/start-scene/LevelChoosingScene'
import PauseScene from './scenes/PauseScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: configs.GAME_WIDTH,
    height: configs.GAME_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: configs.DEBUG,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [InitScene, PreloadScene, BackgroundScene, PlayerChoosingScene, LevelChoosingScene, StartScene, PauseScene, GameplayScene],
}

export default new Phaser.Game(config)
