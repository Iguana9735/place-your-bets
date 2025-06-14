import Guess, { GuessDirection } from '../app/Guess'

export type ClientInfo = {
    currentBitcoinPrice: number
    recentGuesses: Guess[]
}

export type ForPlacingGuesses = {
    getClientInfo: () => Promise<ClientInfo>
    submitNewGuess: (direction: GuessDirection) => void
}
