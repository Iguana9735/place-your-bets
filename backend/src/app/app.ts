import {ClientInfo, ForPlacingBets} from "../drivingPorts/ForPlacingBets";

export class App implements ForPlacingBets {
    getClientInfo(): ClientInfo {
        return {
            currentBitcoinPrice: Math.random() * 1_000_000
        }
    }
}
