type Guess = {
    id: string,
    submittedAt: UnixSeconds,
    priceAtSubmission: number,
    direction: "UP" | "DOWN",
    resolvedAt?: UnixSeconds,
    priceAtResolution?: number,
    result?: "CORRECT" | "INCORRECT"
}

type UnixSeconds = number

export type {Guess, UnixSeconds}