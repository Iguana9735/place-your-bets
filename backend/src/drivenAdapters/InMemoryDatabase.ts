import { ForPersisting } from '../drivenPorts/ForPersisting'
import Guess from '../app/Guess'
import _ from 'lodash'

export default class InMemoryDatabase implements ForPersisting {
    private guesses: Record<string, Guess[]> = {}

    getRecentGuessesOfClient(clientId: string): Promise<Guess[]> {
        return Promise.resolve(_.cloneDeep(this.guesses[clientId] || []))
    }

    insertGuess(clientId: string, guess: Guess): Promise<void> {
        this.guesses[clientId] ||= []
        this.guesses[clientId].push(_.cloneDeep(guess))
        return Promise.resolve()
    }

    getAllGuesses(): Promise<Guess[]> {
        const allGuesses = Object.entries(this.guesses)
            .map((it) => it[1])
            .flat()

        return Promise.resolve(_.cloneDeep(allGuesses))
    }
}
