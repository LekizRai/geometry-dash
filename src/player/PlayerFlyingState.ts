import consts from '../configs/consts'
import Player from './Player'
import PlayerDeadState from './PlayerDeadState'
import PlayerRunningState from './PlayerRunningState'
import PlayerState from './PlayerState'

export default class PlayerFlyingState extends PlayerState {
    constructor(obj: Player) {
        super()
        obj.reset()
        obj.enableShip(true)
        obj.setVisible(true)
        obj.setScale(0.8)
        obj.setVelocityX(consts.PLAYER.FLYING.VELOCITY_X)
        obj.setGravityY(consts.PLAYER.FLYING.GRAVITY_Y)
    }

    public handleInput(key: string, obj: Player): void {
        if (key == 'hit') {
            obj.doFlyUp()
        } else if (key == 'dead') {
            obj.updateBestScore()
            obj.burstParticle()
            obj.setState(new PlayerDeadState(obj))
        } else if (key == 'win-start') {
            obj.setGravityY(0)
            obj.setVelocityX(0)
            obj.setVelocityY(-300)
            obj.setGravityX(1000)
        } else if (key == 'win-end') {
            obj.updateBestScore()
            obj.burstParticle()
            obj.setState(new PlayerDeadState(obj))
        } else if (key == 'running') {
            obj.setState(new PlayerRunningState(obj))
        } else if (key == 'restart') {
            obj.setX(consts.PLAYER.INIT_X)
            obj.setY(consts.PLAYER.INIT_Y)
            obj.setState(new PlayerRunningState(obj))
        }
    }

    public update(obj: Player): void {
        let rotation: number = Math.atan(obj.getVelocityY() / obj.getVelocityX())
        if (Number.isNaN(rotation)) {
            rotation = 0
        }
        obj.setRotation(rotation)
        obj.stickShip(rotation)
    }
}
