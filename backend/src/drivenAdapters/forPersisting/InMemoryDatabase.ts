import ForPersisting, {
    GuessInsert,
    GuessUpdate,
} from '../../drivenPorts/ForPersisting'
import Guess from '../../app/Guess'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

type GuessWithplayerId = Guess & {
    playerId: string
}

export default class InMemoryDatabase implements ForPersisting {
    private guesses: GuessWithplayerId[] = []
    private scores: Record<string, number> = {}

    async getRecentGuessesOfClient(playerId: string): Promise<Guess[]> {
        return _.cloneDeep(
            this.guesses.filter((guess) => guess.playerId === playerId)
        )
    }

    async insertGuess(guess: GuessInsert): Promise<void> {
        this.guesses.push({
            ...guess,
            id: uuidv4(),
        })
    }

    async updateGuess(guessId: string, update: GuessUpdate) {
        const savedGuess = this.guesses.find((guess) => guess.id === guessId)
        if (savedGuess) {
            Object.assign(savedGuess, update)
        }
    }

    async getUnresolvedGuesses(): Promise<Guess[]> {
        const unresolvedGuesses = this.guesses.filter((guess) => !guess.result)
        return _.cloneDeep(unresolvedGuesses)
    }

    async getScore(playerId: string): Promise<number | undefined> {
        return this.scores[playerId]
    }

    async setScore(playerId: string, score: number): Promise<void> {
        this.scores[playerId] = score
    }
}
