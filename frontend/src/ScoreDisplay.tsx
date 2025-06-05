import ValueDisplay from "./ValueDisplay.tsx";

type Props = {
    score: number
}

function ScoreDisplay({score}: Props) {
    return (
        <ValueDisplay title={"Your score"} value={score.toString()}/>
    )
}

export default ScoreDisplay
