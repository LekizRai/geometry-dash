export default class Player {
    private scene: Phaser.Scene
    private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    private ship: any
    private container: Phaser.GameObjects.Container
    private isRunning: boolean

    constructor(scene: Phaser.Scene, x?: number, y?: number, playerIndex?: number) {
        this.scene = scene
        if (x) {
            if (y) {
                this.container = this.scene.add.container(x, y)
                // this.sprite = this.scene.physics.add.sprite(x, y, 'player')
            } else {
                this.container = this.scene.add.container(x, 0)
                // this.sprite = this.scene.physics.add.sprite(x, 0, 'player')
            }
            // this.scene.physics.add.sprite(200 + 32, 1700, 'player')
        } else {
            this.container = this.scene.add.container(0, 0)
            // this.sprite = this.scene.physics.add.sprite(0, 0, 'player')
        }
        this.ship = this.scene.physics.add.sprite(0, 0, 'ship')
        this.ship.setVisible(false)
        this.sprite = this.scene.physics.add.sprite(0, 0, 'player')

        // this.container = this.scene.add.container(200 + 32, 1700)
        this.container.add(this.sprite)
        this.container.add(this.ship)
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
                this.sprite.setVelocityY(-1818.18)
                this.scene.add.tween({
                    targets: this.sprite,
                    rotation: Math.PI,
                    duration: 250,
                })
                this.sprite.setRotation(0)
            }
        } else {
            this.sprite.setVelocityY(-200)
            this.ship.setVelocityY(-200)

            this.sprite.setRotation(10)
            this.ship.setRotation(10)

            console.log(this.container.x)
        }
    }

    public changeState(): void {
        this.isRunning = !this.isRunning
        if (!this.isRunning) {
            this.ship.setVisible(true)
            this.ship.setX(this.sprite.x)
            this.ship.setY(this.sprite.y)
            this.ship.setVelocityX(this.getVelocityX())
            this.ship.setVelocityY(this.getVelocityY())
            this.ship.setGravityY(200)
            this.sprite.setGravityY(200)
        } else {    
            this.ship.setVisible(false)
            this.sprite.setGravityY(8264.46)
        }
    }

    public collideWith(
        obj: Phaser.GameObjects.GameObject,
        callback: (
            obj1: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject,
            obj2: Phaser.Tilemaps.Tile | Phaser.GameObjects.GameObject
        ) => void
    ): void {
        this.scene.physics.add.collider(obj, this.sprite, callback)
        // this.scene.physics.add.collider(obj, this.ship)
    }

    public update(): void {
        if (!this.isRunning) {
            const rotation: number = Math.atan(this.getVelocityY() / this.getVelocityX())
            console.log(rotation)
            this.sprite.setRotation(rotation)
            this.ship.setRotation(rotation)
        }
    }
}
