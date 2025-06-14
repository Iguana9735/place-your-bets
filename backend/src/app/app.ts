import {ClientInfo, ForPlacingBets} from "../drivingPorts/ForPlacingBets";
import {ForGettingBitcoinPrice} from "../drivenPorts/ForGettingBitcoinPrice";

export class App implements ForPlacingBets {

    forGettingBitcoinPrice: ForGettingBitcoinPrice

    // eslint-disable-next-line
    guesses: any[] = []

    constructor(forGettingBitcoinPrice: ForGettingBitcoinPrice) {
        this.forGettingBitcoinPrice = forGettingBitcoinPrice
    }

    async getClientInfo(): Promise<ClientInfo> {
        return Promise.resolve({
            currentBitcoinPrice: await this.forGettingBitcoinPrice.getBitcoinPrice(),
            recentGuesses: this.guesses
        })
    }

    submitNewGuess() {
        this.guesses.push({})
    }
}
