import { ForPersisting } from '../drivenPorts/ForPersisting'
import Guess from '../app/Guess'

export default class InMemoryDatabase implements ForPersisting {
    private guesses: Record<string, Guess[]> = {}

    getRecentGuessesOfClient(clientId: string): Promise<Guess[]> {
        return Promise.resolve(this.guesses[clientId] || [])
    }

    insertGuess(clientId: string, guess: Guess): Promise<void> {
        this.guesses[clientId] ||= []
        this.guesses[clientId].push(guess)
        return Promise.resolve()
    }
}
