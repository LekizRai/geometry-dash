export default class PlayerChoosingScene extends Phaser.Scene {
    constructor() {
        super('player-choosing')
    }

    preload(): void {
        this.add.text(250, 50, 'Chooing your player', { fontFamily: 'Comic Sans MS', fontSize: 32 })
        this.add
            .graphics({
                fillStyle: {
                    color: 0xffffff,
                    alpha: 0.3,
                },
            })
            .fillRoundedRect(150, 100, 500, 250, 64)
        const player1 = this.add.image(300, 225, 'player-1').setInteractive()
        player1.on('pointerdown', () => {
            this.scene.stop('player-choosing')
            this.scene.start('start')
        })
        const player2 = this.add.image(500, 225, 'player-2').setInteractive()
        player2.on('pointerdown', () => {
            this.scene.stop('player-choosing')
            this.scene.start('start')
        })
    }

    create(): void {}
}
