export default class GameMap {
    private scene: Phaser.Scene

    private tileMap: Phaser.Tilemaps.Tilemap

    private foregroundLayer: Phaser.Tilemaps.TilemapLayer

    private objectListDictionary: { [name: string]: Phaser.GameObjects.GameObject[] }

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.objectListDictionary = {}
    }

    public load(level: number): void {
        this.tileMap = this.scene.make.tilemap({
            key: `tile-map-level-${level}`,
            tileWidth: 32,
            tileHeight: 32,
        })
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
                    obj.setY(obj.y)
                    obj.setX(obj.x)
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

    public getWidth(): number {
        return this.tileMap.widthInPixels
    }

    public getForegroundLayer(): Phaser.Tilemaps.TilemapLayer {
        return this.foregroundLayer
    }

    public setForegroundColor(color: number): void {
        this.foregroundLayer.setTint(color)
    }
}
