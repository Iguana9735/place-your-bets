export type GuessDirection = 'UP' | 'DOWN'

type Guess = {
    priceAtSubmission: number
    submittedAt: Date
    direction: GuessDirection
    resolvedAt?: Date
    priceAtResolution?: number
    result?: 'CORRECT' | 'INCORRECT'
}

export default Guess
