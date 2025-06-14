export type ForGettingTheTime = {
    getTime: () => Date
    listenToTicks: (listener: () => Promise<void>) => void
}
