import AudioManager from '../audio/AudioManager'
import configs from '../configs/configs'
import consts from '../configs/consts'
import GameMap from '../game-map/GameMap'
import Player from '../player/Player'
import PlayerFlyingState from '../player/PlayerFlyingState'
import PauseScene from './PauseScene'

export default class Scene extends Phaser.Scene {
    private level: number
    private playerIndex: number

    private audioManager: AudioManager

    private gameMap: GameMap
    private mapWidth: number

    private player: Player

    private cursor: Phaser.Types.Input.Keyboard.CursorKeys
    private pointer: Phaser.Input.Pointer
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
        if (this.input.keyboard) {
            this.cursor = this.input.keyboard!.createCursorKeys()
        }
        this.pointer = this.input.activePointer

        this.won = false

        this.physics.world.TILE_BIAS = consts.TILE_BIAS
        this.physics.world.setBoundsCollision(false, false, false, false)

        this.audioManager.play(`audio-level-${this.level}`)

        this.gameMap = new GameMap(this)
        this.gameMap.load(this.level)
        this.gameMap.setForegroundColor(consts.FOREGROUND.COLOR)
        this.mapWidth = this.gameMap.getWidth()

        this.player = new Player(this, this.playerIndex)
        this.player.setColor(consts.PLAYER.COLOR)
        this.player.onCollideWith(this.gameMap, () => {})

        this.input.keyboard?.on('keydown-A', () => {
            this.player.setState(new PlayerFlyingState(this.player))
        })

        if (configs.CHEATING) {
            this.gameMap.initializeObjectList(
                'cheat',
                (cheat: Phaser.GameObjects.GameObject): void => {
                    if (cheat instanceof Phaser.Physics.Arcade.Sprite) {
                        this.player.onStartOverlapWith(cheat, () => {
                            this.player.doSmallJump()
                        })
                    }
                }
            )
        }

        this.gameMap.initializeObjectList('spike', (spike: Phaser.GameObjects.GameObject): void => {
            if (spike instanceof Phaser.Physics.Arcade.Sprite) {
                this.player.onStartOverlapWith(spike, () => {
                    this.handleInput('dead')
                    this.player.handleInput('dead')
                })
            }
        })

        this.gameMap.initializeObjectList('jump', (jump: Phaser.GameObjects.GameObject): void => {
            if (jump instanceof Phaser.Physics.Arcade.Sprite) {
                this.player.onStartOverlapWith(jump, () => {
                    this.player.handleInput('jump')
                })
            }
        })

        this.gameMap.initializeObjectList('ring', (ring: Phaser.GameObjects.GameObject): void => {
            if (ring instanceof Phaser.Physics.Arcade.Sprite) {
                this.player.onStartOverlapWith(ring, () => {
                    if (this.cursor.space.isDown || this.cursor.up.isDown || this.pointer.isDown) {
                        this.player.handleInput('hit')
                    }
                })
            }
        })

        this.gameMap.initializeObjectList(
            'win-start',
            (win: Phaser.GameObjects.GameObject): void => {
                if (win instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.onStartOverlapWith(win, () => {
                        this.handleInput('win-start')
                        this.player.handleInput('win-start')
                    })
                }
            }
        )

        this.gameMap.initializeObjectList('win-end', (win: Phaser.GameObjects.GameObject): void => {
            if (win instanceof Phaser.Physics.Arcade.Sprite) {
                this.player.onStartOverlapWith(win, () => {
                    this.handleInput('win-end')
                    this.player.handleInput('win-end')
                })
            }
        })

        this.gameMap.initializeObjectList(
            'camera-up',
            (cameraUp: Phaser.GameObjects.GameObject): void => {
                if (cameraUp instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.onStartOverlapWith(cameraUp, () => {
                        this.handleInput('camera-up')
                    })
                }
            }
        )

        this.gameMap.initializeObjectList(
            'camera-down',
            (cameraDown: Phaser.GameObjects.GameObject): void => {
                if (cameraDown instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.onStartOverlapWith(cameraDown, () => {
                        this.handleInput('camera-down')
                    })
                }
            }
        )

        this.gameMap.initializeObjectList(
            'camera-half-up',
            (cameraHalfUp: Phaser.GameObjects.GameObject): void => {
                if (cameraHalfUp instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.onStartOverlapWith(cameraHalfUp, () => {
                        this.handleInput('camera-half-up')
                    })
                }
            }
        )

        this.gameMap.initializeObjectList(
            'camera-half-down',
            (cameraHalfDown: Phaser.GameObjects.GameObject): void => {
                if (cameraHalfDown instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.onStartOverlapWith(cameraHalfDown, () => {
                        this.handleInput('camera-half-down')
                    })
                }
            }
        )

        this.gameMap.initializeObjectList(
            'flying',
            (portal: Phaser.GameObjects.GameObject): void => {
                if (portal instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.onStartOverlapWith(portal, () => {
                        this.player.handleInput('flying')
                    })
                }
            }
        )

        this.gameMap.initializeObjectList(
            'running',
            (portal: Phaser.GameObjects.GameObject): void => {
                if (portal instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.onStartOverlapWith(portal, () => {
                        this.player.handleInput('running')
                    })
                }
            }
        )

        this.cameraFollowObject = this.physics.add.sprite(
            consts.CAMERA_FOLLOW_OBJECT.INIT_X,
            consts.CAMERA_FOLLOW_OBJECT.INIT_Y,
            'player'
        )
        this.cameraFollowObject.body.setAllowGravity(false)
        this.cameraFollowObject.setVisible(false)

        this.camera = this.cameras.main
            .setSize(configs.GAME_WIDTH, configs.GAME_HEIGHT)
            .setZoom(0.75)
        this.cameras.main.startFollow(this.cameraFollowObject, false, 0.5, 0.5, -300, 0)

        const win1 = this.add.zone(0, 0, configs.GAME_WIDTH, configs.GAME_HEIGHT).setOrigin(0, 0)
        win1.setSize(configs.GAME_WIDTH, configs.GAME_HEIGHT)
        this.scene.launch('pause')

        const win2 = this.add.zone(0, 0, configs.GAME_WIDTH, configs.GAME_HEIGHT).setOrigin(0, 0)
        win1.setSize(configs.GAME_WIDTH, configs.GAME_HEIGHT)
        this.scene.launch('background')
    }

    public handleInput(key: string): void {
        if (key == 'dead') {
            this.audioManager.stop(`audio-level-${this.level}`)
            this.audioManager.play('audio-dead')
            this.doDeathEffect()
        } else if (key == 'win-start') {
            this.audioManager.stop(`audio-level-${this.level}`)
            this.camera.stopFollow()
        } else if (key == 'win-end') {
            this.won = true
            const pauseScene = this.scene.manager.getScene('pause')
            if (pauseScene instanceof PauseScene) {
                this.audioManager.play('audio-win')
                pauseScene.displayWinWindow()
            }
        } else if (key == 'camera-up') {
            this.add.tween({
                targets: this.cameraFollowObject,
                y: this.cameraFollowObject.y - 128,
                duration: 500,
            })
        } else if (key == 'camera-down') {
            this.add.tween({
                targets: this.cameraFollowObject,
                y: this.cameraFollowObject.y + 128,
                duration: 500,
            })
        } else if (key == 'camera-half-up') {
            this.add.tween({
                targets: this.cameraFollowObject,
                y: this.cameraFollowObject.y - 64,
                duration: 500,
            })
        } else if (key == 'camera-half-down') {
            this.add.tween({
                targets: this.cameraFollowObject,
                y: this.cameraFollowObject.y + 64,
                duration: 500,
            })
        }
    }

    public update(): void {
        this.cameraFollowObject.setX(this.player.getX())
        if (this.player.isBlockedRight()) {
            this.handleInput('dead')
            this.player.handleInput('dead')
        }
        if (this.cursor.space.isDown || this.cursor.up.isDown || this.pointer.isDown) {
            if (this.player.isBlockedDown()) {
                this.player.handleInput('hit')
            }
        }
        this.player.update()
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

        this.player.handleInput('restart')

        this.cameraFollowObject.setX(consts.CAMERA_FOLLOW_OBJECT.INIT_X)
        this.cameraFollowObject.setY(consts.CAMERA_FOLLOW_OBJECT.INIT_Y)

        this.camera.resetFX()
        this.camera.startFollow(
            this.cameraFollowObject,
            false,
            0.5,
            0.5,
            consts.CAMERA.OFFSET_X,
            consts.CAMERA.OFFSET_Y
        )
    }

    public getCompletingPercent(): number {
        if (this.won) {
            return 1
        } else {
            return this.player.getX() / this.mapWidth
        }
    }
}
