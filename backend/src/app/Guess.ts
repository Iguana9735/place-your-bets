export type GuessDirection = 'UP' | 'DOWN'

type Guess = {
    id: string
    priceAtSubmission: number
    submittedAt: Date
    direction: GuessDirection
    resolvedAt?: Date
    priceAtResolution?: number
    result?: 'CORRECT' | 'INCORRECT'
}

export default Guess
