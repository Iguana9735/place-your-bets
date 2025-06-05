type Guess = {
    id: string,
    submittedAt: number,
    priceAtSubmission: number,
    direction: "UP" | "DOWN",
    resolvedAt?: number,
    priceAtResolution?: number,
    result?: "CORRECT" | "INCORRECT"
}