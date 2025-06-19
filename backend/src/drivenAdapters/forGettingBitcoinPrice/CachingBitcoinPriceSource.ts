import { ForGettingBitcoinPrice } from '../../drivenPorts/ForGettingBitcoinPrice'

export default class CachingBitcoinPriceSource
    implements ForGettingBitcoinPrice
{
    private currentPrice: number = 0
    private lastUpdated = new Date(0)
    private readonly delegate: ForGettingBitcoinPrice
    private readonly validityMillis: number

    constructor(delegate: ForGettingBitcoinPrice, validityMillis: number) {
        this.delegate = delegate
        this.validityMillis = validityMillis
    }

    getBitcoinPrice(): Promise<number> {
        let priceUpToDate: Promise<void>
        if (this.isRecentPrice()) {
            priceUpToDate = Promise.resolve()
        } else {
            priceUpToDate = this.updatePrice()
        }

        return priceUpToDate.then(() => this.currentPrice)
    }

    private isRecentPrice() {
        const timeSinceLastUpdate =
            new Date().getTime() - this.lastUpdated.getTime()
        return timeSinceLastUpdate < this.validityMillis
    }

    private updatePrice(): Promise<void> {
        return this.delegate.getBitcoinPrice().then((price) => {
            this.currentPrice = price
            this.lastUpdated = new Date()
        })
    }
}
