import { startServer } from './drivingAdapters/express/server'
import { App } from './app/app'
import { ForGettingBitcoinPrice } from './drivenPorts/ForGettingBitcoinPrice'
import FakeBitcoinPriceSource from './drivenAdapters/FakeBitcoinPriceSource'
import { ForGettingTheTime } from './drivenPorts/ForGettingTheTime'
import FakeClock from './drivenAdapters/FakeClock'
import InMemoryDatabase from './drivenAdapters/InMemoryDatabase'
import ForPersisting from './drivenPorts/ForPersisting'

const forGettingBitcoinPrice: ForGettingBitcoinPrice =
    new FakeBitcoinPriceSource()
const forGettingTheTime: ForGettingTheTime = new FakeClock()
const forPersisting: ForPersisting = new InMemoryDatabase()

const app = new App(forGettingBitcoinPrice, forGettingTheTime, forPersisting)

startServer(app)
