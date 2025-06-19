type Guess = {
    submittedAt: UnixMillis,
    priceAtSubmission: number,
    direction: 'UP' | 'DOWN',
    resolvedAt?: UnixMillis,
    priceAtResolution?: number,
    result?: 'CORRECT' | 'INCORRECT'
}

type UnixMillis = number

type ClientInfo = {
    score: number,
    bitcoinPrice: number,
    recentGuesses: Guess[]
}

export type { Guess, UnixMillis , ClientInfo}
