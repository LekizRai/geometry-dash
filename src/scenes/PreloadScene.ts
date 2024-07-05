import PlayerChoosingScene from './start-scene/PlayerChoosingScene'
import Background from './BackgroundScene'
import Pause from './PauseScene'
import LevelChoosingScene from './start-scene/LevelChoosingScene'
import AudioManager from '../audio/AudioManager'

export default class Preload extends Phaser.Scene {
    constructor() {
        super('preload')
    }

    public preload(): void {
        // Audio
        this.load.audio('audio-level-1', 'assets/audios/levels/level-1.mp3')
        this.load.audio('audio-level-2', 'assets/audios/levels/level-2.mp3')
        this.load.audio('audio-level-3', 'assets/audios/levels/level-3.mp3')
        this.load.audio('audio-level-4', 'assets/audios/levels/level-4.mp3')
        this.load.audio('audio-dead', 'assets/audios/effects/dead.mp3')
        this.load.audio('audio-win', 'assets/audios/effects/win.mp3')
        this.load.audio('audio-click', 'assets/audios/effects/click.mp3')
        this.load.audio('audio-menu', 'assets/audios/menu/menu.mp3')

        // Start scene
        this.load.image('play-button', 'assets/images/buttons/play.png')
        this.load.image('player-button', 'assets/images/buttons/player-choosing.png')
        this.load.image('more-button', 'assets/images/buttons/more-game.png')
        this.load.image('level-button', 'assets/images/buttons/level.png')

        // Game scene
        this.load.image('geometry-dash', 'assets/images/tileset/spritesheet.png')

        this.load.image('player-1', 'assets/images/players/player-1/player.png')
        this.load.image('particle-1', 'assets/images/players/player-1/particle.png')
        this.load.image('ship-1', 'assets/images/players/player-1/ship.png')

        this.load.image('player-2', 'assets/images/players/player-2/player.png')
        this.load.image('particle-2', 'assets/images/players/player-2/particle.png')
        this.load.image('ship-2', 'assets/images/players/player-2/ship.png')

        this.load.tilemapTiledJSON('tile-map-level-1', 'assets/tilemaps/level-1.tmj')
        this.load.tilemapTiledJSON('tile-map-level-2', 'assets/tilemaps/level-2.tmj')
        this.load.tilemapTiledJSON('tile-map-level-3', 'assets/tilemaps/level-3.tmj')
        this.load.tilemapTiledJSON('tile-map-level-4', 'assets/tilemaps/level-win.tmj')

        // Pause scene
        this.load.image('resume-button', 'assets/images/buttons/resume.png')
        this.load.image('replay-button', 'assets/images/buttons/replay.png')
        this.load.image('menu-button', 'assets/images/buttons/menu.png')
        this.load.image('pause-button', 'assets/images/buttons/pause.png')

        const loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x00ff00,
            },
        })
        this.load.on('progress', (percent: number) => {
            loadingBar.fillRect(94, 325, 612 * percent, 30)
        })

        this.add.image(400, 340, 'progress-bar').setScale(1.5)
    }

    public create(): void {
        const audioManager = AudioManager.getInstance()
        audioManager.add('audio-level-1', this.sound.add('audio-level-1'))
        audioManager.add('audio-level-2', this.sound.add('audio-level-2'))
        audioManager.add('audio-level-3', this.sound.add('audio-level-3'))
        audioManager.add('audio-level-4', this.sound.add('audio-level-4'))
        audioManager.add('audio-dead', this.sound.add('audio-dead'))
        audioManager.add('audio-win', this.sound.add('audio-win'))
        audioManager.add('audio-click', this.sound.add('audio-click'))

        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.scene.stop('init')
                this.scene.stop('preload')
                this.scene.start('start')
            },
        })
    }
}
