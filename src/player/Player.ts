import consts from '../configs/consts'
import GameMap from '../game-map/GameMap'
import GameplayScene from '../scenes/GameplayScene'
import utils from '../utils/utils'
import PlayerRunningState from './PlayerRunningState'
import PlayerState from './PlayerState'

export default class Player {
    private scene: GameplayScene

    private playerIndex: number

    private smallRotationTween: Phaser.Tweens.Tween
    private bigRotationTween: Phaser.Tweens.Tween
    private tweenPausePrevented: boolean

    private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private particle: Phaser.GameObjects.Particles.ParticleEmitter
    private ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    private state: PlayerState

    constructor(scene: GameplayScene, playerIndex: number) {
        this.scene = scene

        this.playerIndex = playerIndex
        this.sprite = this.scene.physics.add.sprite(
            consts.PLAYER.INIT_X,
            consts.PLAYER.INIT_Y,
            `player-${playerIndex}`
        )

        this.ship = this.scene.physics.add.sprite(
            this.sprite.x,
            this.sprite.y,
            `ship-${playerIndex}`
        )

        this.tweenPausePrevented = true
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

        this.state = new PlayerRunningState(this)
    }

    public reset(): void {
        this.enableShip(false)
        this.setVelocityX(0)
        this.setVelocityY(0)
        this.setGravityX(0)
        this.setGravityY(0)
        this.setVisible(false)
        this.setRotation(0)
        this.setScale(1)
    }

    public setState(state: PlayerState): void {
        this.state = state
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

    public setScale(scale: number): void {
        this.sprite.setScale(scale)
    }

    public setRotation(rotation: number): void {
        this.sprite.setRotation(rotation)
    }

    public isBlockedRight(): boolean {
        return this.sprite.body.blocked.right
    }

    public isBlockedDown(): boolean {
        return this.sprite.body.blocked.down
    }

    public pauseTween(): void {
        if (this.smallRotationTween.isPlaying()) {
            this.smallRotationTween.pause()
            this.setRotation(0)
        }
        if (this.bigRotationTween.isPlaying()) {
            console.log(9999)
            this.bigRotationTween.pause()
            this.setRotation(0)
        }
    }

    public getTweenElapsedTime(): number {
        if (this.smallRotationTween.isPlaying()) {
            return this.smallRotationTween.elapsed
        }
        if (this.bigRotationTween.isPlaying()) {
            return this.bigRotationTween.elapsed
        }
        return 1e9
    }

    public doSmallJump(): void {
        this.sprite.setVelocityY(consts.PLAYER.SMALL_JUMP_VELOCITY_Y)
        this.sprite.setRotation(0)
        this.smallRotationTween.restart()
        this.tweenPausePrevented = true
    }

    public doBigJump(): void {
        this.sprite.setVelocityY(consts.PLAYER.BIG_JUMP_VELOCITY_Y)
        this.sprite.setRotation(0)
        this.bigRotationTween.restart()
        this.tweenPausePrevented = true
    }

    public doFlyUp(): void {
        this.sprite.setVelocityY(consts.PLAYER.FLYING.VELOCITY_Y)
    }

    public enableShip(status: boolean): void {
        if (status) {
            this.ship.setVisible(true)
            this.ship.enableBody(true)
        } else {
            this.ship.setVisible(false)
            this.ship.enableBody(false)
        }
    }

    public stickShip(rotation: number): void {
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
    }

    public onCollideWith(
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

    // public onOverlapWith(
    //     obj: Phaser.GameObjects.GameObject,
    //     callback: (
    //         obj1: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject,
    //         obj2: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject
    //     ) => void
    // ): void {
    //     this.scene.physics.add.overlap(obj, this.sprite, callback)
    // }

    public onStartOverlapWith(
        obj: Phaser.GameObjects.GameObject,
        callback: (
            obj1: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject,
            obj2: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject
        ) => void
    ): void {
        this.scene.physics.add.overlap(obj, this.sprite, (obj1, obj2) => {
            if (obj instanceof Phaser.Physics.Arcade.Sprite && utils.isOverlapStarted(obj)) {
                callback(obj1, obj2)
            }
        })
    }

    public resetParticle(): void {
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
    }

    public updateBestScore(): void {
        const value = localStorage.getItem(`level-${this.scene.getLevel()}-best`)
        if (value) {
            let bestScore: number = Number(value)
            if (Math.ceil(this.scene.getCompletingPercent() * 100) > bestScore) {
                bestScore = Math.ceil(this.scene.getCompletingPercent() * 100)
                localStorage.setItem(`level-${this.scene.getLevel()}-best`, String(bestScore))
            }
        } else {
            localStorage.setItem(`level-${this.scene.getLevel()}-best`, '0')
        }
    }

    public update() {
        this.state.update(this)
    }

    public handleInput(key: string) {
        this.state.handleInput(key, this)
    }
}
