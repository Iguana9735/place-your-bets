import ForPersisting, {
    GuessInsert,
    GuessUpdate,
} from '../../drivenPorts/ForPersisting'
import Guess, { GuessDirection, GuessResult } from '../../app/Guess'
import { v4 as uuidv4 } from 'uuid'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    DynamoDBDocumentClient,
    NativeAttributeValue,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb'

export default class DynamoDBPersistence implements ForPersisting {
    readonly guessOperations: GuessTableOperations
    readonly scoreOperations: ScoreTableOperations

    constructor() {
        const client = new DynamoDBClient({})
        const docClient = DynamoDBDocumentClient.from(client)
        this.guessOperations = new GuessTableOperations(docClient)
        this.scoreOperations = new ScoreTableOperations(docClient)
    }

    async getRecentGuessesOfClient(playerId: string): Promise<Guess[]> {
        return this.guessOperations.getRecentGuessesOfClient(playerId)
    }

    async insertGuess(guessInsert: GuessInsert): Promise<void> {
        return this.guessOperations.insertGuess(guessInsert)
    }

    async updateGuess(guessId: string, update: GuessUpdate) {
        return this.guessOperations.updateGuess(guessId, update)
    }

    async getUnresolvedGuesses(): Promise<Guess[]> {
        return this.guessOperations.getUnresolvedGuesses()
    }

    async getScore(playerId: string): Promise<number | undefined> {
        return this.scoreOperations.getScore(playerId)
    }

    async setScore(playerId: string, score: number): Promise<void> {
        return this.scoreOperations.setScore(playerId, score)
    }
}

type PersistedGuess = {
    id: string
    playerId: string
    priceAtSubmission: number
    submittedAt: number
    direction: GuessDirection
    resolvedAt?: number
    priceAtResolution?: number
    result: 'CORRECT' | 'INCORRECT' | 'UNRESOLVED'
}

class GuessTableOperations {
    readonly TABLE_NAME = 'place-your-bets-guesses'
    private guesses: Guess[] = []

    readonly docClient: DynamoDBDocumentClient

    constructor(docClient: DynamoDBDocumentClient) {
        this.docClient = docClient
    }

    async getRecentGuessesOfClient(playerId: string): Promise<Guess[]> {
        return this.queryGuesses(
            new QueryCommand({
                TableName: this.TABLE_NAME,
                IndexName: 'playerId-submittedAt',
                KeyConditionExpression: '#playerId = :playerIdValue',
                ExpressionAttributeNames: {
                    '#playerId': 'playerId',
                },
                ExpressionAttributeValues: {
                    ':playerIdValue': playerId,
                },
                ScanIndexForward: false,
                Limit: 5,
            })
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
            TableName: this.TABLE_NAME,
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
            TableName: this.TABLE_NAME,
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
        return this.queryGuesses(
            new QueryCommand({
                TableName: this.TABLE_NAME,
                IndexName: 'result',
                KeyConditionExpression: '#result = :resultValue',
                ExpressionAttributeNames: {
                    '#result': 'result',
                },
                ExpressionAttributeValues: {
                    ':resultValue': 'UNRESOLVED',
                },
            })
        )
    }

    private async queryGuesses(command: QueryCommand): Promise<Guess[]> {
        const output = await this.docClient.send(command)
        return output.Items?.map((item) => this.fromDynamoDbItem(item)) || []
    }

    private toPersistedGuess(guess: Guess): PersistedGuess {
        return {
            ...guess,
            submittedAt: guess.submittedAt.getTime(),
            resolvedAt: guess.resolvedAt?.getTime(),
            result: guess.result || 'UNRESOLVED',
        }
    }

    private fromDynamoDbItem(
        item: Record<string, NativeAttributeValue>
    ): Guess {
        return {
            id: item.id as string,
            playerId: item.playerId as string,
            submittedAt: new Date(item.submittedAt as number),
            priceAtSubmission: item.priceAtSubmission as number,
            direction: item.direction as GuessDirection,
            resolvedAt: new Date(item.submittedAt as number),
            priceAtResolution: item.priceAtResolution as number,
            result:
                item.result == 'UNRESOLVED'
                    ? undefined
                    : (item.result as GuessResult),
        }
    }
}

class ScoreTableOperations {
    private scores: Record<string, number> = {}

    readonly docClient: DynamoDBDocumentClient

    constructor(docClient: DynamoDBDocumentClient) {
        this.docClient = docClient
    }

    async getScore(playerId: string): Promise<number | undefined> {
        return this.scores[playerId]
    }

    async setScore(playerId: string, score: number): Promise<void> {
        this.scores[playerId] = score
    }
}
