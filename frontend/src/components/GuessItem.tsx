import {Paper} from "@mui/material";
import type {Guess} from "../model/model.ts";
import {formatInstant, formatMoney} from "../utils/formatters.ts";


export default function GuessItem({guess}: { guess: Guess }) {
    return <Paper>
        <div>Direction: {guess.direction}</div>
        <div>Result: {guess.result}</div>
        <div>Submitted at: {formatInstant(guess.submittedAt)}</div>
        <div>Price at submission: {formatMoney(guess.priceAtSubmission)}</div>
        <div>Resolved at: {guess.resolvedAt ? formatInstant(guess.resolvedAt) : ""}</div>
        <div>Price at resolution: {guess.priceAtResolution ? formatMoney(guess.priceAtResolution) : ""}</div>
    </Paper>
}

