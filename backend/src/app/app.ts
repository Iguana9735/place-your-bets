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
            priceAtSubmission:
                await this.forGettingBitcoinPrice.getBitcoinPrice(),
            submittedAt: this.forGettingTheTime.getTime(),
            direction: direction,
        }
        await this.forPersisting.insertGuess(playerId, newGuess)
    }

    private async resolveGuesses() {
        const allGuesses = await this.forPersisting.getAllGuesses()
        const now = this.forGettingTheTime.getTime()
        const currentPrice = await this.forGettingBitcoinPrice.getBitcoinPrice()

        for (const guess of allGuesses) {
            if (guess.result) {
                continue
            }

            const notBefore = new Date(guess.submittedAt.getTime() + 60 * 1000)
            if (notBefore >= now) {
                continue
            }
            if (guess.priceAtSubmission === currentPrice) {
                continue
            }

            const actualPriceDirection =
                currentPrice > guess.priceAtSubmission ? 'UP' : 'DOWN'
            const result =
                guess.direction === actualPriceDirection
                    ? 'CORRECT'
                    : 'INCORRECT'

            await this.forPersisting.updateGuess(guess.id, {
                resolvedAt: now,
                priceAtResolution: currentPrice,
                result: result,
            })
        }
    }
}
