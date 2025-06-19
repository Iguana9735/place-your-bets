import { Box, Stack, Typography } from '@mui/material'
import type { Guess } from '../model/model.ts'
import GuessItem from './GuessItem.tsx'

interface Props {
    guesses: Guess[]
}

export default function GuessList({ guesses }: Props) {

    return (
        <Box>
            <Typography variant={'h6'}>
                Your guesses:
            </Typography>
            <Stack spacing={1}>
                <>
                    {guesses.sort((a, b) => b.submittedAt - a.submittedAt)
                        .map((guess: Guess, i: number) => (<GuessItem key={i} guess={guess} />))}
                </>
            </Stack>
        </Box>
    )
}
