import GameMap from '../game-levels/GameMap'
import Player from '../player/Player'

export default class Scene extends Phaser.Scene {
    private gameMap: GameMap

    private player: Player

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private camera: Phaser.Cameras.Scene2D.Camera
    private cameraFollowObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    // private light: any

    constructor() {
        super('game')
    }

    public preload(): void {}

    public create(): void {
        this.physics.world.TILE_BIAS = 36
        this.physics.world.setBoundsCollision(false, false, false, false)

        this.gameMap = new GameMap(this)
        this.gameMap.load(1)
        this.gameMap.setForegroundTint(0x2dff06)

        this.player = new Player(this, 300, 1050) // 1450
        this.player.setColor(0xffffff)
        this.player.setVelocityX(560)
        this.player.setGravityY(4745.61)
        this.player.collideWith(this.gameMap, () => {})

        this.cameraFollowObject = this.physics.add.sprite(300, 1450, 'player')
        this.cameraFollowObject.body.setAllowGravity(false)
        this.cameraFollowObject.setVisible(false)

        this.camera = this.cameras.main.setSize(800, 450).setZoom(0.75)
        this.cameras.main.startFollow(this.cameraFollowObject, false, 0.5, 0.5, -300, 0)

        this.gameMap.initializeObjectList('spike')
        this.gameMap.addActionToObjectList(
            'spike',
            (spike: Phaser.GameObjects.GameObject): void => {
                if (spike instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.overlapWith(spike, () => {
                        if (this.overlapStarted(spike)) {
                            spike.disableBody()
                            this.physics.world.disable(spike)
                            spike.setVisible(true)
                            this.player.burst()
                            this.restart()
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
        // this.player.setVelocityX(640)
        this.player.update()

        this.cameraFollowObject.setX(this.player.getX())

        if (this.cursors.space.isDown || this.cursors.up.isDown) {
            this.player.act()
        }

        if (this.player.getY() > 2000) {
            this.restart()
        }
    }

    public restart(): void {
        this.camera.shake(250, 0.01)
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.camera.resetFX()
                this.scene.stop()
                this.scene.restart()
            },
        })
    }

    public overlapStarted(obj: Phaser.Physics.Arcade.Sprite): boolean {
        if (obj.body) {
            return !obj.body.touching.none && obj.body.wasTouching.none
        }
        return false
    }

    public overlapEnded(obj: Phaser.Physics.Arcade.Sprite): boolean {
        if (obj.body) {
            return obj.body.touching.none && !obj.body.wasTouching.none
        }
        return false
    }
}

// this.light.x = this.player.x
// this.light.y = this.player.y

// this.light = this.lights.addLight(this.player.x, this.player.y, 1000).setScrollFactor(0).setIntensity(5);
// this.lights.enable().setAmbientColor(0x555555);

// this.groundLayer.setPipeline('Light2D')
// this.spikeLayer.setPipeline('Light2D')
// this.player.setPipeline('Light2D')
// this.fire.setPipeline('Light2D')
// if (this.cursors.right.isDown) {
//     this.player.setVelocityX(500)
//     this.fire.setVelocityX(500)
// } else if (this.cursors.left.isDown) {
//     this.player.setVelocityX(-500)
//     this.fire.setVelocityX(-500)
// } else {
//     this.player.setVelocityX(0)
//     this.fire.setVelocityX(0)
// }

// 61 60 60 22
// this.fire.setPosition(this.player.x, this.player.y - 100)
