export default class AudioManager {
    private soundDictionary: { [key: string]: Phaser.Sound.BaseSound }
    private static instance: AudioManager

    private constructor() {
        this.soundDictionary = {}
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new AudioManager()
        }
        return this.instance
    }

    public add(name: string, audio: Phaser.Sound.BaseSound) {
        this.soundDictionary[name] = audio
    }

    public play(name: string) {
        const audio = this.soundDictionary[name]
        if (audio) {
            audio.play()
        }
    }

    public pause(name: string) {
        const audio = this.soundDictionary[name]
        if (audio) {
            audio.pause()
        }
    }

    public pauseAll() {
        for (let key in Object.keys(this.soundDictionary)) {
            this.soundDictionary[key].pause()
        }
    }

    public resume(name: string) {
        const audio = this.soundDictionary[name]
        if (audio) {
            audio.resume()
        }
    }

    public resumeAll() {
        for (let key in Object.keys(this.soundDictionary)) {
            this.soundDictionary[key].resume()
        }
    }

    public stop(name: string) {
        const audio = this.soundDictionary[name]
        if (audio) {
            audio.stop()
        }
    }

    public stopAll() {
        for (let key in Object.keys(this.soundDictionary)) {
            this.soundDictionary[key].stop()
        }
    }
}
