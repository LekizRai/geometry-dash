export default class Preload extends Phaser.Scene {
    constructor() {
        super('preload')
    }

    public preload(): void {}
    public create(): void {
        this.scene.start('start')
    }
    public update(time: number, timeInterval: number): void {}
}
