import { Box, CircularProgress, Container, Stack, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import * as ApiClient from './api-client/client.ts'
import MainContent from './components/MainContent.tsx'
import type { ClientInfo } from './model/model.ts'

function App() {

    const [clientInfo, setClientInfo] = useState<ClientInfo | undefined>(undefined)

    const fetchClientInfo = () => {
        ApiClient.fetchClientInfo().then((clientInfo) => {
                setClientInfo(clientInfo)
            },
            (error) => {
                console.error(error)
            })
    }

    useEffect(() => {

        fetchClientInfo()

        const interval = setInterval(() => {
            fetchClientInfo()
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    const submitNewGuess = (direction: 'UP' | 'DOWN') => {
        ApiClient.submitNewGuess(direction)
            .then(fetchClientInfo)
    }

    return (
        <>
            <SiteContainer maxWidth={'md'}>
                <Stack spacing={2}>
                    <Title> Is Bitcoin going up or down? Take a guess! </Title>
                    {clientInfo ?
                        <MainContent clientInfo={clientInfo} onSubmitGuess={submitNewGuess} /> :
                        <LoadingIndicator />}
                </Stack>
            </SiteContainer>
        </>
    )
}

const LoadingIndicator = () => {
    return <Box display={'flex'} justifyContent={'center'}>
        <CircularProgress />
    </Box>
}

const SiteContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(5),
}))

const Title = styled('div')(({ theme }) => ({
    ...theme.typography.h5,
    color: theme.palette.text.primary,
}))

export default App
