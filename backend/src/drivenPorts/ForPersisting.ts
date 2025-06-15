import Guess, { GuessResult } from '../app/Guess'

export type GuessInsert = Omit<Guess, 'id'>

export type GuessUpdate = {
    resolvedAt?: Date
    priceAtResolution?: number
    result?: GuessResult
}

type ForPersisting = {
    insertGuess(clientId: string, guess: GuessInsert): Promise<void>
    updateGuess(guessId: string, update: GuessUpdate): Promise<void>
    getRecentGuessesOfClient(clientId: string): Promise<Guess[]>
    getAllGuesses(): Promise<Guess[]>
}

export default ForPersisting
