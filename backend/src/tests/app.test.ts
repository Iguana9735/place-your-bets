import { beforeEach, describe, expect, it } from '@jest/globals'
import { App } from '../app/app'
import FakeBitcoinPriceSource from '../drivenAdapters/FakeBitcoinPriceSource'

describe('app', () => {
    let app: App
    let fakeBitcoinPriceSource: FakeBitcoinPriceSource

    beforeEach(() => {
        fakeBitcoinPriceSource = new FakeBitcoinPriceSource()
        app = new App(fakeBitcoinPriceSource)
    })

    it('provides the current bitcoin price', async () => {
        // When
        const clientInfo = await app.getClientInfo()

        // Then
        expect(typeof clientInfo.currentBitcoinPrice).toBe('number')
    })

    it('obtains the bitcoin price from an external source', async () => {
        // Given
        fakeBitcoinPriceSource.setPrice(123321)

        // When
        const clientInfo = await app.getClientInfo()

        // Then
        expect(clientInfo.currentBitcoinPrice).toBe(123321)
    })

    it('returns a list of guesses', async () => {
        // When
        const clientInfo = await app.getClientInfo()

        // Then
        expect(clientInfo.recentGuesses).toBeDefined()
    })

    it('accepts a new guess', () => {
        expect(() => app.submitNewGuess()).not.toThrow()
    })

    it('returns the submitted guess', async () => {
        // Given
        app.submitNewGuess()

        // When
        const clientInfo = await app.getClientInfo()

        // Then
        expect(clientInfo.recentGuesses).toHaveLength(1)
    })

    it('new guesses remember the price at which they were submitted', async () => {
        // Given
        fakeBitcoinPriceSource.setPrice(111)

        // When
        app.submitNewGuess()

        // Then
        const clientInfo = await app.getClientInfo()
        expect(clientInfo.recentGuesses[0].priceAtSubmission).toBe(111)
    })

    // TODO
    // Caches the bitcoin price - i.e. it does not fetch it every time it is asked to do so
    // New guesses have a time
    // New guesses are up or down
    // Persists the guess to an external repository
    // Returns the guess when asked
    // Different clients have different lists of guesses
    // Does not accept a guess if there is a current open guess for that client
    // Accepts a guess if there are other guesses but they are closed
    // Resolves a guess after 60 seconds if the price has changed
    // Resolves a guess when the price changes if the price hasn't changed after 60 seconds
    // If after 60 seconds, the price has changed but has also returned to the original price,
    //  then it is considered to not have changed, i.e. the guess doesn't resolve until the price changes again
    // Test how numerical precision works. Perhaps it's better to settle on a given precision to begin with, and store
    //  the prices as integers
    // Resolved guesses have the time at which the guess was resolved
    // Resolved guesses have the price at which the guess was resolved
    // Resolved guesses are resolved as either "CORRECT" or "INCORRECT"
    // List of guesses returns only the 5 most recent guesses
    // Players start with a score of 0
    // The score goes up or down as guesses are resolved
})
