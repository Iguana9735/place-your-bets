import {
    ClientInfo,
    ForPlacingGuesses,
} from '../drivingPorts/ForPlacingGuesses'
import { ForGettingBitcoinPrice } from '../drivenPorts/ForGettingBitcoinPrice'
import { GuessDirection } from './Guess'
import { ForGettingTheTime } from '../drivenPorts/ForGettingTheTime'
import ForPersisting, { GuessInsert } from '../drivenPorts/ForPersisting'

export class App implements ForPlacingGuesses {
    private forGettingBitcoinPrice: ForGettingBitcoinPrice
    private forGettingTheTime: ForGettingTheTime
    private forPersisting: ForPersisting

    constructor(
        forGettingBitcoinPrice: ForGettingBitcoinPrice,
        forGettingTheTime: ForGettingTheTime,
        forPersisting: ForPersisting
    ) {
        this.forGettingBitcoinPrice = forGettingBitcoinPrice
        this.forGettingTheTime = forGettingTheTime
        this.forPersisting = forPersisting

        this.forGettingTheTime.listenToTicks(() => this.resolveGuesses())
    }

    async getClientInfo(clientId: string): Promise<ClientInfo> {
        return Promise.resolve({
            currentBitcoinPrice:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
            recentGuesses:
                await this.forPersisting.getRecentGuessesOfClient(clientId),
        })
    }

    async submitNewGuess(clientId: string, direction: GuessDirection) {
        const newGuess: GuessInsert = {
            priceAtSubmission:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
            submittedAt: this.forGettingTheTime.getTime(),
            direction: direction,
        }
        await this.forPersisting.insertGuess(clientId, newGuess)
    }

    private async resolveGuesses() {
        const allGuesses = await this.forPersisting.getAllGuesses()
        await Promise.all(
            allGuesses.map((guess) => {
                return this.forPersisting.updateGuess(guess.id, {
                    result: 'CORRECT',
                })
            })
        )
    }
}
