import GameMap from '../game-levels/GameMap'
import Player from '../player/Player'

export default class Scene extends Phaser.Scene {
    private player: Player

    private gameMap: GameMap
    private tileMap: Phaser.Tilemaps.Tilemap
    private foregroundLayer: Phaser.Tilemaps.TilemapLayer
    private spikeList: Phaser.GameObjects.GameObject[]

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private camera: Phaser.Cameras.Scene2D.Camera
    private cameraFollowObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    // private light: any

    constructor() {
        super('game')
    }

    public preload(): void {}

    public create(): void {
        this.physics.world.TILE_BIAS = 32
        this.physics.world.setBoundsCollision(false, false, false, false)

        this.gameMap = new GameMap(this)
        this.gameMap.load(0)

        this.player = new Player(this, 300, 1000)
        this.player.setColor(0xffffff)
        this.player.setVelocityX(1)
        this.player.setGravityY(6198.35)
        this.player.collideWith(this.gameMap, () => {})

        this.cameraFollowObject = this.physics.add.sprite(300, 1220, 'player')
        this.cameraFollowObject.body.setAllowGravity(false)
        this.cameraFollowObject.setVisible(false)

        this.camera = this.cameras.main.setSize(800, 450).setZoom(0.75)
        this.cameras.main.startFollow(this.cameraFollowObject, false, 0.5, 0.5, -300, 0)

        this.gameMap.initializeObjectList('spike')
        this.gameMap.addActionToObjectList(
            'spike',
            (spike: Phaser.GameObjects.GameObject): void => {
                if (spike instanceof Phaser.Physics.Arcade.Sprite) {
                    this.player.collideWith(spike, () => {
                        this.restart()
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

        // const flyingPortalList = this.tileMap.createFromObjects('objects', {
        //     name: 'flying',
        //     classType: Phaser.Physics.Arcade.Sprite,
        // })
        // flyingPortalList.forEach((portal: Phaser.GameObjects.GameObject): void => {
        //     if (portal instanceof Phaser.Physics.Arcade.Sprite) {
        //         portal.setY(portal.y + 1025)
        //         portal.setX(portal.x - 512)
        //         portal.setVisible(false)
        //         this.physics.add.existing(portal)
        //         this.player.overlapWith(portal, () => {
        //             this.player.changeToFlyingState()
        //         })
        //     }
        // })

        // const runningPortalList = this.tileMap.createFromObjects('objects', {
        //     name: 'running',
        //     classType: Phaser.Physics.Arcade.Sprite,
        // })
        // runningPortalList.forEach((portal: Phaser.GameObjects.GameObject): void => {
        //     if (portal instanceof Phaser.Physics.Arcade.Sprite) {
        //         portal.setY(portal.y + 1025)
        //         portal.setX(portal.x - 512)
        //         portal.setVisible(false)
        //         this.physics.add.existing(portal)
        //         this.player.overlapWith(portal, () => {
        //             this.player.changeToRunningState()
        //         })
        //     }
        // })

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

        // const cameraHalfUpList = this.tileMap.createFromObjects('objects', {
        //     name: 'camera-half-up',
        //     classType: Phaser.Physics.Arcade.Sprite,
        // })
        // cameraHalfUpList.forEach((cameraHalfUp: Phaser.GameObjects.GameObject): void => {
        //     if (cameraHalfUp instanceof Phaser.Physics.Arcade.Sprite) {
        //         cameraHalfUp.setY(cameraHalfUp.y + 1025)
        //         cameraHalfUp.setX(cameraHalfUp.x - 512)
        //         cameraHalfUp.setVisible(false)
        //         this.physics.add.existing(cameraHalfUp)
        //         this.player.overlapWith(cameraHalfUp, () => {
        //             if (this.overlapStarted(cameraHalfUp)) {
        //                 this.add.tween({
        //                     targets: this.cameraFollowObject,
        //                     y: this.cameraFollowObject.y - 64,
        //                     duration: 500,
        //                 })
        //             }
        //         })
        //     }
        // })

        // const cameraDownList = this.tileMap.createFromObjects('objects', {
        //     name: 'camera-down',
        //     classType: Phaser.Physics.Arcade.Sprite,
        // })
        // cameraDownList.forEach((cameraDown: Phaser.GameObjects.GameObject): void => {
        //     if (cameraDown instanceof Phaser.Physics.Arcade.Sprite) {
        //         cameraDown.setY(cameraDown.y + 1025)
        //         cameraDown.setX(cameraDown.x - 512)
        //         cameraDown.setVisible(false)
        //         this.physics.add.existing(cameraDown)

        //         console.log(cameraDown)

        //         this.player.overlapWith(cameraDown, () => {
        //             if (this.overlapStarted(cameraDown)) {
        //                 this.add.tween({
        //                     targets: this.cameraFollowObject,
        //                     y: this.cameraFollowObject.y + 128,
        //                     duration: 500,
        //                 })
        //             }
        //         })
        //     }
        // })

        // const cameraHalfDownList = this.tileMap.createFromObjects('objects', {
        //     name: 'camera-half-down',
        //     classType: Phaser.Physics.Arcade.Sprite,
        // })
        // cameraHalfDownList.forEach((cameraHalfDown: Phaser.GameObjects.GameObject): void => {
        //     if (cameraHalfDown instanceof Phaser.Physics.Arcade.Sprite) {
        //         cameraHalfDown.setY(cameraHalfDown.y + 1025)
        //         cameraHalfDown.setX(cameraHalfDown.x - 512)
        //         cameraHalfDown.setVisible(false)
        //         this.physics.add.existing(cameraHalfDown)

        //         console.log(cameraHalfDown)

        //         this.player.overlapWith(cameraHalfDown, () => {
        //             if (this.overlapStarted(cameraHalfDown)) {
        //                 this.add.tween({
        //                     targets: this.cameraFollowObject,
        //                     y: this.cameraFollowObject.y + 64,
        //                     duration: 500,
        //                 })
        //             }
        //         })
        //     }
        // })

        const win1 = this.add.zone(0, 0, 800, 450).setOrigin(0, 0)
        win1.setSize(800, 450)
        this.scene.launch('pause')

        const win2 = this.add.zone(0, 0, 800, 450).setOrigin(0, 0)
        win1.setSize(800, 450)
        this.scene.launch('background')
    }

    public update(time: number, timeInterval: number): void {
        this.player.setVelocityX(640)
        this.cameraFollowObject.setX(this.player.getX())

        if (this.cursors.space.isDown || this.cursors.up.isDown) {
            this.player.act()
        }

        if (this.player.getY() > 2000) {
            this.restart()
        }

        this.player.update()
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
            console.log(obj.body.touching.none, obj.body.wasTouching.none)
            return !obj.body.touching.none && obj.body.wasTouching.none
        }
        return false
    }

    public overlapEnded(obj: Phaser.Physics.Arcade.Sprite): boolean {
        if (obj.body) {
            return !obj.body.touching.none && obj.body.wasTouching.none
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
