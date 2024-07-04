export default class Init extends Phaser.Scene {
    constructor() {
        super('init')
    }

    public preload(): void {
        this.load.image('background', 'assets/images/backgrounds/background-1.png')
        this.load.image('geometry-dash-logo', 'assets/images/preload/logo.png')
        this.load.image('lite-logo', 'assets/images/preload/lite.png')
    }

    public create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setTint(0x0000ff)
        this.add.image(512, 0, 'background').setOrigin(0, 0).setTint(0x0000ff)
        this.add.image(150, 100, 'geometry-dash-logo').setOrigin(0, 0).setScale(1.2)
        this.add.image(320, 180, 'lite-logo').setOrigin(0, 0).setScale(2)
        const win = this.add.zone(0, 0, 800, 450).setOrigin(0, 0)
        win.setSize(800, 450)
        this.scene.launch('preload')
    }

    public update(time: number, timeInterval: number): void {}
}
