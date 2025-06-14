import {
    ClientInfo,
    ForPlacingGuesses,
} from '../drivingPorts/ForPlacingGuesses'
import { ForGettingBitcoinPrice } from '../drivenPorts/ForGettingBitcoinPrice'
import Guess, { GuessDirection } from './Guess'
import { ForGettingTheTime } from '../drivenPorts/ForGettingTheTime'
import { ForPersisting } from '../drivenPorts/ForPersisting'

export class App implements ForPlacingGuesses {
    private forGettingBitcoinPrice: ForGettingBitcoinPrice
    private forGettingTheTime: ForGettingTheTime
    private forPersisting: ForPersisting

    guesses: Record<string, Guess[]> = {}

    constructor(
        forGettingBitcoinPrice: ForGettingBitcoinPrice,
        forGettingTheTime: ForGettingTheTime,
        forPersisting: ForPersisting
    ) {
        this.forGettingBitcoinPrice = forGettingBitcoinPrice
        this.forGettingTheTime = forGettingTheTime
        this.forPersisting = forPersisting
    }

    async getClientInfo(clientId: string): Promise<ClientInfo> {
        this.initializeClient(clientId)
        return Promise.resolve({
            currentBitcoinPrice:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
            recentGuesses: this.guesses[clientId],
        })
    }

    async submitNewGuess(clientId: string, direction: GuessDirection) {
        this.initializeClient(clientId)
        const newGuess: Guess = {
            priceAtSubmission:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
            submittedAt: this.forGettingTheTime.getTime(),
            direction: direction,
        }
        this.guesses[clientId].push(newGuess)
    }

    private initializeClient(clientId: string) {
        this.guesses[clientId] ||= []
    }
}
