import { beforeEach, describe, expect, it } from '@jest/globals'
import { App } from '../app/app'
import FakeBitcoinPriceSource from '../drivenAdapters/FakeBitcoinPriceSource'
import FakeClock from '../drivenAdapters/FakeClock'
import InMemoryDatabase from '../drivenAdapters/InMemoryDatabase'

describe('app', () => {
    let app: App
    let fakeBitcoinPriceSource: FakeBitcoinPriceSource
    let fakeClock: FakeClock

    beforeEach(() => {
        fakeBitcoinPriceSource = new FakeBitcoinPriceSource()
        fakeClock = new FakeClock()
        app = new App(fakeBitcoinPriceSource, fakeClock, new InMemoryDatabase())
    })

    describe('bitcoin price', () => {
        it('provides the current bitcoin price', async () => {
            // When
            const clientInfo = await app.getClientInfo('client-A')

            // Then
            expect(typeof clientInfo.currentBitcoinPrice).toBe('number')
        })

        it('obtains the bitcoin price from an external source', async () => {
            // Given
            fakeBitcoinPriceSource.setPrice(123321)

            // When
            const clientInfo = await app.getClientInfo('client-A')

            // Then
            expect(clientInfo.currentBitcoinPrice).toBe(123321)
        })
    })

    describe('entering and querying guesses', () => {
        it('returns a list of guesses', async () => {
            // When
            const clientInfo = await app.getClientInfo('client-A')

            // Then
            expect(clientInfo.recentGuesses).toBeDefined()
        })

        it('accepts a new guess', () => {
            expect(
                async () => await app.submitNewGuess('client-A', 'UP')
            ).not.toThrow()
        })

        it('returns the submitted guess', async () => {
            // Given
            await app.submitNewGuess('client-A', 'UP')

            // When
            const clientInfo = await app.getClientInfo('client-A')

            // Then
            expect(clientInfo.recentGuesses).toHaveLength(1)
        })

        it('knows the price at which guesses were submitted', async () => {
            // Given
            fakeBitcoinPriceSource.setPrice(111)

            // When
            await app.submitNewGuess('client-A', 'UP')

            // Then
            const clientInfo = await app.getClientInfo('client-A')
            expect(clientInfo.recentGuesses[0].priceAtSubmission).toBe(111)
        })

        it('knows the time at which guesses were submitted', async () => {
            // Given
            fakeClock.setTime(new Date('2020-01-01T00:00:00Z'))

            // When
            await app.submitNewGuess('client-A', 'UP')

            // Then
            const clientInfo = await app.getClientInfo('client-A')
            expect(clientInfo.recentGuesses[0].submittedAt).toEqual(
                new Date('2020-01-01T00:00:00Z')
            )
        })

        it('accepts guesses for "UP"', async () => {
            // When
            await app.submitNewGuess('client-A', 'UP')

            // Then
            const clientInfo = await app.getClientInfo('client-A')
            expect(clientInfo.recentGuesses[0].direction).toEqual('UP')
        })

        it('accepts guesses for "DOWN"', async () => {
            // When
            await app.submitNewGuess('client-A', 'DOWN')

            // Then
            const clientInfo = await app.getClientInfo('client-A')
            expect(clientInfo.recentGuesses[0].direction).toEqual('DOWN')
        })
    })

    it('keeps separate guesses for separate clients', async () => {
        // When
        await app.submitNewGuess('client-A', 'UP')
        await app.submitNewGuess('client-B', 'DOWN')

        // Then
        const infoClientA = await app.getClientInfo('client-A')
        const infoClientB = await app.getClientInfo('client-B')
        expect(infoClientA.recentGuesses[0].direction).toBe('UP')
        expect(infoClientB.recentGuesses[0].direction).toBe('DOWN')
    })

    it('persists the guesses to an external repository', async () => {
        // Given
        const database = new InMemoryDatabase()
        const appA = new App(fakeBitcoinPriceSource, fakeClock, database)
        await appA.submitNewGuess('client-A', 'UP')

        // When
        const appB = new App(fakeBitcoinPriceSource, fakeClock, database)

        // Then
        const clientInfo = await appB.getClientInfo('client-A')
        expect(clientInfo.recentGuesses).toHaveLength(1)
    })

    // TODO
    // Caches the bitcoin price - i.e. it does not fetch it every time it is asked to do so
    // Returns the guess when asked
    // Does not accept a guess if there is a current open guess for that client
    // Accepts a guess if there are other guesses but they are closed
    // Resolves a guess after 60 seconds if the price has changed
    // Does not resolve a guess before 60 seconds, even if the price has changed
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
