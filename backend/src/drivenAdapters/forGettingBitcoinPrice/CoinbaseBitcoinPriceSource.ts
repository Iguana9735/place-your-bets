import { ForGettingBitcoinPrice } from '../../drivenPorts/ForGettingBitcoinPrice'

interface CoinbasePriceResponse {
    data: {
        currency: string
        rates: Record<string, string>
    }
}

export default class CoinbaseBitcoinPriceSource
    implements ForGettingBitcoinPrice
{
    async getBitcoinPrice(): Promise<number> {
        const response = await fetch(
            'https://api.coinbase.com/v2/exchange-rates?currency=BTC'
        )
        if (!response.ok) {
            throw new Error(
                `Error when fetching bitcoin price: ${response.status} `
            )
        }
        const data: CoinbasePriceResponse = await response.json()
        return parseFloat(data.data.rates['USD'])
    }
}
