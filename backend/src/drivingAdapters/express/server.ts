import express, { Request, Response } from 'express'
import type { paths } from './generated/api'
import { ForPlacingGuesses } from '../../drivingPorts/ForPlacingGuesses'

const expressServer = express()
const PORT = process.env.PORT || 3000

type InfoResponse =
    paths['/info']['get']['responses']['200']['content']['application/json']
type HealthResponse =
    paths['/health']['get']['responses']['200']['content']['application/json']

export function startServer(forPlacingBets: ForPlacingGuesses) {
    expressServer.get(
        '/health',
        (req: Request, res: Response<HealthResponse>) => {
            res.json({})
        }
    )

    expressServer.get(
        '/info',
        async (req: Request, res: Response<InfoResponse>) => {
            const clientInfo = await forPlacingBets.getClientInfo()
            res.json({ bitcoinPrice: clientInfo.currentBitcoinPrice })
        }
    )

    expressServer.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`)
    })
}
