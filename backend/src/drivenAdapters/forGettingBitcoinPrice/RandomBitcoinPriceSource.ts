import { ForGettingBitcoinPrice } from '../../drivenPorts/ForGettingBitcoinPrice'
import { randomInt } from 'crypto'

export default class RandomBitcoinPriceSource
    implements ForGettingBitcoinPrice
{
    private currentPrice: number = 100000

    getBitcoinPrice(): Promise<number> {
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
        return Promise.resolve(this.currentPrice)
    }
}
