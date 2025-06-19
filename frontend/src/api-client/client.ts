import { Configuration, DefaultApi } from './gen'
import type { ClientInfo } from '../model/model.ts'

const config = new Configuration({
    basePath: import.meta.env.VITE_BACKEND_URL
})
const apiClient = new DefaultApi(config)

const fetchClientInfo = async (): Promise<ClientInfo> => {
    return await apiClient.getInfo({ authorization: 'player-1' })
}

const submitNewGuess = async (direction: 'UP' | 'DOWN') => {
    return await apiClient.submitGuess({ submitGuessRequest: { direction: direction }, authorization: 'player-1' })
}

export { fetchClientInfo, submitNewGuess }

