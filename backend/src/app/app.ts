import {
    ClientInfo,
    ForPlacingGuesses,
} from '../drivingPorts/ForPlacingGuesses'
import { ForGettingBitcoinPrice } from '../drivenPorts/ForGettingBitcoinPrice'
import Guess, { GuessDirection } from './Guess'
import { ForGettingTheTime } from '../drivenPorts/ForGettingTheTime'

export class App implements ForPlacingGuesses {
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

    async submitNewGuess(direction: GuessDirection) {
        const newGuess: Guess = {
            priceAtSubmission:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
            submittedAt: this.forGettingTheTime.getTime(),
            direction: direction,
        }
        this.guesses.push(newGuess)
    }
}
