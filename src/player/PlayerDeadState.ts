import consts from '../configs/consts'
import Player from './Player'
import PlayerRunningState from './PlayerRunningState'
import PlayerState from './PlayerState'

export default class PlayerDeadState extends PlayerState {
    constructor(obj: Player) {
        super()
        obj.reset()
    }
    public handleInput(key: string, obj: Player): void {
        if (key == 'restart') {
            // this.player.setX(30000) Level 1
            // this.player.setX(24950) Level 2
            // this.player.setX(29875) Level 3
            obj.setX(consts.PLAYER.INIT_X)
            obj.setY(consts.PLAYER.INIT_Y)
            obj.setState(new PlayerRunningState(obj))
        }
    }

    public update(obj: Player): void {}
}
