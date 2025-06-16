import { ForGettingTheTime } from '../../drivenPorts/ForGettingTheTime'
import { setInterval } from 'timers'

export default class RealClock implements ForGettingTheTime {
    private time: Date = new Date(0)
    private tickListener?: () => Promise<void>

    constructor() {
        setInterval(() => {
            this.tick()
        }, 1000)
    }

    getTime(): Date {
        return new Date()
    }

    listenToTicks(listener: () => Promise<void>): void {
        this.tickListener = listener
    }

    private tick() {
        if (this.tickListener) {
            this.tickListener()
        }
    }
}
