import ForPersisting, {
    GuessInsert,
    GuessUpdate,
} from '../drivenPorts/ForPersisting'
import Guess from '../app/Guess'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

type GuessWithplayerId = Guess & {
    playerId: string
}

export default class InMemoryDatabase implements ForPersisting {
    private guesses: GuessWithplayerId[] = []
    private scores: Record<string, number> = {}

    getRecentGuessesOfClient(playerId: string): Promise<Guess[]> {
        return Promise.resolve(
            _.cloneDeep(
                this.guesses.filter((guess) => guess.playerId === playerId)
            )
        )
    }

    insertGuess(playerId: string, guess: GuessInsert): Promise<void> {
        this.guesses.push({
            ...guess,
            id: uuidv4(),
            playerId: playerId,
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

    getScore(playerId: string): Promise<number | undefined> {
        return Promise.resolve(this.scores[playerId])
    }

    setScore(playerId: string, score: number): Promise<void> {
        this.scores[playerId] = score
        return Promise.resolve()
    }
}
