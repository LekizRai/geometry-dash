import Pause from "./Pause"

export default class Start extends Phaser.Scene {
    private playButton: Phaser.GameObjects.Image
    private playerChoosingButton: Phaser.GameObjects.Image
    private modeGameButton: Phaser.GameObjects.Image

    constructor() {
        super('start')
    }

    public preload(): void {
        this.load.image('play-button', 'assets/buttons/GJ_playBtn_001.png')
        this.load.image('player-button', 'assets/buttons/GJ_garageBtn_001.png')
        this.load.image('mode-button', 'assets/buttons/GJ_moreGamesBtn_001.png')
    }

    public create(): void {
        this.add.rectangle(0, 0, 800, 450, 0xffff00).setOrigin(0, 0)
        this.cameras.main.setSize(800, 450)

        this.playButton = this.add.image(400, 225, 'play-button')
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

        this.playerChoosingButton = this.add.sprite(200, 225, 'player-button')
        this.playerChoosingButton.setInteractive()
        this.playerChoosingButton.on('pointerover', () => {
            this.add.tween({
                targets: this.playerChoosingButton,
                scale: 0.9,
                duration: 100,
            })
            // this.playerChoosingButton.setAlpha(0)
        })
        this.playerChoosingButton.on('pointerout', () => {
            this.add.tween({
                targets: this.playerChoosingButton,
                scale: 1,
                duration: 100,
            })
        })
        // this.input.setDraggable(this.playerChoosingButton, true)
        // this.playerChoosingButton.on('drag', (pointer: any, dragX: any, dragY: any) => {
        //     this.playerChoosingButton.setX(dragX)
        //     this.playerChoosingButton.setY(dragY)
        // })
        // // will disallow to drag the circle after 5 seconds
        // this.time.addEvent({
        //     delay: 5000,
        //     callback: () => {this.input.setDraggable(this.playerChoosingButton, false)},
        // })

        this.modeGameButton = this.add.image(600, 225, 'mode-button')
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

        const win = this.add.zone(0, 0, 100, 100).setInteractive().setOrigin(0);
        const pauseScene = new Pause()
        // this.scene.add('pause', pauseScene, true)
    }
}
