import { Configuration, DefaultApi } from './gen'

const config = new Configuration({
    basePath: 'http://localhost:3000',
})
const apiClient = new DefaultApi(config)

const fetchClientInfo = async () => {
    return await apiClient.getInfo({ authorization: 'player-1' })
}

const submitNewGuess = async (direction: 'UP' | 'DOWN') => {
    return await apiClient.submitGuess({ submitGuessRequest: { direction: direction }, authorization: 'player-1' })
}

export { fetchClientInfo, submitNewGuess }

