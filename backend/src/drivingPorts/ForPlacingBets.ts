export type ClientInfo = {
    currentBitcoinPrice: number
}

export type ForPlacingBets = {
    getClientInfo: () => ClientInfo
}
