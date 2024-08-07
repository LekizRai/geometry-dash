import configs from "../configs/configs"
import consts from "../configs/consts"

export default class Background extends Phaser.Scene {
    private backgrounds: Phaser.Physics.Arcade.Group
    constructor() {
        super('background')
    }

    public preload(): void {}

    public create(): void {
        this.backgrounds = this.physics.add.group({
            allowGravity: false,
            velocityX: consts.BACKGROUND.VELOCITY_X,
        })
        this.backgrounds.create(0, 0, 'background').setOrigin(0, 0).setTint(consts.BACKGROUND.COLOR)
        this.backgrounds.create(512, 0, 'background').setOrigin(0, 0).setTint(consts.BACKGROUND.COLOR)
        this.backgrounds.create(1024, 0, 'background').setOrigin(0, 0).setTint(consts.BACKGROUND.COLOR)

        this.cameras.main.setViewport(0, 0, configs.GAME_WIDTH, configs.GAME_HEIGHT)
        this.scene.sendToBack()
    }

    public update(): void {
        let farthestBackgroundX: number = -1e9
        this.backgrounds.children.iterate((obj: Phaser.GameObjects.GameObject): boolean => {
            if (obj instanceof Phaser.Physics.Arcade.Sprite) {
                if (obj.x + 512 > farthestBackgroundX) {
                    farthestBackgroundX = obj.x + 512
                }
            }
            return true
        })

        this.backgrounds.children.iterate((obj: Phaser.GameObjects.GameObject): boolean => {
            if (obj instanceof Phaser.Physics.Arcade.Sprite) {
                if (obj.x + obj.displayWidth < 0) {
                    obj.setX(farthestBackgroundX)
                }
            }
            return true
        })
    }
}
