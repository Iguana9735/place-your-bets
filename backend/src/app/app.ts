export class App implements ForGettingCurrentPrice {
    getCurrentPrice(): number {
        return Math.random() * 1_000_000
    }
}
