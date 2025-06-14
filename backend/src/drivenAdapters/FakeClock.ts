import { ForGettingTheTime } from '../drivenPorts/ForGettingTheTime'

export default class FakeClock implements ForGettingTheTime {
    private time: Date = new Date(0)

    setTime(time: Date) {
        this.time = time
    }

    getTime(): Date {
        return this.time
    }
}
