import { ForGettingBitcoinPrice } from '../../drivenPorts/ForGettingBitcoinPrice'

export default class SettableBitcoinPriceSource
    implements ForGettingBitcoinPrice
{
    currentPrice: number = 0

    getBitcoinPrice(): Promise<number> {
        return Promise.resolve(this.currentPrice)
    }

    setPrice(price: number) {
        this.currentPrice = price
    }
}
