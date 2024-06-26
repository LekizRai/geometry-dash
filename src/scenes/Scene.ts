export default class Scene extends Phaser.Scene {
    private isRotating: boolean = false
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private fire: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private test: Phaser.GameObjects.Container
    private tileMap: Phaser.Tilemaps.Tilemap
    private backgroundLayer: Phaser.Tilemaps.TilemapLayer
    private groundLayer: Phaser.Tilemaps.TilemapLayer
    private spikeLayer: Phaser.Tilemaps.TilemapLayer
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private light: any

    constructor() {
        super('game')
    }

    preload() {
        this.load.image('background', 'assets/images/game_bg_01_001.png')
        this.load.image('ground', 'assets/images/groundSquare_01_001.png')
        this.load.image('spike', 'assets/spikes/invis_spike_01_glow_001.png')
        this.load.image('player', 'assets/players/player-30/player_30_001.png')
        this.load.atlas('fire', 'assets/fire/fire.png', 'assets/fire/fire_atlas.json')
        this.load.tilemapTiledJSON('tile-map', 'assets/geometry-dash-tile-map.tmj')
    }

    create() {
        this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight)
        this.physics.world.setBoundsCollision(true, false, true, true)
        this.tileMap = this.make.tilemap({ key: 'tile-map', tileWidth: 64, tileHeight: 64 })

        const groundTileSet = this.tileMap.addTilesetImage('ground', 'ground')
        const spikeTileSet = this.tileMap.addTilesetImage('spike1', 'spike')

        // const backgroundTileSet = this.tileMap.addTilesetImage('background', 'background')

        // if (backgroundTileSet) {
        //     const backgroundLayer = this.tileMap.createLayer('background', backgroundTileSet, 0, 0)
        //     if (backgroundLayer) {
        //         this.backgroundLayer = backgroundLayer
        //     }
        // }
        // this.backgroundLayer.setTint(0x0000ff)

        if (groundTileSet) {
            const groundLayer = this.tileMap.createLayer('ground', groundTileSet, 0, 0)
            if (groundLayer) {
                this.groundLayer = groundLayer
            }
            this.groundLayer.setCollisionByProperty({ isCollided: true })
        }
        this.groundLayer.setTint(0x0000ff)

        if (spikeTileSet) {
            const spikeLayer = this.tileMap.createLayer('spike', spikeTileSet, 0, 90)
            if (spikeLayer) {
                this.spikeLayer = spikeLayer
            }
            this.spikeLayer.setCollisionByProperty({isSpike: true})
        }
        this.spikeLayer.setTint(0x0000ff)

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

        this.fire = this.physics.add.sprite(400 - 64 - 28, 50, 'fire').setScale(2)
        this.fire.play('fire')
        this.fire.setTint(0xffffff)
        this.fire.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.groundLayer, this.fire)

        this.player = this.physics.add.sprite(400, 50, 'player')
        this.player.setTint(0xffffff)
        this.player.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.groundLayer, this.player)
        // this.physics.add.collider(this.spikeLayer, this.player)
        // this.physics.add.collider(this.player, this.spikeLayer, () => {
        //     this.player.setVisible(false)
        //     this.fire.setVisible(false)
        //     this.scene.start('preload')
        // })
        // this.physics.add.collider(this.player, this.fire)

        this.light = this.lights.addLight(this.player.x, this.player.y, 1000).setScrollFactor(0).setIntensity(5);
        this.lights.enable().setAmbientColor(0x555555);

        this.groundLayer.setPipeline('Light2D')
        this.spikeLayer.setPipeline('Light2D')
        this.player.setPipeline('Light2D')
        this.fire.setPipeline('Light2D')

        this.cursors = this.input.keyboard!.createCursorKeys()

        this.cameras.main.setSize(this.sys.canvas.width, this.sys.canvas.height)
        // this.cameras.main.setBounds(0, 0, this.sys.canvas.width, this.sys.canvas.height)
        this.cameras.main.startFollow(this.player, false, 0.5, 0.5, -480, 200)
    }

    update(time: number, timeInterval: number) {
        this.light.x = this.player.x
        this.light.y = this.player.y

        if (this.isRotating && this.player.body.blocked.down) {
            this.fire.setVisible(true)
            this.player.setAngularVelocity(0)
            this.player.setRotation(Math.PI / 2)
        }

        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-700)
            this.fire.setVisible(false)
            this.player.setAngularVelocity(400)
            this.isRotating = true
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500)
            this.fire.setVelocityX(500)
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500)
            this.fire.setVelocityX(-500)
        } else {
            this.player.setVelocityX(0)
            this.fire.setVelocityX(0)
        }

// 61 60 60 22
        // this.fire.setPosition(this.player.x, this.player.y - 100)
    }

    // restart ()
    // {
    //     this.cam.fade(500, 0, 0, 0);
    //     this.cam.shake(250, 0.01);

    //     this.time.addEvent({
    //         delay: 600,
    //         callback: () => {
    //             this.cam.resetFX();
    //             this.scene.stop();
    //             this.scene.start('main');
    //         }
    //     });
    // }
}
