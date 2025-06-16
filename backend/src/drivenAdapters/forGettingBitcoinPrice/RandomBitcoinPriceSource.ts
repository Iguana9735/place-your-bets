import { ForGettingBitcoinPrice } from '../../drivenPorts/ForGettingBitcoinPrice'
import { randomInt } from 'crypto'

export default class RandomBitcoinPriceSource
    implements ForGettingBitcoinPrice
{
    private currentPrice: number = 100000
    private lastUpdated = new Date()

    getBitcoinPrice(): Promise<number> {
        if (this.isTimeToUpdate()) {
            this.updatePrice()
        }
        return Promise.resolve(this.currentPrice)
    }

    private isTimeToUpdate() {
        const timeSinceLastUpdate =
            new Date().getTime() - this.lastUpdated.getTime()
        return timeSinceLastUpdate >= 5000
    }

    private updatePrice() {
        switch (randomInt(0, 3)) {
            case 0:
                // No change
                break
            case 1:
                this.currentPrice = this.currentPrice * 1.01
                break
            case 2:
                this.currentPrice = this.currentPrice * 0.99
                break
        }
        this.lastUpdated = new Date()
    }
}
