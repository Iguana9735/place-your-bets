import { Box, Button, ButtonGroup, CircularProgress, Container, Grid, Stack, styled } from '@mui/material'
import PriceDisplay from './components/PriceDisplay.tsx'
import ScoreDisplay from './components/ScoreDisplay.tsx'
import GuessList from './components/GuessList.tsx'
import { useEffect, useState } from 'react'
import { fetchClientInfo } from './api-client/client.ts'
import type { GetInfo200Response } from './api-client/gen'

function App() {

    const [clientInfo, setClientInfo] = useState<GetInfo200Response | undefined>(undefined)

    useEffect(() => {
        fetchClientInfo().then((clientInfo) => {
                setClientInfo(clientInfo)
            },
            (error) => {
                console.error(error)
            })
    }, [])


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

const ContentArea = ({ clientInfo }: { clientInfo: GetInfo200Response | undefined }) => {
    if (!clientInfo) {
        return <LoadingIndicator />
    }
    return <MainContent clientInfo={clientInfo} />
}

const LoadingIndicator = () => {
    return <Box display={'flex'} justifyContent={'center'}>
        <CircularProgress />
    </Box>

}

const MainContent = ({ clientInfo }: { clientInfo: GetInfo200Response }) => {
    return <Grid container spacing={2}>
        <Grid size={8}>
            <Stack spacing={2}>
                <GuessButtons />
                <GuessList />
            </Stack>
        </Grid>
        <Grid size={4}>
            <Stack spacing={2}>
                <ScoreDisplay score={clientInfo.score} />
                <PriceDisplay price={clientInfo.bitcoinPrice} />
            </Stack>
        </Grid>
    </Grid>
}

const GuessButtons = () => {
    return (
        <ButtonGroup orientation='vertical' aria-label='Vertical button group'>
            <Button>Up</Button>,
            <Button>Down</Button>,
        </ButtonGroup>
    )
}

const SiteContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(5),
}))

const Title = styled('div')(({ theme }) => ({
    ...theme.typography.h5,
    color: theme.palette.text.primary,
}))

export default App
