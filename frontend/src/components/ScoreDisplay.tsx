import ValueDisplay from './ValueDisplay.tsx'

type Props = {
    score: number
}

function ScoreDisplay({ score }: Props) {
    return (
        <ValueDisplay title={'Your score'}>{score.toString()}</ValueDisplay>
    )
}

export default ScoreDisplay
