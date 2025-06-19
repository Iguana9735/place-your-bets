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
    }, [])

    const submitNewGuess = (direction: 'UP' | 'DOWN') => {
        ApiClient.submitNewGuess(direction)
            .then(fetchClientInfo)
    }

    const ContentArea = ({ clientInfo }: { clientInfo: ClientInfo | undefined }) => {
        if (!clientInfo) {
            return <LoadingIndicator />
        }
        return <MainContent clientInfo={clientInfo} onSubmitGuess={submitNewGuess} />
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

    return (
        <>
            <SiteContainer maxWidth={'md'}>
                <Stack spacing={2}>
                    <Title> Is Bitcoin going up or down? Take a guess! </Title>
                    <ContentArea clientInfo={clientInfo} />
                </Stack>
            </SiteContainer>
        </>
    )
}

export default App
