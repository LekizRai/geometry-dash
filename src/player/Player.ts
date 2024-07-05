import consts from '../configs/consts'
import GameMap from '../game-levels/GameMap'

export default class Player {
    private scene: Phaser.Scene

    private playerIndex: number

    private smallRotationTween: Phaser.Tweens.Tween
    private bigRotationTween: Phaser.Tweens.Tween

    private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private particle: Phaser.GameObjects.Particles.ParticleEmitter
    private ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private isRunning: boolean

    constructor(scene: Phaser.Scene, playerIndex: number, x?: number, y?: number) {
        this.scene = scene
        this.playerIndex = playerIndex
        if (x) {
            if (y) {
                this.sprite = this.scene.physics.add.sprite(x, y, `player-${playerIndex}`)
            } else {
                this.sprite = this.scene.physics.add.sprite(x, 0, `player-${playerIndex}`)
            }
        } else {
            this.sprite = this.scene.physics.add.sprite(0, 0, `player-${playerIndex}`)
        }

        this.ship = this.scene.physics.add.sprite(
            this.sprite.x,
            this.sprite.y,
            `ship-${playerIndex}`
        )
        this.ship.setVisible(false)
        this.ship.enableBody(false)

        this.isRunning = true

        this.smallRotationTween = this.scene.add
            .tween({
                key: 'player-small-rotation',
                targets: this.sprite,
                rotation: Math.PI,
                duration: 440,
                persist: true,
            })
            .pause()

        this.bigRotationTween = this.scene.add
            .tween({
                key: 'player-big-rotation',
                targets: this.sprite,
                rotation: Math.PI,
                duration: 600,
                persist: true,
            })
            .pause()
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

    public getAngularVelocity(): number {
        return this.sprite.body.angularVelocity
    }

    public setAngularVelocity(speed: number): void {
        this.sprite.setAngularVelocity(speed)
    }

    public setColor(color: number): void {
        this.sprite.setTint(color)
    }

    public setVisible(status: boolean): void {
        this.sprite.setVisible(status)
    }

    public isBlockedRight(): boolean {
        return this.sprite.body.blocked.right
    }

    public isBlockedDown(): boolean {
        return this.sprite.body.blocked.down
    }

    public doSmallJump(): void {
        this.sprite.setVelocityY(consts.PLAYER.SMALL_JUMP_VELOCITY_Y)
        this.sprite.setRotation(0)
        this.smallRotationTween.restart()
    }

    public doBigJump(): void {
        this.sprite.setVelocityY(consts.PLAYER.BIG_JUMP_VELOCITY_Y)
        this.sprite.setRotation(0)
        this.bigRotationTween.restart()
    }

    public fly(): void {
        this.sprite.setVelocityY(consts.PLAYER.FLYING.VELOCITY_Y)
    }

    public getIsRunning(): boolean {
        return this.isRunning
    }

    public changeToFlyingState(): void {
        if (this.isRunning) {
            this.isRunning = false
            this.ship.setVisible(true)
            this.ship.enableBody(true)

            this.sprite.setScale(0.8)
            this.sprite.setVelocityX(consts.PLAYER.FLYING.VELOCITY_X)
            this.sprite.setGravityY(consts.PLAYER.FLYING.GRAVITY_Y)
        }
    }

    public changeToRunningState(): void {
        this.isRunning = true
        this.ship.setVisible(false)
        this.ship.enableBody(false)

        this.sprite.setScale(1)
        this.sprite.setVisible(true)
        this.sprite.setRotation(0)
        this.sprite.setVelocityX(consts.PLAYER.RUNNING.VELOCITY_X)
        this.sprite.setGravityY(consts.PLAYER.RUNNING.GRAVITY_Y)
        this.setParticle()
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

    public setParticle(): void {
        if (this.particle) {
            this.particle.destroy()
        }
        this.particle = this.scene.add.particles(0, 0, `particle-${this.playerIndex}`, {
            lifespan: 200,
            angle: { min: -100, max: -80 },
            scale: { start: 0.75, end: 0 },
            speed: { min: 100, max: 200 },
            alpha: { start: 1, end: 0 },
            frequency: 50,
            blendMode: 'ADD',
        })
        this.particle.startFollow(this.sprite, consts.PARTICLE.OFFSET_X, consts.PARTICLE.OFFSET_Y)
    }

    public burstParticle(): void {
        this.particle.setParticleScale(0.75, 0.75)
        this.particle.setParticleLifespan(1000)
        this.particle.ops.angle.loadConfig({ angle: { min: 0, max: 360 } })
        this.particle.stopFollow()
        this.particle.explode(50, this.sprite.x, this.sprite.y)

        this.sprite.setVisible(false)
        this.sprite.setVelocityX(0)
        this.sprite.setVelocityY(0)
        this.sprite.setGravityX(0)
        this.sprite.setGravityY(0)

        this.ship.setVisible(false)
        this.ship.enableBody(false)
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
            if (this.smallRotationTween.isPlaying()) {
                this.smallRotationTween.pause()
                this.sprite.setRotation(0)
            }
            if (this.bigRotationTween.isPlaying()) {
                this.bigRotationTween.pause()
                this.sprite.setRotation(0)
            }
        }
    }
}
