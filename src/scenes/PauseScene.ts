import AudioManager from '../audio/AudioManager'
import GameplayScene from './GameplayScene'

export default class Pause extends Phaser.Scene {
    private gameplayScene: GameplayScene
    
    private audioManager: AudioManager

    private resumeButton: Phaser.GameObjects.Image
    private replayButton: Phaser.GameObjects.Image
    private pauseButton: Phaser.GameObjects.Image
    private menuButton: Phaser.GameObjects.Image
    private pauseBackground: Phaser.GameObjects.Graphics

    private progressBar: Phaser.GameObjects.Graphics
    private score: Phaser.GameObjects.Text
    private bestScore: Phaser.GameObjects.Text

    private congratsText: Phaser.GameObjects.Text
    // private coin: Phaser.GameObjects.Text

    constructor() {
        super('pause')
        this.audioManager = AudioManager.getInstance()
    }

    public preload(): void {
        const gameplayScene = this.scene.manager.getScene('gameplay')
        if (gameplayScene instanceof GameplayScene) {
            this.gameplayScene = gameplayScene
        }
    }

    public create(): void {
        this.score = this.add.text(620, 12, `0%`, { fontFamily: 'Comic Sans MS', fontSize: 30 })

        this.bestScore = this.add.text(18, 18, `Best score: 0%`, {
            fontFamily: 'Comic Sans MS',
            fontSize: 20,
        })

        this.congratsText = this.add.text(290, 120, `Congratulation !!`, {
            fontFamily: 'Comic Sans MS',
            fontSize: 30,
        })
        this.congratsText.setVisible(false)

        this.progressBar = this.add.graphics({
            fillStyle: {
                color: 0x00ff00,
            },
        })
        this.add.image(400, 30, 'progress-bar')

        this.pauseBackground = this.add
            .graphics({
                fillStyle: {
                    color: 0xffffff,
                    alpha: 0.3,
                },
            })
            .fillRect(150, 100, 500, 250)
        this.pauseBackground.setVisible(false)

        this.pauseBackground = this.add
            .graphics({
                fillStyle: {
                    color: 0xffffff,
                    alpha: 0.3,
                },
            })
            .fillRoundedRect(150, 100, 500, 250, 64)
        this.pauseBackground.setVisible(false)

        this.resumeButton = this.add.image(400, 225, 'resume-button').setInteractive()
        this.resumeButton.setVisible(false)
        this.resumeButton.on('pointerdown', () => {
            this.audioManager.resume(`audio-level-${this.gameplayScene.getLevel()}`)
            this.scene.resume('gameplay')
            this.scene.resume('background')
            this.resumeButton.setVisible(false)
            this.replayButton.setVisible(false)
            this.menuButton.setVisible(false)
            this.pauseBackground.setVisible(false)
            this.pauseButton.setVisible(true)
        })

        this.replayButton = this.add.image(300, 225, 'replay-button').setScale(1.3).setInteractive()
        this.replayButton.setVisible(false)
        this.replayButton.on('pointerdown', () => {
            this.gameplayScene.restart()
            this.scene.resume('gameplay')
            this.scene.resume('background')
            this.resumeButton.setVisible(false)
            this.replayButton.setVisible(false)
            this.menuButton.setVisible(false)
            this.pauseBackground.setVisible(false)
            this.congratsText.setVisible(false)
            this.pauseButton.setVisible(true)
        })

        this.menuButton = this.add.image(500, 225, 'menu-button').setScale(0.65).setInteractive()
        this.menuButton.setVisible(false)
        this.menuButton.on('pointerdown', () => {
            this.audioManager.stop(`audio-level-${this.gameplayScene.getLevel()}`)
            this.scene.resume('background')
            this.scene.stop('gameplay')
            this.scene.stop('pause')
            this.scene.start('start')
        })

        this.pauseButton = this.add.image(700, 24, 'pause-button').setOrigin(0, 0).setInteractive()
        this.pauseButton.on('pointerdown', () => {
            this.audioManager.pause(`audio-level-${this.gameplayScene.getLevel()}`)
            this.scene.pause('gameplay')
            this.scene.pause('background')
            this.resumeButton.setVisible(true)
            this.replayButton.setVisible(true)
            this.menuButton.setVisible(true)
            this.pauseBackground.setVisible(true)
            this.pauseButton.setVisible(false)
        })

        this.cameras.main.setViewport(0, 0, 800, 450)
        this.scene.bringToTop()
    }

    public displayWinWindow(): void {
        this.congratsText.setVisible(true)
        this.pauseBackground.setVisible(true)
        this.replayButton.setVisible(true)
        this.menuButton.setVisible(true)
        this.pauseButton.setVisible(false)
    }

    public update(time: number, timeInterval: number): void {
        // if (!this.gameplayScene) {
        //     const gameplayScene = this.scene.manager.getScene('gameplay')
        //     if (gameplayScene instanceof GameplayScene) {
        //         this.gameplayScene = gameplayScene
        //     }
        // }

        const value = localStorage.getItem(`level-${this.gameplayScene.getLevel()}-best`)
        if (value) {
            this.bestScore.setText(`Best score: ${value}%`)
        } else {
            this.bestScore.setText(`Best score: 0%`)
            localStorage.setItem(`level-${this.gameplayScene.getLevel()}-best`, '0')
        }

        this.progressBar.clear()
        const completePercent = this.gameplayScene.getCompletingPercent()
        this.progressBar.fillRect(196, 20, 408 * completePercent, 20)
        this.score.setText(`${Math.min(Math.ceil(completePercent * 100), 100)}%`)
    }
}
