import { ForGettingBitcoinPrice } from '../drivenPorts/ForGettingBitcoinPrice'

export default class FakeBitcoinPriceSource implements ForGettingBitcoinPrice {
    currentPrice: number = 0

    getBitcoinPrice(): Promise<number> {
        return Promise.resolve(this.currentPrice)
    }

    setPrice(price: number) {
        this.currentPrice = price
    }
}
