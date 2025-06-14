export type ClientInfo = {
    currentBitcoinPrice: number
    recentGuesses: any[]
}

export type ForPlacingBets = {
    getClientInfo: () => Promise<ClientInfo>
    submitNewGuess: () => void
}
