import Guess, { GuessDirection } from '../app/Guess'

export type ClientInfo = {
    currentBitcoinPrice: number
    score: number
    recentGuesses: Guess[]
}

export type ForPlacingGuesses = {
    getClientInfo: (playerId: string) => Promise<ClientInfo>
    submitNewGuess: (
        playerId: string,
        direction: GuessDirection
    ) => Promise<void>
}
