import { ForGettingBitcoinPrice } from '../../drivenPorts/ForGettingBitcoinPrice'

interface BinancePriceResponse {
    symbol: string
    price: string
}

export default class BinanceBitcoinPriceSource
    implements ForGettingBitcoinPrice
{
    async getBitcoinPrice(): Promise<number> {
        const response = await fetch(
            'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
        )
        if (!response.ok) {
            throw new Error(
                `Error when fetching bitcoin price: ${response.status} `
            )
        }
        const data: BinancePriceResponse = await response.json()
        return parseFloat(data.price)
    }
}
