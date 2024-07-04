import GameplayScene from '../GameplayScene'

export default class LevelChoosingScene extends Phaser.Scene {
    constructor() {
        super('level-choosing')
    }

    preload(): void {
        this.add.text(260, 50, 'Choose your level', { fontFamily: 'Comic Sans MS', fontSize: 32 })
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
        this.add.text(245, 213, '1', {
            fontFamily: 'Comic Sans MS',
            fontSize: 20,
            color: '#000000',
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
        this.add.text(345, 213, '2', {
            fontFamily: 'Comic Sans MS',
            fontSize: 20,
            color: '#000000',
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
        this.add.text(445, 213, '3', {
            fontFamily: 'Comic Sans MS',
            fontSize: 20,
            color: '#000000',
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
        this.add.text(543, 213, '4', {
            fontFamily: 'Comic Sans MS',
            fontSize: 20,
            color: '#000000',
        })
    }

    create(): void {}
}
