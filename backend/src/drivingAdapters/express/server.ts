import express, {Request, Response} from 'express';
import type {paths} from './generated/api';
import {ForGettingCurrentPrice} from "../../drivingPorts/ForGettingCurrentPrice";

const expressServer = express();
const PORT = process.env.PORT || 3000;

type InfoResponse = paths['/info']['get']['responses']['200']['content']['application/json'];

export function startServer(forGettingPrice: ForGettingCurrentPrice) {

    expressServer.get('/info', (req: Request, res: Response<InfoResponse>) => {
        res.json({bitcoinPrice: forGettingPrice.getCurrentPrice()});
    });

    expressServer.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
