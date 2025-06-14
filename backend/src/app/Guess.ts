export type GuessDirection = 'UP' | 'DOWN'

type Guess = {
    priceAtSubmission: number
    submittedAt: Date
    direction: GuessDirection
}

export default Guess
