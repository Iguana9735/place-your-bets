export type ClientInfo = {
    currentBitcoinPrice: number
    recentGuesses: any[]
}

export type ForPlacingBets = {
    getClientInfo: () => ClientInfo
    submitNewGuess: () => void
}
