import ForPersisting, {
    GuessInsert,
    GuessUpdate,
} from '../../drivenPorts/ForPersisting'
import Guess from '../../app/Guess'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

type GuessWithplayerId = Guess & {
    playerId: string
}

export default class DynamoDBPersistence implements ForPersisting {
    private guesses: GuessWithplayerId[] = []
    private scores: Record<string, number> = {}

    client = new DynamoDBClient({})
    docClient = DynamoDBDocumentClient.from(this.client)

    async getRecentGuessesOfClient(playerId: string): Promise<Guess[]> {
        return _.cloneDeep(
            this.guesses.filter((guess) => guess.playerId === playerId)
        )
    }

    async insertGuess(guessInsert: GuessInsert): Promise<void> {
        const guess: GuessWithplayerId = {
            ...guessInsert,
            id: uuidv4(),
        }
        this.guesses.push(guess)

        const command = new PutCommand({
            TableName: 'place-your-bets-guesses',
            Item: guess,
        })
        await this.docClient.send(command)
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
