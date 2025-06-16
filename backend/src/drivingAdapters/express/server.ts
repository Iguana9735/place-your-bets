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
            const playerId = req.header('Authorization')
            if (!playerId) {
                res.status(401).json(undefined)
                return
            }
            const clientInfo = await forPlacingBets.getClientInfo(playerId)
            res.json({
                bitcoinPrice: clientInfo.currentBitcoinPrice,
                recentGuesses: clientInfo.recentGuesses.map((guess) => ({
                    direction: guess.direction,
                    submittedAt: guess.submittedAt.getTime(),
                    priceAtSubmission: guess.priceAtSubmission,
                    resolvedAt: guess.resolvedAt?.getTime(),
                    priceAtResolution: guess.priceAtResolution,
                    result: guess.result,
                })),
                score: clientInfo.score,
            })
        }
    )

    expressServer.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`)
    })
}
