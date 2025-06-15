import Guess from '../app/Guess'

export type GuessInsert = Omit<Guess, 'id'>

type ForPersisting = {
    insertGuess(clientId: string, guess: GuessInsert): Promise<void>
    getRecentGuessesOfClient(clientId: string): Promise<Guess[]>
    getAllGuesses(): Promise<Guess[]>
}

export default ForPersisting
