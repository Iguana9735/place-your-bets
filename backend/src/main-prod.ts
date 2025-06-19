import { startServer } from './drivingAdapters/express/server'
import { App } from './app/app'
import { ForGettingBitcoinPrice } from './drivenPorts/ForGettingBitcoinPrice'
import { ForGettingTheTime } from './drivenPorts/ForGettingTheTime'
import InMemoryDatabase from './drivenAdapters/forPersisting/InMemoryDatabase'
import ForPersisting from './drivenPorts/ForPersisting'
import RealClock from './drivenAdapters/forGettingTheTime/RealClock'
import CachingBitcoinPriceSource from './drivenAdapters/forGettingBitcoinPrice/CachingBitcoinPriceSource'
import CoinbaseBitcoinPriceSource from './drivenAdapters/forGettingBitcoinPrice/CoinbaseBitcoinPriceSource'

const forGettingBitcoinPrice: ForGettingBitcoinPrice =
    new CachingBitcoinPriceSource(new CoinbaseBitcoinPriceSource(), 5000)
const forGettingTheTime: ForGettingTheTime = new RealClock()
const forPersisting: ForPersisting = new InMemoryDatabase()

const app = new App(forGettingBitcoinPrice, forGettingTheTime, forPersisting)

startServer(app)
