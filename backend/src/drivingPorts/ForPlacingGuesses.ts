import Guess, { GuessDirection } from '../app/Guess'

export type ClientInfo = {
    currentBitcoinPrice: number
    score: number
    recentGuesses: Guess[]
}

export type ForPlacingGuesses = {
    getClientInfo: (clientId: string) => Promise<ClientInfo>
    submitNewGuess: (
        clientId: string,
        direction: GuessDirection
    ) => Promise<void>
}
