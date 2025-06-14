import { ClientInfo, ForPlacingBets } from '../drivingPorts/ForPlacingBets'
import { ForGettingBitcoinPrice } from '../drivenPorts/ForGettingBitcoinPrice'
import Guess from './Guess'
import { ForGettingTheTime } from '../drivenPorts/ForGettingTheTime'

export class App implements ForPlacingBets {
    private forGettingBitcoinPrice: ForGettingBitcoinPrice
    private forGettingTheTime: ForGettingTheTime

    guesses: Guess[] = []

    constructor(
        forGettingBitcoinPrice: ForGettingBitcoinPrice,
        forGettingTheTime: ForGettingTheTime
    ) {
        this.forGettingBitcoinPrice = forGettingBitcoinPrice
        this.forGettingTheTime = forGettingTheTime
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
            submittedAt: this.forGettingTheTime.getTime(),
        }
        this.guesses.push(newGuess)
    }
}
