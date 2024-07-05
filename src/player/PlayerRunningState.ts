import Player from './Player'
import PlayerState from './PlayerState'
import PlayerFlyingState from './PlayerFlyingState'
import PlayerDeadState from './PlayerDeadState'
import consts from '../configs/consts'

export default class PlayerRunningState extends PlayerState {
    constructor(obj: Player) {
        super()
        obj.reset()
        obj.setVisible(true)
        obj.setVelocityX(consts.PLAYER.RUNNING.VELOCITY_X)
        obj.setGravityY(consts.PLAYER.RUNNING.GRAVITY_Y)
        obj.resetParticle()
    }

    public handleInput(key: string, obj: Player): void {
        if (key == 'hit') {
            obj.doSmallJump()
        } else if (key == 'jump') {
            obj.doBigJump()
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
        } else if (key == 'flying') {
            obj.setState(new PlayerFlyingState(obj))
        } else if (key == 'restart') {
            obj.setX(consts.PLAYER.INIT_X)
            obj.setY(consts.PLAYER.INIT_Y)
        }
    }

    public update(obj: Player): void {
        if (obj.isBlockedDown()) {
            if (obj.getTweenElapsedTime() > 100) {
                obj.pauseTween()
            }
        }
    }
}
