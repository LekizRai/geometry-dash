import PlayerChoosingScene from '../player/PlayerChoosingScene'
import Background from './Background'
import Pause from './Pause'

export default class Preload extends Phaser.Scene {
    private progressBar: Phaser.GameObjects.Image

    constructor() {
        super('preload')
    }

    public preload(): void {
        // Audio
        this.load.audio('audio-level-1', 'assets/audios/levels/level-1.mp3')

        // Preload scene
        this.load.image('progress-bar', 'assets/images/preload/progress-bar.png')

        // Start scene
        this.load.image('play-button', 'assets/images/buttons/play.png')
        this.load.image('player-button', 'assets/images/buttons/player-choosing.png')
        this.load.image('mode-button', 'assets/images/buttons/more-game.png')

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

        // Pause scene
        this.load.image('resume-button', 'assets/images/buttons/resume.png')
        this.load.image('menu-button', 'assets/images/buttons/menu.png')
        this.load.image('pause-button', 'assets/images/buttons/pause.png')

        const loadingBarBackground = this.add.graphics({
            fillStyle: {
                color: 0xffffff,
            },
        })
        loadingBarBackground.fillRect(
            100,
            (this.game.config.height as number) / 2 + 100,
            (this.game.config.width as number) - 200,
            30
        )

        const loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x00ff00,
            },
        })
        this.load.on('progress', (percent: number) => {
            console.log(percent)
            loadingBar.fillRect(
                100,
                (this.game.config.height as number) / 2 + 100,
                ((this.game.config.width as number) - 200) * percent,
                30
            )
        })
    }

    public create(): void {
        const backgroundScene = new Background()
        this.scene.add('background', backgroundScene)

        const playerChoosingScene = new PlayerChoosingScene()
        this.scene.add('player-choosing', playerChoosingScene)

        const pauseScene = new Pause()
        this.scene.add('pause', pauseScene)

        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.scene.stop('init')
                this.scene.stop('preload')
                this.scene.start('start')
            },
        })
    }

    public update(time: number, timeInterval: number): void {}
}
