import { ForGettingBitcoinPrice } from '../../drivenPorts/ForGettingBitcoinPrice'
import Guess, { GuessResult } from '../Guess'
import { ForGettingTheTime } from '../../drivenPorts/ForGettingTheTime'
import ForPersisting from '../../drivenPorts/ForPersisting'

export class GuessResolver {
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

    async resolveGuesses() {
        const allGuesses = await this.forPersisting.getAllGuesses()

        for (const guess of allGuesses) {
            await this.resolveAndScore(guess)
        }
    }

    private async resolveAndScore(guess: Guess): Promise<void> {
        const result: GuessResult | undefined =
            await this.resolveGuessIfPossible(guess)
        if (result === 'CORRECT') {
            await this.updatePlayerScore(guess.playerId, 1)
        }
        if (result === 'INCORRECT') {
            await this.updatePlayerScore(guess.playerId, -1)
        }
        return
    }

    private async updatePlayerScore(playerId: string, delta: 1 | -1) {
        await this.forPersisting.setScore(
            playerId,
            ((await this.forPersisting.getScore(playerId)) || 0) + delta
        )
    }

    private async resolveGuessIfPossible(
        guess: Guess
    ): Promise<GuessResult | undefined> {
        const now = this.forGettingTheTime.getTime()
        const currentPrice = await this.forGettingBitcoinPrice.getBitcoinPrice()
        if (guess.result) {
            return
        }

        const notBefore = new Date(guess.submittedAt.getTime() + 60 * 1000)
        if (notBefore >= now) {
            return
        }
        if (guess.priceAtSubmission === currentPrice) {
            return
        }

        const actualPriceDirection =
            currentPrice > guess.priceAtSubmission ? 'UP' : 'DOWN'
        const result =
            guess.direction === actualPriceDirection ? 'CORRECT' : 'INCORRECT'

        await this.forPersisting.updateGuess(guess.id, {
            resolvedAt: now,
            priceAtResolution: currentPrice,
            result: result,
        })

        return result
    }
}
