import ForPersisting, {
    GuessInsert,
    GuessUpdate,
} from '../drivenPorts/ForPersisting'
import Guess from '../app/Guess'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

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

    insertGuess(clientId: string, guess: GuessInsert): Promise<void> {
        this.guesses.push({
            ...guess,
            id: uuidv4(),
            clientId: clientId,
        })
        return Promise.resolve()
    }

    updateGuess(guessId: string, update: GuessUpdate) {
        const savedGuess = this.guesses.find((guess) => guess.id === guessId)
        if (savedGuess) {
            Object.assign(savedGuess, update)
        }
        return Promise.resolve()
    }

    getAllGuesses(): Promise<Guess[]> {
        return Promise.resolve(_.cloneDeep(this.guesses))
    }
}
