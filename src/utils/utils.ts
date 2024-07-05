const utils = {
    isOverlapStarted: (obj: Phaser.Physics.Arcade.Sprite) => {
        if (obj.body) {
            return !obj.body.touching.none && obj.body.wasTouching.none
        }
        return false
    },

    isOverlapEnded: (obj: Phaser.Physics.Arcade.Sprite) => {
        if (obj.body) {
            return obj.body.touching.none && !obj.body.wasTouching.none
        }
        return false
    },
}

export default utils
