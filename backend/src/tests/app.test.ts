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
            const clientInfo = await app.getClientInfo('player-A')

            // Then
            expect(typeof clientInfo.currentBitcoinPrice).toBe('number')
        })

        it('obtains the bitcoin price from an external source', async () => {
            // Given
            fakeBitcoinPriceSource.setPrice(123321)

            // When
            const clientInfo = await app.getClientInfo('player-A')

            // Then
            expect(clientInfo.currentBitcoinPrice).toBe(123321)
        })
    })

    describe('entering and querying guesses', () => {
        it('returns a list of guesses', async () => {
            // When
            const clientInfo = await app.getClientInfo('player-A')

            // Then
            expect(clientInfo.recentGuesses).toBeDefined()
        })

        it('accepts a new guess', async () => {
            await app.submitNewGuess('player-A', 'UP')
        })

        it('returns the submitted guess', async () => {
            // Given
            await app.submitNewGuess('player-A', 'UP')

            // When
            const clientInfo = await app.getClientInfo('player-A')

            // Then
            expect(clientInfo.recentGuesses).toHaveLength(1)
        })

        it('knows the price at which guesses were submitted', async () => {
            // Given
            fakeBitcoinPriceSource.setPrice(111)

            // When
            await app.submitNewGuess('player-A', 'UP')

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].priceAtSubmission).toBe(111)
        })

        it('knows the time at which guesses were submitted', async () => {
            // Given
            fakeClock.setTime(new Date('2020-01-01T00:00:00Z'))

            // When
            await app.submitNewGuess('player-A', 'UP')

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].submittedAt).toEqual(
                new Date('2020-01-01T00:00:00Z')
            )
        })

        it('accepts guesses for "UP"', async () => {
            // When
            await app.submitNewGuess('player-A', 'UP')

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].direction).toEqual('UP')
        })

        it('accepts guesses for "DOWN"', async () => {
            // When
            await app.submitNewGuess('player-A', 'DOWN')

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].direction).toEqual('DOWN')
        })
    })

    it('keeps separate guesses for separate players', async () => {
        // When
        await app.submitNewGuess('player-A', 'UP')
        await app.submitNewGuess('player-B', 'DOWN')

        // Then
        const infoClientA = await app.getClientInfo('player-A')
        const infoClientB = await app.getClientInfo('player-B')
        expect(infoClientA.recentGuesses[0].direction).toBe('UP')
        expect(infoClientB.recentGuesses[0].direction).toBe('DOWN')
    })

    it('persists the guesses to an external repository', async () => {
        // Given
        const database = new InMemoryDatabase()
        const appA = new App(fakeBitcoinPriceSource, fakeClock, database)
        await appA.submitNewGuess('player-A', 'UP')

        // When
        const appB = new App(fakeBitcoinPriceSource, fakeClock, database)

        // Then
        const clientInfo = await appB.getClientInfo('player-A')
        expect(clientInfo.recentGuesses).toHaveLength(1)
    })

    describe('guess resolution', () => {
        it('new guesses are unresolved at first', async () => {
            // Given
            await app.submitNewGuess('player-A', 'UP')

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].resolvedAt).toBeUndefined()
            expect(
                clientInfo.recentGuesses[0].priceAtResolution
            ).toBeUndefined()
            expect(clientInfo.recentGuesses[0].result).toBeUndefined()
        })

        it('resolves a guess after 60 seconds if the price has changed', async () => {
            // Given
            const initialTime = new Date('2020-01-01T00:00:00Z')
            fakeClock.setTime(initialTime)
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'UP')

            // When
            fakeBitcoinPriceSource.setPrice(101)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses).toHaveLength(1)
            expect(clientInfo.recentGuesses[0].result).toBe('CORRECT')
        })

        it('does not resolve a guess before 60 seconds, even if the price has changed', async () => {
            // Given
            const initialTime = new Date('2020-01-01T00:00:00Z')
            fakeClock.setTime(initialTime)
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'UP')

            // When
            fakeBitcoinPriceSource.setPrice(101)
            fakeClock.advanceSeconds(50)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses).toHaveLength(1)
            expect(clientInfo.recentGuesses[0].result).toBeUndefined()
        })

        it('does not resolve a guess if the price has not changed', async () => {
            // Given
            const initialTime = new Date('2020-01-01T00:00:00Z')
            fakeClock.setTime(initialTime)
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'UP')

            // When
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses).toHaveLength(1)
            expect(clientInfo.recentGuesses[0].result).toBeUndefined()
        })

        it('extended scenario', async () => {
            const initialTime = new Date('2020-01-01T00:00:00Z')
            fakeClock.setTime(initialTime)
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'UP')

            let clientInfo

            // 10 pass (+10)...
            fakeClock.advanceSeconds(10)
            await fakeClock.tick()

            // ... nothing happens
            clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].result).toBeUndefined()

            // 10 seconds pass (+20), price goes down
            fakeBitcoinPriceSource.setPrice(99)
            fakeClock.advanceSeconds(10)
            await fakeClock.tick()

            // ... nothing happens
            clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].result).toBeUndefined()

            // 10 seconds pass (+30), price returns to the original value
            fakeBitcoinPriceSource.setPrice(100)
            fakeClock.advanceSeconds(10)
            await fakeClock.tick()

            // ... nothing happens
            clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].result).toBeUndefined()

            // Several minutes pass without the price changing...
            fakeClock.advanceSeconds(1000)
            await fakeClock.tick()

            // ... nothing happens
            clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].result).toBeUndefined()

            // Price goes up...
            fakeBitcoinPriceSource.setPrice(101)
            fakeClock.advanceSeconds(1)
            await fakeClock.tick()

            // ... guess is resolved
            clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].result).toBe('CORRECT')
        })

        it('resolved guesses have the time at which the guess was resolved', async () => {
            // Given
            const initialTime = new Date('2020-01-01T00:00:00Z')
            fakeClock.setTime(initialTime)
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'UP')

            // When
            fakeBitcoinPriceSource.setPrice(101)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].resolvedAt).toEqual(
                new Date('2020-01-01T00:01:20Z')
            )
        })

        it('resolved guesses have the price at which the guess was resolved', async () => {
            // Given
            const initialTime = new Date('2020-01-01T00:00:00Z')
            fakeClock.setTime(initialTime)
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'UP')

            // When
            fakeBitcoinPriceSource.setPrice(101)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].priceAtResolution).toEqual(101)
        })

        it('resolves guesses only once', async () => {
            // Given
            const initialTime = new Date('2020-01-01T00:00:00Z')
            fakeClock.setTime(initialTime)
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'UP')

            fakeBitcoinPriceSource.setPrice(101)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // When
            fakeBitcoinPriceSource.setPrice(102)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].priceAtResolution).toEqual(101)
        })
    })

    describe('guess result', () => {
        it('is correct if the user guessed up and the price went up', async () => {
            // Given
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'UP')

            // When
            fakeBitcoinPriceSource.setPrice(101)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].result).toEqual('CORRECT')
        })

        it('is correct if the user guessed down and the price went down', async () => {
            // Given
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'DOWN')

            // When
            fakeBitcoinPriceSource.setPrice(99)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].result).toEqual('CORRECT')
        })
        it('is incorrect if the user guessed up and the price went down', async () => {
            // Given
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'UP')

            // When
            fakeBitcoinPriceSource.setPrice(99)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].result).toEqual('INCORRECT')
        })
        it('is incorrect if the user guessed down and the price went up', async () => {
            // Given
            fakeBitcoinPriceSource.setPrice(100)
            await app.submitNewGuess('player-A', 'DOWN')

            // When
            fakeBitcoinPriceSource.setPrice(101)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.recentGuesses[0].result).toEqual('INCORRECT')
        })
    })

    describe('simultaneous guesses', () => {
        it('does not accept a guess if there is a current guess unresolved for that player', async () => {
            // Given
            await app.submitNewGuess('player-A', 'UP')

            // Then
            await expect(
                app.submitNewGuess('player-A', 'DOWN')
            ).rejects.toBeDefined()
        })

        it('accepts a guess even if a different player already has an unresolved guess', async () => {
            // Given
            await app.submitNewGuess('player-A', 'UP')

            // Then (doesn't throw)
            await app.submitNewGuess('player-B', 'UP')
        })

        it('accepts a guess even if a the player has past guesses, as long as they have resolved already', async () => {
            // Given
            await app.submitNewGuess('player-A', 'UP')
            fakeBitcoinPriceSource.setPrice(123)
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()

            // Then (doesn't throw)
            await app.submitNewGuess('player-A', 'UP')
        })
    })

    describe('scoring', () => {
        const makeGuess = async (
            clientId: string,
            guessedDirection: 'UP' | 'DOWN',
            priceDelta: number
        ) => {
            await app.submitNewGuess(clientId, guessedDirection)
            fakeBitcoinPriceSource.setPrice(
                (await fakeBitcoinPriceSource.getBitcoinPrice()) + priceDelta
            )
            fakeClock.advanceSeconds(80)
            await fakeClock.tick()
        }

        it('initial score is 0', async () => {
            const clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.score).toBe(0)
        })

        it.skip('score goes up when good guesses are made', async () => {
            // When
            makeGuess('player-A', 'UP', 1)

            // Then
            let clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.score).toBe(1)

            // When
            makeGuess('player-A', 'DOWN', -1)

            // Then
            clientInfo = await app.getClientInfo('player-A')
            expect(clientInfo.score).toBe(2)
        })
    })

    // TODO
    // Caches the bitcoin price - i.e. it does not fetch it every time it is asked to do so
    // Test how numerical precision works. Perhaps it's better to settle on a given precision to begin with, and store
    //  the prices as integers
    // List of guesses returns only the 5 most recent guesses
    // Players start with a score of 0
    // The score goes up or down as guesses are resolved
    // Scoring is independent across clients
    // Guess resolution has to be somewhat efficient (i.e. don't query lots of stuff on every tick)
})
