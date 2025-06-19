import ForPersisting, {
    GuessInsert,
    GuessUpdate,
} from '../../drivenPorts/ForPersisting'
import Guess, { GuessDirection, GuessResult } from '../../app/Guess'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    DynamoDBDocumentClient,
    PutCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb'

type PersistedGuess = {
    id: string
    playerId: string
    priceAtSubmission: number
    submittedAt: number
    direction: GuessDirection
    resolvedAt?: number
    priceAtResolution?: number
    result?: GuessResult
}

const GUESS_TABLE_NAME = 'place-your-bets-guesses'

export default class DynamoDBPersistence implements ForPersisting {
    private guesses: Guess[] = []
    private scores: Record<string, number> = {}

    client = new DynamoDBClient({})
    docClient = DynamoDBDocumentClient.from(this.client)

    async getRecentGuessesOfClient(playerId: string): Promise<Guess[]> {
        return _.cloneDeep(
            this.guesses.filter((guess) => guess.playerId === playerId)
        )
    }

    async insertGuess(guessInsert: GuessInsert): Promise<void> {
        const guess: Guess = {
            ...guessInsert,
            id: uuidv4(),
        }
        this.guesses.push(guess)

        guessInsert.submittedAt.getTime()
        guessInsert.resolvedAt?.getTime()

        const command = new PutCommand({
            TableName: GUESS_TABLE_NAME,
            Item: this.toPersistedGuess(guess),
        })
        await this.docClient.send(command)
    }

    async updateGuess(guessId: string, update: GuessUpdate) {
        const savedGuess = this.guesses.find((guess) => guess.id === guessId)
        if (!savedGuess) {
            return
        }

        Object.assign(savedGuess, update)
        const command = new UpdateCommand({
            TableName: GUESS_TABLE_NAME,
            Key: { id: guessId },
            UpdateExpression: `SET #resolvedAt = :newResolvedAt,
                                   #priceAtResolution = :newPriceAtResolution,
                                   #result = :newResult
                                   `,
            ExpressionAttributeNames: {
                '#resolvedAt': 'resolvedAt',
                '#priceAtResolution': 'priceAtResolution',
                '#result': 'result',
            },
            ExpressionAttributeValues: {
                ':newResolvedAt': update.resolvedAt?.getTime(),
                ':newPriceAtResolution': update.priceAtResolution,
                ':newResult': update.result,
            },
        })
        await this.docClient.send(command)
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

    private toPersistedGuess(guess: Guess): PersistedGuess {
        return {
            ...guess,
            submittedAt: guess.submittedAt.getTime(),
            resolvedAt: guess.resolvedAt?.getTime(),
        }
    }
}
