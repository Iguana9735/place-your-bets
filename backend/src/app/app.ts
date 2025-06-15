import {
    ClientInfo,
    ForPlacingGuesses,
} from '../drivingPorts/ForPlacingGuesses'
import { ForGettingBitcoinPrice } from '../drivenPorts/ForGettingBitcoinPrice'
import { GuessDirection } from './Guess'
import { ForGettingTheTime } from '../drivenPorts/ForGettingTheTime'
import ForPersisting, { GuessInsert } from '../drivenPorts/ForPersisting'
import { GuessResolver } from './internal/GuessResolver'

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

        const guessResolver = new GuessResolver(
            forGettingBitcoinPrice,
            forGettingTheTime,
            forPersisting
        )
        this.forGettingTheTime.listenToTicks(() =>
            guessResolver.resolveGuesses()
        )
    }

    async getClientInfo(playerId: string): Promise<ClientInfo> {
        return Promise.resolve({
            currentBitcoinPrice:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
            score: (await this.forPersisting.getScore(playerId)) || 0,
            recentGuesses:
                await this.forPersisting.getRecentGuessesOfClient(playerId),
        })
    }

    async submitNewGuess(
        playerId: string,
        direction: GuessDirection
    ): Promise<void> {
        const pastGuesses =
            await this.forPersisting.getRecentGuessesOfClient(playerId)
        if (pastGuesses.filter((guess) => !guess.result).length > 0) {
            return Promise.reject('Only one guess at a time is allowed')
        }

        const newGuess: GuessInsert = {
            playerId: playerId,
            priceAtSubmission:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
            submittedAt: this.forGettingTheTime.getTime(),
            direction: direction,
        }
        await this.forPersisting.insertGuess(newGuess)
    }
}
