export type GuessDirection = 'UP' | 'DOWN'

export type GuessResult = 'CORRECT' | 'INCORRECT'

type Guess = {
    id: string
    priceAtSubmission: number
    submittedAt: Date
    direction: GuessDirection
    resolvedAt?: Date
    priceAtResolution?: number
    result?: GuessResult
}

export default Guess
