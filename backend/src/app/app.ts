import { ClientInfo, ForPlacingBets } from '../drivingPorts/ForPlacingBets'
import { ForGettingBitcoinPrice } from '../drivenPorts/ForGettingBitcoinPrice'
import Guess from './Guess'

export class App implements ForPlacingBets {
    forGettingBitcoinPrice: ForGettingBitcoinPrice

    guesses: Guess[] = []

    constructor(forGettingBitcoinPrice: ForGettingBitcoinPrice) {
        this.forGettingBitcoinPrice = forGettingBitcoinPrice
    }

    async getClientInfo(): Promise<ClientInfo> {
        return Promise.resolve({
            currentBitcoinPrice:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
            recentGuesses: this.guesses,
        })
    }

    async submitNewGuess() {
        const newGuess: Guess = {
            priceAtSubmission:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
        }
        this.guesses.push(newGuess)
    }
}
