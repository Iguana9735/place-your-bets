import { startServer } from './drivingAdapters/express/server'
import { App } from './app/app'
import { ForGettingBitcoinPrice } from './drivenPorts/ForGettingBitcoinPrice'
import { ForGettingTheTime } from './drivenPorts/ForGettingTheTime'
import InMemoryDatabase from './drivenAdapters/InMemoryDatabase'
import ForPersisting from './drivenPorts/ForPersisting'
import RealClock from './drivenAdapters/forGettingTheTime/RealClock'
import RandomBitcoinPriceSource from './drivenAdapters/forGettingBitcoinPrice/RandomBitcoinPriceSource'
import CachingBitcoinPriceSource from './drivenAdapters/forGettingBitcoinPrice/CachingBitcoinPriceSource'

const forGettingBitcoinPrice: ForGettingBitcoinPrice =
    new CachingBitcoinPriceSource(new RandomBitcoinPriceSource(), 5000)
const forGettingTheTime: ForGettingTheTime = new RealClock()
const forPersisting: ForPersisting = new InMemoryDatabase()

const app = new App(forGettingBitcoinPrice, forGettingTheTime, forPersisting)

startServer(app)
