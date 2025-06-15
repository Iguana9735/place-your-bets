import { ForPersisting } from '../drivenPorts/ForPersisting'
import Guess from '../app/Guess'
import _ from 'lodash'

type GuessWithClientId = Guess & {
    clientId: string
}

export default class InMemoryDatabase implements ForPersisting {
    private guesses: GuessWithClientId[] = []

    getRecentGuessesOfClient(clientId: string): Promise<Guess[]> {
        return Promise.resolve(
            _.cloneDeep(
                this.guesses.filter((guess) => guess.clientId === clientId)
            )
        )
    }

    insertGuess(clientId: string, guess: Guess): Promise<void> {
        this.guesses.push({
            ...guess,
            clientId: clientId,
        })
        return Promise.resolve()
    }

    getAllGuesses(): Promise<Guess[]> {
        return Promise.resolve(_.cloneDeep(this.guesses))
    }
}
