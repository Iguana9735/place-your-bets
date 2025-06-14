import Guess from '../app/Guess'

export type ForPersisting = {
    insertGuess(clientId: string, guess: Guess): Promise<void>
    getRecentGuessesOfClient(clientId: string): Promise<Guess[]>
}
