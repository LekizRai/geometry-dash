export default class Pause extends Phaser.Scene {
    private replayButton: Phaser.GameObjects.Image
    private pauseButton: Phaser.GameObjects.Image
    private menuButton: Phaser.GameObjects.Image
    private pauseBackground: Phaser.GameObjects.Graphics
    private progressBarFrame: Phaser.GameObjects.Image
    private progressBar: Phaser.GameObjects.Graphics
    private text: Phaser.GameObjects.Text

    constructor() {
        super('pause')
    }

    public preload(): void {}

    public create(): void {
        this.text = this.add.text(0, 0, "abcxyz")
        this.text.setText("bbb")

        this.progressBar = this.add.graphics({
            fillStyle: {
                color: 0x00ff00,
            },
        }).fillRect(196, 20, 200, 20)
        this.progressBarFrame = this.add.image(400, 30, 'progress-bar')

        this.pauseBackground = this.add.graphics({
            fillStyle: {
                color: 0xffffff,
                alpha: 0.3,
            },
        }).fillRect(150, 100, 500, 250)
        this.pauseBackground.setVisible(false)

        this.pauseBackground = this.add.graphics({
            fillStyle: {
                color: 0xffffff,
                alpha: 0.3,
            },
        }).fillRoundedRect(150, 100, 500, 250, 64)
        this.pauseBackground.setVisible(false)

        this.replayButton = this.add.image(300, 225, 'resume-button').setInteractive()
        this.replayButton.setVisible(false)
        this.replayButton.on('pointerdown', () => {
            this.scene.resume('game')
            this.scene.resume('background')
            this.replayButton.setVisible(false)
            this.menuButton.setVisible(false)
            this.pauseBackground.setVisible(false)
            this.pauseButton.setVisible(true)
        })

        this.menuButton = this.add.image(500, 225, 'menu-button').setScale(0.65).setInteractive()
        this.menuButton.setVisible(false)
        this.menuButton.on('pointerdown', () => {
            this.scene.resume('background')
            this.scene.stop('game')
            this.scene.stop('pause')
            this.scene.start('start')
        })

        this.pauseButton = this.add.image(700, 24, 'pause-button').setOrigin(0, 0).setInteractive()
        this.pauseButton.on('pointerdown', () => {
            this.scene.pause('game')
            this.scene.pause('background')
            this.replayButton.setVisible(true)
            this.menuButton.setVisible(true)
            this.pauseBackground.setVisible(true)
            this.pauseButton.setVisible(false)
        })

        this.cameras.main.setViewport(0, 0, 800, 450)
        this.scene.bringToTop()
    }

    public update(time: number, timeInterval: number): void {
        this.progressBar.fillRect(196, 20, 200, 20)
    }
}
