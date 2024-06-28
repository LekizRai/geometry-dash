import Background from './Background'
import Pause from './Pause'

// Ground = 32 * (square + 1)

export default class Scene extends Phaser.Scene {
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private fire: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private backgrounds: Phaser.Physics.Arcade.Group

    private tileMap: Phaser.Tilemaps.Tilemap
    private groundLayer: Phaser.Tilemaps.TilemapLayer
    private spikeLayer: Phaser.Tilemaps.TilemapLayer
    private blockLayer: Phaser.Tilemaps.TilemapLayer

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private camera: Phaser.Cameras.Scene2D.Camera
    private cameraFollowObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    private light: any

    constructor() {
        super('game')
    }

    public preload(): void {}

    public create(): void {
        this.physics.world.TILE_BIAS = 32
        // this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight)
        this.physics.world.setBoundsCollision(false, false, false, false)

        this.tileMap = this.make.tilemap({ key: 'tile-map', tileWidth: 32, tileHeight: 32 })

        const groundTileSet = this.tileMap.addTilesetImage('ground', 'ground')
        const spikeTileSet = this.tileMap.addTilesetImage('spike', 'spike')
        const blockTileSet = this.tileMap.addTilesetImage('block', 'block')

        if (groundTileSet) {
            const groundLayer = this.tileMap.createLayer('ground', groundTileSet, 0, 0)
            if (groundLayer) {
                this.groundLayer = groundLayer
            }
            this.groundLayer.setCollisionByProperty({ isCollided: true })
        }
        this.groundLayer.setTint(0xffff00)

        if (spikeTileSet) {
            const spikeLayer = this.tileMap.createLayer('spike', spikeTileSet, 0, -282)
            if (spikeLayer) {
                this.spikeLayer = spikeLayer
            }
            this.spikeLayer.setCollisionByProperty({ isSpike: true })
        }
        this.spikeLayer.setTint(0xffff00)

        if (blockTileSet) {
            const blockLayer = this.tileMap.createLayer('block', blockTileSet, 0, -250)
            if (blockLayer) {
                this.blockLayer = blockLayer
            }
            this.blockLayer.setCollisionByProperty({ isBlock: true })
        }
        this.blockLayer.setTint(0xffff00)

        const fireAnimation = this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNames('fire', {
                start: 1,
                end: 9,
                prefix: 'gj22_anim_50_00',
            }),
            repeat: -1,
            frameRate: 15,
        })
        if (fireAnimation) {
            fireAnimation.addFrame(
                this.anims.generateFrameNames('fire', {
                    start: 10,
                    end: 12,
                    prefix: 'gj22_anim_50_0',
                })
            )
        }

        const gameoverAnimation = this.anims.create({
            key: 'gameover',
            frames: this.anims.generateFrameNames('gameover', {
                start: 1,
                end: 9,
                prefix: 'gj22_anim_28_00',
            }),
            frameRate: 15,
        })
        if (gameoverAnimation) {
            gameoverAnimation.addFrame(
                this.anims.generateFrameNames('gameover', {
                    start: 10,
                    end: 11,
                    prefix: 'gj22_anim_28_0',
                })
            )
        }

        this.fire = this.physics.add.sprite(400 - 64 - 28 - 100, 50, 'fire').setScale(2)
        this.fire.play('fire')
        this.fire.setTint(0xffffff)
        this.fire.body.setCollideWorldBounds(true)
        this.fire.setVisible(false)
        this.fire.setVelocityX(640)
        this.physics.add.collider(this.groundLayer, this.fire)

        this.player = this.physics.add.sprite(200 + 32, 448 - 32, 'player')
        this.player.setTint(0xffffff)
        this.player.body.setCollideWorldBounds(true)
        this.player.setAngularVelocity(500)
        this.player.setVelocityX(640)

        const win1 = this.add.zone(0, 0, 800, 450).setOrigin(0, 0)
        win1.setSize(800, 450)
        this.scene.launch('pause')

        const win2 = this.add.zone(0, 0, 800, 450).setOrigin(0, 0)
        win1.setSize(800, 450)
        this.scene.launch('background')

        this.physics.add.collider(this.player, this.groundLayer)
        this.physics.add.collider(this.player, this.blockLayer, () => {
            if (this.player.body.blocked.right) {
                this.fire.setVisible(false)
                this.player.setVisible(false)
                this.restart()
            }
        })
        this.physics.add.collider(this.player, this.spikeLayer, () => {
            this.fire.setVisible(false)
            this.player.setVisible(false)
            this.restart()
        })

        this.cursors = this.input.keyboard!.createCursorKeys()
        this.input.on('pointerdown', () => {
            if (this.player.body.blocked.down) {
                this.player.setVelocityY(-1280)
                this.fire.setVisible(false)
                this.player.setAngularVelocity(500)
            }
        })

        this.cameraFollowObject = this.physics.add.sprite(200, 448, 'player').setOrigin(0, 0)
        this.cameraFollowObject.body.setAllowGravity(true)
        this.cameraFollowObject.setVisible(false)
        this.cameraFollowObject.setVelocityX(640)
        this.physics.add.collider(this.cameraFollowObject, this.groundLayer)

        this.camera = this.cameras.main.setSize(800, 450)
        this.camera.startFollow(this.cameraFollowObject, false, 0.5, 0.5, -300, 50)

        console.log(this.player.width, this.player.displayWidth)
        console.log('Camera position: ', this.cameras.main.x, this.cameras.main.y)
        console.log('Player position: ', this.player.x, this.player.y)
        console.log('Ground position: ', this.groundLayer.x, this.groundLayer.y)
        console.log('Spike position: ', this.spikeLayer.x, this.spikeLayer.y)
    }

    public update(time: number, timeInterval: number): void {
        if (this.player.body.blocked.down) {
            if (this.cursors.up.isDown || this.cursors.space.isDown) {
                this.player.setVelocityY(-1280)
                this.fire.setVisible(false)
                this.player.setAngularVelocity(500)
            } else {
                if (!this.fire.visible) {
                    if (this.player.visible) {
                        this.fire.setY(this.player.y - 50)
                        this.fire.setVisible(true)
                    }
                    this.player.setAngularVelocity(0)
                    this.player.setAngle(82)
                }
            }
        }

        if (this.player.y > 2000) {
            this.restart()
        }
    }

    public restart(): void {
        this.camera.shake(250, 0.01)

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.camera.resetFX()
                this.anims.remove('fire')
                this.anims.remove('gameover')
                this.scene.remove('pause')
                this.scene.stop()
                this.scene.restart()
            },
        })
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
