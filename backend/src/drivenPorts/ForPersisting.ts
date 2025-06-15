import Guess, { GuessResult } from '../app/Guess'

export type GuessInsert = Omit<Guess, 'id'>

export type GuessUpdate = {
    resolvedAt?: Date
    priceAtResolution?: number
    result?: GuessResult
}

type ForPersisting = {
    insertGuess(playerId: string, guess: GuessInsert): Promise<void>
    updateGuess(guessId: string, update: GuessUpdate): Promise<void>
    getRecentGuessesOfClient(playerId: string): Promise<Guess[]>
    getAllGuesses(): Promise<Guess[]>
}

export default ForPersisting
