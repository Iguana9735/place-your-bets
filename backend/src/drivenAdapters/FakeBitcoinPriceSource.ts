import {ForGettingBitcoinPrice} from "../drivenPorts/ForGettingBitcoinPrice";

export default class FakeBitcoinPriceSource implements ForGettingBitcoinPrice {

    currentPrice: number = 0

    getBitcoinPrice(): number {
        return this.currentPrice;
    }

    setPrice(price: number) {
        this.currentPrice = price
    }
}