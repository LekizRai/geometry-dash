export default class GameMap {
    private scene: Phaser.Scene

    private level: number

    private tileMap: Phaser.Tilemaps.Tilemap

    private foregroundLayer: Phaser.Tilemaps.TilemapLayer
    private objectsLayer: Phaser.Tilemaps.TilemapLayer

    private objectListDictionary: { [name: string]: Phaser.GameObjects.GameObject[] }

    // private spikeList: Phaser.GameObjects.GameObject[]
    // private flyingPortalList: Phaser.GameObjects.GameObject[]
    // private runningPortalList: Phaser.GameObjects.GameObject[]
    // private cameraHalfUpList: Phaser.GameObjects.GameObject[]
    // private cameraUpList: Phaser.GameObjects.GameObject[]
    // private cameraHalfDownList: Phaser.GameObjects.GameObject[]
    // private cameraUpList: Phaser.GameObjects.GameObject[]

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.level = 1
        this.objectListDictionary = {}
    }

    public load(level: number): void {
        this.level = level
        this.tileMap = this.scene.make.tilemap({ key: 'tile-map', tileWidth: 32, tileHeight: 32 })
        const foregroundTileSet = this.tileMap.addTilesetImage('geometry-dash', 'geometry-dash')
        if (foregroundTileSet) {
            const foregroundLayer = this.tileMap.createLayer('foreground', foregroundTileSet, 0, 0)
            if (foregroundLayer) {
                this.foregroundLayer = foregroundLayer
            }
            this.foregroundLayer.setCollisionByProperty({ isCollided: true })
        }
    }

    public initializeObjectList(name: string): void {
        const objectList = this.tileMap.createFromObjects('objects', {
            name: name,
            classType: Phaser.Physics.Arcade.Sprite,
        })
        if (objectList.length > 0) {
            objectList.forEach((obj: Phaser.GameObjects.GameObject) => {
                if (obj instanceof Phaser.Physics.Arcade.Sprite) {
                    obj.setY(obj.y + 1025)
                    obj.setX(obj.x + 1025)
                    obj.setVisible(false)
                    this.scene.physics.add.existing(obj)
                }
            })
            this.objectListDictionary[name] = objectList
        }
    }

    public addActionToObjectList(
        name: string,
        callback: (obj: Phaser.GameObjects.GameObject) => void
    ): void {
        if (this.objectListDictionary[name]) {
            this.objectListDictionary[name].forEach((obj: Phaser.GameObjects.GameObject): void => {
                callback(obj)
            })
        }
    }

    public getForegroundLayer(): Phaser.Tilemaps.TilemapLayer {
        return this.foregroundLayer
    }

    public setForegroundTint(color: number): void {
        this.foregroundLayer.setTint(color)
    }

    public substract(): void {}
}
