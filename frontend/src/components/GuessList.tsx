import {Box, Stack, Typography} from "@mui/material";
import type {Guess} from "../model/model.ts";
import GuessItem from "./GuessItem.tsx";

export default function GuessList() {

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
            <Typography variant={"h6"}>
                Your guesses:
            </Typography>
            <Stack spacing={1}>
                <>
                    {guesses.sort((a, b) => b.submittedAt - a.submittedAt)
                        .map((guess: Guess) => (<GuessItem key={guess.id} guess={guess}/>))}
                </>
            </Stack>
        </Box>
    )
}
