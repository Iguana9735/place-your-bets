import { ForGettingBitcoinPrice } from '../../drivenPorts/ForGettingBitcoinPrice'

interface BinancePriceResponse {
    symbol: string
    price: string
}

export default class BinanceBitcoinPriceSource
    implements ForGettingBitcoinPrice
{
    getBitcoinPrice(): Promise<number> {
        return fetch(
            'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Error when fetching bitcoin price: ${response.status} `
                    )
                }
                return response.json()
            })
            .then((data: BinancePriceResponse) => {
                return parseFloat(data.price)
            })
    }
}
