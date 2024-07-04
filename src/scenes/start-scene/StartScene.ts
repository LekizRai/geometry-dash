import GameplayScene from "../GameplayScene"

export default class Start extends Phaser.Scene {
    private playButton: Phaser.GameObjects.Image
    private playerChoosingButton: Phaser.GameObjects.Image
    private moreGameButton: Phaser.GameObjects.Image

    constructor() {
        super('start')
    }

    public preload(): void {}

    public create(): void {
        this.cameras.main.setSize(800, 450)

        this.add.image(150, 50, 'geometry-dash-logo').setOrigin(0, 0).setScale(1.2)
        const gameplayScene = this.scene.manager.getScene('gameplay')
        if (gameplayScene instanceof GameplayScene) {
            this.add.text(310, 330, `Your player: ${gameplayScene.getPlayerIndex()}`, { fontFamily: 'Comic Sans MS', fontSize: 28})
            this.add.text(320, 380, `Your level: ${gameplayScene.getLevel()}`, { fontFamily: 'Comic Sans MS', fontSize: 28})
        }

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
            this.scene.stop('start')
            this.scene.start('gameplay')
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
        this.playerChoosingButton.on('pointerdown', () => {
            this.scene.stop('start')
            this.scene.start('player-choosing')
        })

        this.moreGameButton = this.add.image(600, 250, 'more-button')
        this.moreGameButton.setInteractive()
        this.moreGameButton.on('pointerover', () => {
            this.add.tween({
                targets: this.moreGameButton,
                scale: 0.9,
                duration: 100,
            })
        })
        this.moreGameButton.on('pointerout', () => {
            this.add.tween({
                targets: this.moreGameButton,
                scale: 1,
                duration: 100,
            })
        })
        this.moreGameButton.on('pointerdown', () => {
            this.scene.stop('start')
            this.scene.start('level-choosing')
        })

        const win = this.add.zone(0, 0, 800, 450).setOrigin(0)
        this.scene.launch('background')
    }
}
