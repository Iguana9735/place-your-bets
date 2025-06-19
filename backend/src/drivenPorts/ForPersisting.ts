import Guess, { GuessResult } from '../app/Guess'

export type GuessInsert = Omit<Guess, 'id'>

export type GuessUpdate = {
    resolvedAt?: Date
    priceAtResolution?: number
    result?: GuessResult
}

type ForPersisting = {
    insertGuess(guess: GuessInsert): Promise<void>
    updateGuess(guessId: string, update: GuessUpdate): Promise<void>
    getRecentGuessesOfClient(playerId: string): Promise<Guess[]>
    getUnresolvedGuesses(): Promise<Guess[]>

    getScore(playerId: string): Promise<number | undefined>
    setScore(playerId: string, score: number): Promise<void>
}

export default ForPersisting
