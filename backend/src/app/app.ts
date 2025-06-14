import {ClientInfo, ForPlacingBets} from "../drivingPorts/ForPlacingBets";
import {ForGettingBitcoinPrice} from "../drivenPorts/ForGettingBitcoinPrice";

export class App implements ForPlacingBets {

    forGettingBitcoinPrice: ForGettingBitcoinPrice

    guesses: any[] = []

    constructor(forGettingBitcoinPrice: ForGettingBitcoinPrice) {
        this.forGettingBitcoinPrice = forGettingBitcoinPrice
    }

    getClientInfo(): ClientInfo {
        return {
            currentBitcoinPrice: this.forGettingBitcoinPrice.getBitcoinPrice(),
            recentGuesses: this.guesses
        }
    }

    submitNewGuess() {
        this.guesses.push({})
    }
}
