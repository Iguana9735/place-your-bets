import {Paper, styled} from "@mui/material";
import type {Guess, UnixSeconds} from "../model/model.ts";
import {formatInstant, formatMoney} from "../utils/formatters.ts";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

export default function GuessItem({guess}: { guess: Guess }) {
    return <GuessContainer>
        {makeFirstLine(guess)}
        <DetailsSection>
            <DetailsSide>
                <PriceSnapshot price={guess.priceAtSubmission} time={guess.submittedAt}/>
            </DetailsSide>
            <DetailsMiddle>
                <ArrowForwardIcon/>
            </DetailsMiddle>
            <DetailsSide>
                {guess.priceAtResolution ?
                    <PriceSnapshot price={guess.priceAtResolution} time={guess.resolvedAt}/> : <QuestionMarkIcon/>
                }
            </DetailsSide>
        </DetailsSection>
    </GuessContainer>
}

function makeFirstLine(guess: Guess): string {
    if (guess.result == "CORRECT") {
        return `You guessed ${guess.direction}, and you were correct!`
    }
    if (guess.result == "INCORRECT") {
        return `You guessed ${guess.direction}, but the price went ${guess.direction == "UP" ? "DOWN" : "UP"}`
    }
    return `You guessed ${guess.direction}...`
}

function PriceSnapshot({price, time}: { price?: number, time?: UnixSeconds }) {
    return <>
        <div><b>{price ? formatMoney(price) : ""}</b></div>
        <div>{time ? formatInstant(time) : ""}</div>
    </>
}

const GuessContainer = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    ...theme.typography.body1
}));

const DetailsSection = styled("div")(({theme}) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch"
}));

const DetailsSide = styled("div")(({theme}) => ({
    flex: 2
}));

const DetailsMiddle = styled("div")(({theme}) => ({
    textAlign: "center",
    flex: "1 0 auto"
}));

