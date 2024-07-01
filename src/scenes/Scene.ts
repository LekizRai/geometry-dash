import Player from '../player/Player'

export default class Scene extends Phaser.Scene {
    private player: Player

    private tileMap: Phaser.Tilemaps.Tilemap
    private foregroundLayer: Phaser.Tilemaps.TilemapLayer

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
        this.physics.world.setBoundsCollision(false, false, false, false)

        this.tileMap = this.make.tilemap({ key: 'tile-map', tileWidth: 32, tileHeight: 32 })

        const foregroundTiledSet = this.tileMap.addTilesetImage('geometry-dash', 'geometry-dash')

        if (foregroundTiledSet) {
            const foregroundLayer = this.tileMap.createLayer(
                'foreground',
                foregroundTiledSet,
                0,
                448
            )
            if (foregroundLayer) {
                this.foregroundLayer = foregroundLayer
            }
            this.foregroundLayer.setCollisionByProperty({ isCollided: true })
        }
        this.foregroundLayer.setTint(0xffffff)

        this.player = new Player(this, 200 + 32, 1700)
        this.player.setColor(0xffffff)
        this.player.setVelocityX(640)
        this.player.setGravityY(8264.46)
        this.player.collideWith(this.foregroundLayer, () => {})

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
            console.log(99)
            this.player.changeState()
        })

        this.cameraFollowObject = this.physics.add.sprite(200, 1700 - 64, 'player')
        this.cameraFollowObject.body.setAllowGravity(false)
        this.cameraFollowObject.setVisible(false)

        this.camera = this.cameras.main.setSize(800, 450).setZoom(0.75)
        this.cameras.main.startFollow(this.cameraFollowObject, false, 0.5, 0.5, -300, 50)

        const win1 = this.add.zone(0, 0, 800, 450).setOrigin(0, 0)
        win1.setSize(800, 450)
        this.scene.launch('pause')

        const win2 = this.add.zone(0, 0, 800, 450).setOrigin(0, 0)
        win1.setSize(800, 450)
        this.scene.launch('background')

        console.log(typeof 0x001100)
        console.log('Camera position: ', this.cameras.main.x, this.cameras.main.y)
        console.log('Foreground position: ', this.foregroundLayer.x, this.foregroundLayer.y)
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
