import type { ClientInfo } from '../model/model.ts'
import PriceDisplay from './PriceDisplay.tsx'
import ScoreDisplay from './ScoreDisplay.tsx'
import GuessList from './GuessList.tsx'
import { Button, ButtonGroup, Grid, Stack } from '@mui/material'
import { useEffect } from 'react'

type Props = {
    clientInfo: ClientInfo
    onSubmitGuess: (direction: 'UP' | 'DOWN') => void
}

const MainContent = ({ clientInfo, onSubmitGuess }: Props) => {

    useEffect(() => {
        console.log('Mounting mainContent')
    }, [])


    return <Grid container spacing={2}>
        <Grid size={8}>
            <Stack spacing={2}>
                <GuessButtons onSubmitGuess={onSubmitGuess} />
                <GuessList guesses={clientInfo.recentGuesses} />
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

const GuessButtons = ({ onSubmitGuess }: { onSubmitGuess: (direction: 'UP' | 'DOWN') => void }) => {
    return (
        <ButtonGroup orientation='vertical' aria-label='Vertical button group'>
            <Button onClick={() => onSubmitGuess('UP')}>Up</Button>,
            <Button onClick={() => onSubmitGuess('DOWN')}>Down</Button>,
        </ButtonGroup>
    )
}

export default MainContent
