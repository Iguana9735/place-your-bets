import {startServer} from "./drivingAdapters/express/server";
import {App} from "./app/app";
import {ForGettingBitcoinPrice} from "./drivenPorts/ForGettingBitcoinPrice";
import FakeBitcoinPriceSource from "./drivenAdapters/FakeBitcoinPriceSource";

const forGettingBitcoinPrice: ForGettingBitcoinPrice = new FakeBitcoinPriceSource()
const app = new App(forGettingBitcoinPrice);

startServer(app);
