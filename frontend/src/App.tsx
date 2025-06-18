import { Button, ButtonGroup, Container, Grid, Stack, styled } from '@mui/material'
import PriceDisplay from './components/PriceDisplay.tsx'
import ScoreDisplay from './components/ScoreDisplay.tsx'
import GuessList from './components/GuessList.tsx'
import { useEffect } from 'react'
import { fetchClientInfo } from './api-client/client.ts'

function App() {

    useEffect(() => {
        fetchClientInfo().then((clientInfo) => {
                console.log(clientInfo)
            },
            (error) => {
                console.error(error)
            })
    }, [])

    const score = 40
    const bitcoinPrice = 101453.80

    return (
        <>
            <SiteContainer maxWidth={'md'}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Title> Is Bitcoin going up or down? Take a guess! </Title>
                    </Grid>
                    <Grid size={8}>
                        <Stack spacing={2}>
                            <GuessButtons />
                            <GuessList />
                        </Stack>
                    </Grid>
                    <Grid size={4}>
                        <Stack spacing={2}>
                            <ScoreDisplay score={score} />
                            <PriceDisplay price={bitcoinPrice} />
                        </Stack>
                    </Grid>
                </Grid>
            </SiteContainer>
        </>
    )
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
