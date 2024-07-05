const constants = {
    PLAYER: {
        INIT_X: 300,
        INIT_Y: 1450,
        RUNNING: {
            VELOCITY_Y: 0,
            VELOCITY_X: 560,
            GRAVITY_Y: 4745.61,
        },
        FLYING: {
            VELOCITY_Y: -300,
            VELOCITY_X: 360,
            GRAVITY_Y: 600,
        },
        SMALL_JUMP_VELOCITY_Y: -1193.18,
        BIG_JUMP_VELOCITY_Y: -1759.77,
        COLOR: 0xffffff,
    },

    PARTICLE: {
        OFFSET_X: -32,
        OFFSET_Y: 32,
    },

    BACKGROUND: {
        VELOCITY_X: -100,
        COLOR: 0x0000ff,
    },


    FOREGROUND: {
        COLOR: 0x2dff06
    },

    CAMERA: {
        OFFSET_X: -300,
        OFFSET_Y: 0,
    },

    CAMERA_FOLLOW_OBJECT: {
        INIT_X: 300,
        INIT_Y: 1450,
    },

    TILE_BIAS: 36,
}

export default constants
