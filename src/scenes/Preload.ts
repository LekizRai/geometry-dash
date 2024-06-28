import Background from "./Background"
import Pause from "./Pause"

export default class Preload extends Phaser.Scene {
    private progressBar: Phaser.GameObjects.Image

    constructor() {
        super('preload')
    }

    public preload(): void {
        // Preload scene
        this.load.image('progress-bar', 'assets/progress-bars/GJ_progressBar_001.png')

        // Start scene
        this.load.image('play-button', 'assets/buttons/GJ_playBtn_001.png')
        this.load.image('player-button', 'assets/buttons/GJ_garageBtn_001.png')
        this.load.image('mode-button', 'assets/buttons/GJ_moreGamesBtn_001.png')

        // Background scene

        // Game scene
        this.load.image('background', 'assets/backgrounds/game_bg_01_001.png')
        this.load.image('ground', 'assets/grounds/groundSquare_01_001.png')
        this.load.image('spike', 'assets/spikes/spritesheet.png')
        this.load.image('block', 'assets/blocks/spritesheet.png')
        this.load.image('player', 'assets/players/player-30/player_30_001.png')
        this.load.image('pause-button', 'assets/buttons/GJ_pauseEditorBtn_001.png')
        this.load.atlas('fire', 'assets/fire/fire.png', 'assets/fire/fire_atlas.json')
        this.load.atlas(
            'gameover',
            'assets/gameover/gameover.png',
            'assets/gameover/gameover_atlas.json'
        )
        this.load.tilemapTiledJSON('tile-map', 'assets/geometry-dash-tile-map.tmj')

        // Pause scene
        this.load.image('replay-button', 'assets/buttons/GJ_playBtn2_001.png')
        this.load.image('pause-button', 'assets/buttons/GJ_playBtn2_001.png')

        const loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff,
            },
        })
        this.load.on('progress', (percent: number) => {
            loadingBar.fillRect(
                0,
                (this.game.config.height as number) / 2,
                (this.game.config.width as number) * percent,
                50
            )
        })
    }
    
    public create(): void {
        // this.scene.start('start')
        const backgroundScene = new Background()
        this.scene.add('background', backgroundScene)

        const pauseScene = new Pause()
        this.scene.add('pause', pauseScene)

        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.scene.start('start')
            },
        })
    }

    public update(time: number, timeInterval: number): void {}
}
