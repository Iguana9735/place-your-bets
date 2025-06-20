import { Configuration, DefaultApi } from './gen'
import type { ClientInfo } from '../model/model.ts'
import { v4 as uuidv4 } from 'uuid'

const config = new Configuration({
    basePath: import.meta.env.VITE_BACKEND_URL,
})
const apiClient = new DefaultApi(config)

const fetchClientInfo = async (): Promise<ClientInfo> => {
    return await apiClient.getInfo({ authorization: playerId() })
}

const submitNewGuess = async (direction: 'UP' | 'DOWN') => {
    return await apiClient.submitGuess({ submitGuessRequest: { direction: direction }, authorization: playerId() })
}

const playerId = (): string => {
    const key = 'player-id'
    let value = localStorage.getItem(key)
    if (!value) {
        value = uuidv4()
        localStorage.setItem(key, value)
    }
    return value
}

export { fetchClientInfo, submitNewGuess }

