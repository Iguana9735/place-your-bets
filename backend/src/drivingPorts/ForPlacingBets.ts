export type ClientInfo = {
    currentBitcoinPrice: number
    // eslint-disable-next-line
    recentGuesses: any[]
}

export type ForPlacingBets = {
    getClientInfo: () => Promise<ClientInfo>
    submitNewGuess: () => void
}
