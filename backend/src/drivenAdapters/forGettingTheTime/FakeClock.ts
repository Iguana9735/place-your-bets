import { ForGettingTheTime } from '../../drivenPorts/ForGettingTheTime'

export default class FakeClock implements ForGettingTheTime {
    private time: Date = new Date(0)
    private tickListener?: () => Promise<void>

    setTime(time: Date) {
        this.time = time
    }

    getTime(): Date {
        return this.time
    }

    listenToTicks(listener: () => Promise<void>): void {
        this.tickListener = listener
    }

    advanceSeconds(seconds: number) {
        this.time = new Date(this.time.getTime() + seconds * 1000)
    }

    async tick() {
        if (this.tickListener) {
            await this.tickListener()
        }
    }
}
