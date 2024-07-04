import GameplayScene from '../GameplayScene'

export default class LevelChoosingScene extends Phaser.Scene {
    constructor() {
        super('level-choosing')
    }

    preload(): void {
        this.add.text(260, 50, 'Chooing your level', { fontFamily: 'Comic Sans MS', fontSize: 32 })
        this.add
            .graphics({
                fillStyle: {
                    color: 0xffffff,
                    alpha: 0.3,
                },
            })
            .fillRoundedRect(150, 100, 500, 250, 64)
        const level1 = this.add.image(250, 225, 'level-button').setInteractive()
        level1.on('pointerdown', () => {
            this.scene.stop('level-choosing')
            const gameplayScene = this.scene.manager.getScene('gameplay')
            if (gameplayScene instanceof GameplayScene) {
                gameplayScene.setLevel(1)
            }
            this.scene.start('start')
        })

        const level2 = this.add.image(350, 225, 'level-button').setInteractive()
        level2.on('pointerdown', () => {
            this.scene.stop('level-choosing')
            const gameplayScene = this.scene.manager.getScene('gameplay')
            if (gameplayScene instanceof GameplayScene) {
                gameplayScene.setLevel(2)
            }
            this.scene.start('start')
        })

        const level3 = this.add.image(450, 225, 'level-button').setInteractive()
        level3.on('pointerdown', () => {
            this.scene.stop('level-choosing')
            const gameplayScene = this.scene.manager.getScene('gameplay')
            if (gameplayScene instanceof GameplayScene) {
                gameplayScene.setLevel(3)
            }
            this.scene.start('start')
        })

        const level4 = this.add.image(550, 225, 'level-button').setInteractive()
        level4.on('pointerdown', () => {
            this.scene.stop('level-choosing')
            const gameplayScene = this.scene.manager.getScene('gameplay')
            if (gameplayScene instanceof GameplayScene) {
                gameplayScene.setLevel(4)
            }
            this.scene.start('start')
        })
    }

    create(): void {}
}
