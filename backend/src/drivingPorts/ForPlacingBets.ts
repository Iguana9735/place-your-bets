import Guess from '../app/Guess'

export type ClientInfo = {
    currentBitcoinPrice: number
    recentGuesses: Guess[]
}

export type ForPlacingBets = {
    getClientInfo: () => Promise<ClientInfo>
    submitNewGuess: () => void
}
