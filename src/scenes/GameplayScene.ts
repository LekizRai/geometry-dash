import AudioManager from '../audio/AudioManager'
import GameMap from '../game-levels/GameMap'
import Player from '../player/Player'
import PauseScene from './PauseScene'

export default class Scene extends Phaser.Scene {
    private level: number
    private playerIndex: number

    // private audio: Phaser.Sound.WebAudioSound
    private audio: Phaser.Sound.BaseSound
    private audioManager: AudioManager

    private gameMap: GameMap
    private mapWidth: number

    private player: Player

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private camera: Phaser.Cameras.Scene2D.Camera
    private cameraFollowObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    private won: boolean

    constructor() {
        super('gameplay')
        this.level = 1
        this.playerIndex = 1
        this.audioManager = AudioManager.getInstance()
    }

    public getLevel(): number {
        return this.level
    }

    public getPlayerIndex(): number {
        return this.playerIndex
    }

    public setLevel(level: number): void {
        this.level = level
    }

    public setPlayerIndex(playerIndex: number): void {
        this.playerIndex = playerIndex
    }

    public preload(): void {}

    public create(): void {
        this.audioManager.play(`audio-level-${this.level}`)

        this.won = false

        this.physics.world.TILE_BIAS = 36
        this.physics.world.setBoundsCollision(false, false, false, false)

        this.gameMap = new GameMap(this)
        this.gameMap.load(this.level)
        this.gameMap.setForegroundColor(0x2dff06)
        this.mapWidth = this.gameMap.getWidth()

        this.player = new Player(this, this.playerIndex, 300, 1050) // 1450
        this.player.setColor(0xffffff)
        this.player.setVelocityX(560)
        this.player.setGravityY(4745.61)
        this.player.setParticle()
        this.player.collideWith(this.gameMap, () => {})

        this.gameMap.initializeObjectList('spike')
        this.gameMap.addActionToObjectList(
            'spike',
            (spike: Phaser.GameObjects.GameObject): void => {
                if (spike instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(spike, () => {
                        const value = localStorage.getItem(`level-${this.level}-best`)
                        if (value) {
                            let bestScore: number = Number(value)
                            if (Math.ceil(this.getCompletingPercent() * 100) > bestScore) {
                                bestScore = Math.ceil(this.getCompletingPercent() * 100)
                                localStorage.setItem(`level-${this.level}-best`, String(bestScore))
                            }
                        } else {
                            localStorage.setItem(`level-${this.level}-best`, '0')
                        }
                        if (this.overlapStarted(spike)) {
                            this.audioManager.stop(`audio-level-${this.level}`)
                            this.audioManager.play('audio-dead')
                            this.player.burstParticle()
                            this.doDeathEffect()
                        }
                    })
                }
            }
        )

        this.gameMap.initializeObjectList('jump')
        this.gameMap.addActionToObjectList('jump', (jump: Phaser.GameObjects.GameObject): void => {
            if (jump instanceof Phaser.Physics.Arcade.Sprite) {
                this.player.overlapWith(jump, () => {
                    if (this.overlapStarted(jump)) {
                        this.player.setVelocityY(-1789.77)
                    }
                })
            }
        })

        this.gameMap.initializeObjectList('win-start')
        this.gameMap.addActionToObjectList(
            'win-start',
            (win: Phaser.GameObjects.GameObject): void => {
                if (win instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(win, () => {
                        if (this.overlapStarted(win)) {
                            this.audioManager.stop(`audio-level-${this.level}`)
                            this.camera.stopFollow()
                            this.player.setGravityY(0)
                            this.player.setVelocityX(0)
                            this.player.setVelocityY(-300)
                            this.player.setGravityX(1000)
                        }
                    })
                }
            }
        )

        this.gameMap.initializeObjectList('win-end')
        this.gameMap.addActionToObjectList(
            'win-end',
            (win: Phaser.GameObjects.GameObject): void => {
                if (win instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(win, () => {
                        this.won = true
                        const value = localStorage.getItem(`level-${this.level}-best`)
                        if (value) {
                            let bestScore: number = Number(value)
                            if (Math.ceil(this.getCompletingPercent() * 100) > bestScore) {
                                bestScore = Math.ceil(this.getCompletingPercent() * 100)
                                localStorage.setItem(`level-${this.level}-best`, String(bestScore))
                            }
                        } else {
                            localStorage.setItem(`level-${this.level}-best`, '0')
                        }
                        if (this.overlapStarted(win)) {
                            this.player.burstParticle()
                            const pauseScene = this.scene.manager.getScene('pause')
                            if (pauseScene instanceof PauseScene) {
                                this.audioManager.play('audio-win')
                                pauseScene.displayWinWindow()
                            }
                        }
                    })
                }
            }
        )

        this.gameMap.initializeObjectList('camera-up')
        this.gameMap.addActionToObjectList(
            'camera-up',
            (cameraUp: Phaser.GameObjects.GameObject): void => {
                if (cameraUp instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(cameraUp, () => {
                        if (this.overlapStarted(cameraUp)) {
                            this.add.tween({
                                targets: this.cameraFollowObject,
                                y: this.cameraFollowObject.y - 128,
                                duration: 500,
                            })
                        }
                    })
                }
            }
        )

        this.gameMap.initializeObjectList('camera-down')
        this.gameMap.addActionToObjectList(
            'camera-down',
            (cameraDown: Phaser.GameObjects.GameObject): void => {
                if (cameraDown instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(cameraDown, () => {
                        if (this.overlapStarted(cameraDown)) {
                            this.add.tween({
                                targets: this.cameraFollowObject,
                                y: this.cameraFollowObject.y + 128,
                                duration: 500,
                            })
                        }
                    })
                }
            }
        )

        this.gameMap.initializeObjectList('camera-half-up')
        this.gameMap.addActionToObjectList(
            'camera-half-up',
            (cameraHalfUp: Phaser.GameObjects.GameObject): void => {
                if (cameraHalfUp instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(cameraHalfUp, () => {
                        if (this.overlapStarted(cameraHalfUp)) {
                            this.add.tween({
                                targets: this.cameraFollowObject,
                                y: this.cameraFollowObject.y - 64,
                                duration: 500,
                            })
                        }
                    })
                }
            }
        )

        this.gameMap.initializeObjectList('camera-half-down')
        this.gameMap.addActionToObjectList(
            'camera-half-down',
            (cameraHalfDown: Phaser.GameObjects.GameObject): void => {
                if (cameraHalfDown instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(cameraHalfDown, () => {
                        if (this.overlapStarted(cameraHalfDown)) {
                            this.add.tween({
                                targets: this.cameraFollowObject,
                                y: this.cameraFollowObject.y + 64,
                                duration: 500,
                            })
                        }
                    })
                }
            }
        )

        this.gameMap.initializeObjectList('flying')
        this.gameMap.addActionToObjectList(
            'flying',
            (portal: Phaser.GameObjects.GameObject): void => {
                if (portal instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(portal, () => {
                        if (this.overlapStarted(portal)) {
                            this.player.changeToFlyingState()
                        }
                    })
                }
            }
        )

        this.gameMap.initializeObjectList('running')
        this.gameMap.addActionToObjectList(
            'running',
            (portal: Phaser.GameObjects.GameObject): void => {
                if (portal instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(portal, () => {
                        if (this.overlapStarted(portal)) {
                            this.player.changeToRunningState()
                        }
                    })
                }
            }
        )

        this.cameraFollowObject = this.physics.add.sprite(300, 1450, 'player')
        this.cameraFollowObject.body.setAllowGravity(false)
        this.cameraFollowObject.setVisible(false)

        this.camera = this.cameras.main.setSize(800, 450).setZoom(0.75)
        this.cameras.main.startFollow(this.cameraFollowObject, false, 0.5, 0.5, -300, 0)

        this.cursors = this.input.keyboard!.createCursorKeys()
        this.input.on('pointerdown', () => {
            this.player.act()
        })
        this.input.keyboard?.on('keydown-SPACE', () => {
            this.player.act()
        })
        this.input.keyboard?.on('keydown-UP', () => {
            this.player.act()
        })
        this.input.keyboard?.on('keydown-DOWN', () => {
            this.player.changeToFlyingState()
        })

        const win1 = this.add.zone(0, 0, 800, 450).setOrigin(0, 0)
        win1.setSize(800, 450)
        this.scene.launch('pause')

        const win2 = this.add.zone(0, 0, 800, 450).setOrigin(0, 0)
        win1.setSize(800, 450)
        this.scene.launch('background')
    }

    public update(time: number, timeInterval: number): void {
        if (this.player.isBlockedRight()) {
            const value = localStorage.getItem(`level-${this.level}-best`)
            if (value) {
                let bestScore: number = Number(value)
                if (Math.ceil(this.getCompletingPercent() * 100) > bestScore) {
                    bestScore = Math.ceil(this.getCompletingPercent() * 100)
                    localStorage.setItem(`level-${this.level}-best`, String(bestScore))
                }
            } else {
                localStorage.setItem(`level-${this.level}-best`, '0')
            }
            this.audioManager.stop(`audio-level-${this.level}`)
            this.audioManager.play('audio-dead')
            this.player.burstParticle()
            this.doDeathEffect()
        } else {
            this.player.update()

            this.cameraFollowObject.setX(this.player.getX())

            if (this.cursors.space.isDown || this.cursors.up.isDown) {
                this.player.act()
            }

            if (this.player.getY() > 2000) {
                this.doDeathEffect()
            }
        }
    }

    public doDeathEffect(): void {
        this.camera.shake(250, 0.01)
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.restart()
            },
        })
    }

    public restart(): void {
        this.won = false
        this.audioManager.play(`audio-level-${this.level}`)

        this.player.setX(300)
        this.player.setY(1050)
        this.player.changeToRunningState()

        this.cameraFollowObject.setX(300)
        this.cameraFollowObject.setY(1450)

        this.camera.resetFX()
        this.camera.startFollow(this.cameraFollowObject, false, 0.5, 0.5, -300, 0)
    }

    public getCompletingPercent(): number {
        if (this.won) {
            return 1
        } else {
            return this.player.getX() / this.mapWidth
        }
    }

    public overlapStarted(obj: Phaser.Physics.Arcade.Sprite): boolean {
        if (obj.body) {
            return !obj.body.touching.none && obj.body.wasTouching.none
        }
        return false
    }
}