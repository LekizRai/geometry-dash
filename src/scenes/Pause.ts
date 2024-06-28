export default class Pause extends Phaser.Scene {
    private parentScene: Phaser.Scene
    private replayButton: Phaser.GameObjects.Image
    private pauseButton: Phaser.GameObjects.Image
    constructor() {
        super('pause')
        // this.parentScene = parentScene
    }

    public preload(): void {
        this.load.image('replay-button', 'assets/buttons/GJ_playBtn2_001.png')
        this.load.image('pause-button', 'assets/buttons/GJ_playBtn2_001.png')
    }

    public create(): void {
        this.replayButton = this.add.image(400, 225, 'replay-button').setInteractive()
        this.replayButton.setVisible(false)
        this.replayButton.on('pointerdown', () => {
            this.scene.resume('game')
            this.replayButton.setVisible(false)
            this.pauseButton.setVisible(true)
        })

        this.pauseButton = this.add.image(724, 0, 'pause-button').setOrigin(0, 0).setInteractive()
        this.pauseButton.on('pointerdown', () => {
            this.scene.pause('game')
            this.pauseButton.setVisible(false)
            this.replayButton.setVisible(true)
        })

        this.cameras.main.setViewport(0, 0, 800, 450)
        this.scene.bringToTop()
    }
}
