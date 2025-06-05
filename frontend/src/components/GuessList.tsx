import {Box, Paper, Stack} from "@mui/material";

function GuessList() {

    const guesses: Guess[] = [
        {
            id: "1",
            submittedAt: 1749158743,
            direction: "UP",
            priceAtSubmission: 1234,
            resolvedAt: 1749158843,
            priceAtResolution: 1235,
            result: "CORRECT"
        },
        {
            id: "2",
            submittedAt: 1749158943,
            direction: "DOWN",
            priceAtSubmission: 1234,
            resolvedAt: 1749159000,
            priceAtResolution: 1235,
            result: "INCORRECT"
        },
        {
            id: "3",
            submittedAt: 1749159943,
            direction: "DOWN",
            priceAtSubmission: 1234,
        },
    ]

    return (
        <Box>
            Your guesses:
            <Stack spacing={1}>
                <>
                    {guesses.sort((a, b) => b.submittedAt - a.submittedAt)
                        .map((guess: Guess) => (<GuessItem key={guess.id} guess={guess}/>))}
                </>
            </Stack>
        </Box>
    )
}

const GuessItem = ({guess}: { guess: Guess }) => {
    return <Paper>
        <div>Submitted at: {guess.submittedAt}</div>
        <div>Direction: {guess.direction}</div>
        <div>Price at submission: {guess.priceAtSubmission}</div>
        <div>Resolved at: {guess.resolvedAt}</div>
        <div>Price at resolution: {guess.priceAtResolution}</div>
        <div>Result: {guess.result}</div>
    </Paper>
}

export default GuessList
