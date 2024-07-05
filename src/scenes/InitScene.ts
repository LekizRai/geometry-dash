import configs from "../configs/configs"
import consts from "../configs/consts"

export default class Init extends Phaser.Scene {
    constructor() {
        super('init')
    }

    public preload(): void {
        this.load.image('background', 'assets/images/backgrounds/background-1.png')
        this.load.image('geometry-dash-logo', 'assets/images/preload/logo.png')
        this.load.image('lite-logo', 'assets/images/preload/lite.png')
        this.load.image('progress-bar', 'assets/images/preload/progress-bar.png')
    }

    public create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setTint(consts.BACKGROUND.COLOR)
        this.add.image(512, 0, 'background').setOrigin(0, 0).setTint(consts.BACKGROUND.COLOR)
        this.add.image(150, 100, 'geometry-dash-logo').setOrigin(0, 0).setScale(1.2)
        this.add.image(320, 180, 'lite-logo').setOrigin(0, 0).setScale(2)
        const win = this.add.zone(0, 0, configs.GAME_WIDTH, configs.GAME_HEIGHT).setOrigin(0, 0)
        win.setSize(configs.GAME_WIDTH, configs.GAME_HEIGHT)
        this.scene.launch('preload')
    }

    public update(time: number, timeInterval: number): void {}
}
