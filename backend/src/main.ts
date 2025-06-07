import {startServer} from "./drivingAdapters/express/server";
import {App} from "./app/app";

const app = new App();

startServer(app);
