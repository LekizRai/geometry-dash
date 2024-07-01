import Background from './Background'
import Pause from './Pause'

export default class Start extends Phaser.Scene {
    private playButton: Phaser.GameObjects.Image
    private playerChoosingButton: Phaser.GameObjects.Image
    private modeGameButton: Phaser.GameObjects.Image

    constructor() {
        super('start')
    }

    public preload(): void {}

    public create(): void {
        this.cameras.main.setSize(800, 450)

        this.add.image(150, 50, 'geometry-dash-logo').setOrigin(0, 0).setScale(1.2)

        this.playButton = this.add.image(400, 250, 'play-button')
        this.playButton.setInteractive()
        this.playButton.on('pointerover', () => {
            this.playButton.setAlpha(0.8)
        })
        this.playButton.on('pointerout', () => {
            this.playButton.setAlpha(1)
        })
        this.playButton.on('pointerdown', () => {
            this.playButton.setAlpha(0.5)
        })
        this.playButton.on('pointerup', () => {
            this.scene.start('game')
        })
        this.input.on('pointerup', () => {
            this.playButton.setAlpha(1)
        })

        this.playerChoosingButton = this.add.sprite(200, 250, 'player-button')
        this.playerChoosingButton.setInteractive()
        this.playerChoosingButton.on('pointerover', () => {
            this.add.tween({
                targets: this.playerChoosingButton,
                scale: 0.9,
                duration: 100,
            })
        })
        this.playerChoosingButton.on('pointerout', () => {
            this.add.tween({
                targets: this.playerChoosingButton,
                scale: 1,
                duration: 100,
            })
        })

        this.modeGameButton = this.add.image(600, 250, 'mode-button')
        this.modeGameButton.setInteractive()
        this.modeGameButton.on('pointerover', () => {
            this.add.tween({
                targets: this.modeGameButton,
                scale: 0.9,
                duration: 100,
            })
        })
        this.modeGameButton.on('pointerout', () => {
            this.add.tween({
                targets: this.modeGameButton,
                scale: 1,
                duration: 100,
            })
        })

        const win = this.add.zone(0, 0, 800, 450).setOrigin(0)
        this.scene.launch('background')
    }
}
