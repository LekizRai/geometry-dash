import GameMap from "../game-levels/GameMap"

export default class Player {
    private scene: Phaser.Scene
    private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private ship: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private container: Phaser.GameObjects.Container
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
                this.sprite.setVelocityY(-1363.64)
                this.scene.add.tween({
                    targets: this.sprite,
                    rotation: Math.PI,
                    duration: 250,
                })
                this.sprite.setRotation(0)
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
            this.sprite.setVelocityX(200)
            this.sprite.setGravityY(200)
        }
    }

    public changeToRunningState(): void {
        if (!this.isRunning) {
            this.isRunning = true
            this.ship.setVisible(false)
            this.ship.enableBody(false)
            this.sprite.setGravityY(6198.35)
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
            }
            else {
                this.scene.physics.add.collider(obj.getForegroundLayer(), this.sprite, callback)
            }
        }
        else {
            if (obj instanceof Phaser.GameObjects.GameObject) {
                this.scene.physics.add.collider(obj, this.sprite)
                }
                else {
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
        }
    }
}
