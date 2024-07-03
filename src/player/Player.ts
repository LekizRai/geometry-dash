import GameMap from '../game-levels/GameMap'

export default class Player {
    private scene: Phaser.Scene

    private rotationTween: Phaser.Tweens.Tween

    private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private particle: Phaser.GameObjects.Particles.ParticleEmitter
    private ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private isRunning: boolean

    constructor(scene: Phaser.Scene, x?: number, y?: number, playerIndex?: number) {
        this.scene = scene
        if (x) {
            if (y) {
                this.sprite = this.scene.physics.add.sprite(x, y, 'player')
            } else {
                this.sprite = this.scene.physics.add.sprite(x, 0, 'player')
            }
        } else {
            this.sprite = this.scene.physics.add.sprite(0, 0, 'player')
        }
        this.ship = this.scene.physics.add.sprite(this.sprite.x, this.sprite.y, 'ship')
        this.ship.setVisible(false)
        this.ship.enableBody(false)

        this.isRunning = true

        this.rotationTween = this.scene.add.tween({
            key: 'player-rotation',
            targets: this.sprite,
            rotation: Math.PI,
            duration: 440,
            persist: true,
        })

        this.particle = this.scene.add.particles(0, 0, 'particle', {
            // frame: 'white',
            // color: [0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404],
            lifespan: 200,
            angle: { min: -100, max: -80 },
            scale: { start: 0.75, end: 0 },
            speed: { min: 100, max: 200 },
            alpha: { start: 1, end: 0 },
            // advance: 20,
            frequency: 50,
            blendMode: 'ADD',
            // emitting: false
            // lifespan: 4000,
            // speed: { min: 150, max: 250 },
            // scale: { start: 0.8, end: 0 },
            // gravityY: 150,
            // blendMode: 'ADD',
            // emitting: false
        })
        this.particle.startFollow(this.sprite, -32, 32)
    }

    public getX(): number {
        return this.sprite.x
    }

    public getY(): number {
        return this.sprite.y
    }

    public setX(x: number): void {
        this.sprite.setX(x)
    }

    public setY(y: number): void {
        this.sprite.setY(y)
    }

    public getVelocityX(): number {
        return this.sprite.body.velocity.x
    }

    public getVelocityY(): number {
        return this.sprite.body.velocity.y
    }

    public setVelocityX(velocityX: number): void {
        this.sprite.setVelocityX(velocityX)
    }

    public setVelocityY(velocityY: number): void {
        this.sprite.setVelocityY(velocityY)
    }

    public getGravityX(): number {
        return this.sprite.body.gravity.x
    }

    public getGravityY(): number {
        return this.sprite.body.gravity.y
    }

    public setGravityX(gravityX: number): void {
        this.sprite.body.setGravityX(gravityX)
    }

    public setGravityY(gravityY: number): void {
        this.sprite.body.setGravityY(gravityY)
    }

    public setColor(color: number): void {
        this.sprite.setTint(color)
    }

    public act(): void {
        if (this.isRunning) {
            if (this.sprite.body.blocked.down) {
                this.sprite.setVelocityY(-1193.18)
                this.sprite.setRotation(0)
                this.rotationTween.restart()
            }
        } else {
            this.sprite.setVelocityY(-200)
        }
    }

    public changeToFlyingState(): void {
        if (this.isRunning) {
            this.isRunning = false
            this.ship.setVisible(true)
            this.ship.enableBody(true)
            this.sprite.setVelocityX(560)
            this.sprite.setGravityY(200)
        }
    }

    public changeToRunningState(): void {
        if (!this.isRunning) {
            this.isRunning = true
            this.ship.setVisible(false)
            this.ship.enableBody(false)
            this.sprite.setRotation(0)
            this.sprite.setVelocityX(560)
            this.sprite.setGravityY(4745.61)
        }
    }

    public collideWith(
        obj: Phaser.GameObjects.GameObject | GameMap,
        callback?: (
            obj1: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject,
            obj2: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject
        ) => void
    ): void {
        if (callback) {
            if (obj instanceof Phaser.GameObjects.GameObject) {
                this.scene.physics.add.collider(obj, this.sprite, callback)
            } else {
                this.scene.physics.add.collider(obj.getForegroundLayer(), this.sprite, callback)
            }
        } else {
            if (obj instanceof Phaser.GameObjects.GameObject) {
                this.scene.physics.add.collider(obj, this.sprite)
            } else {
                this.scene.physics.add.collider(obj.getForegroundLayer(), this.sprite)
            }
        }
    }

    public overlapWith(
        obj: Phaser.GameObjects.GameObject,
        callback: (
            obj1: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject,
            obj2: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject
        ) => void
    ): void {
        this.scene.physics.add.overlap(obj, this.sprite, callback)
    }

    public burst(): void {
        this.particle.setParticleScale(0.75, 0.75)
        // this.particle.setAlpha(1)
        this.particle.setParticleLifespan(1000)
        this.particle.ops.angle.loadConfig({ angle: { min: 0, max: 360 } });
        this.particle.stopFollow()
        this.particle.explode(50, this.sprite.x, this.sprite.y)
        this.sprite.setVisible(false)
        this.sprite.disableBody()
        this.sprite.setVelocityX(0)
    }

    public update(): void {
        if (!this.isRunning) {
            let rotation: number = Math.atan(this.getVelocityY() / this.getVelocityX())
            if (Number.isNaN(rotation)) {
                rotation = 0
            }
            this.sprite.setRotation(rotation)
            this.ship.setRotation(rotation)

            const shiftX: number = Math.sqrt(
                (Math.tan(rotation) * 30) ** 2 / (1 + Math.tan(rotation) ** 2)
            )
            let shiftY: number = shiftX / Math.tan(rotation)
            if (Number.isNaN(shiftY)) {
                shiftY = 30
            }

            if (shiftY > 0) {
                this.ship.setX(this.sprite.x - shiftX)
                this.ship.setY(this.sprite.y + shiftY)
            } else {
                this.ship.setX(this.sprite.x + shiftX)
                this.ship.setY(this.sprite.y - shiftY)
            }
        } else if (this.sprite.body.blocked.down) {
            if (this.rotationTween.isPlaying()) {
                this.rotationTween.pause()
                this.sprite.setRotation(0)
            }
        }
    }
}
