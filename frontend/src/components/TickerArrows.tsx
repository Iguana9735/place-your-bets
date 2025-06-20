import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useEffect, useState } from 'react'

const TickerArrows = ({ value }: { value: number }) => {
    const [prevValue, setPrevValue] = useState(value)
    const [movement, setMovement] = useState<'UP' | 'DOWN' | undefined>('UP')

    useEffect(() => {

        if (value > prevValue) {
            setMovement('UP')
        }
        if (value < prevValue) {
            setMovement('DOWN')
        }
        setPrevValue(value)

        const timeout = setTimeout(() => setMovement(undefined), 900)
        return () => clearTimeout(timeout)
    }, [value])

    if (movement) {
        return (
            <Arrow variant={movement} />
        )
    }
}

const Arrow = ({ variant }: { variant: 'UP' | 'DOWN' }) => {
    return <span
        style={{
            opacity: 1,
            transition: 'opacity 1s',
            lineHeight: 0,
            animation: 'fadeOut 0.7s ease-out 0.1s forwards',
        }}
    >
        {variant == 'UP' ? <KeyboardArrowUp color={'success'} /> : <KeyboardArrowDown color={'error'} />}
        <style>{`
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `}</style>
    </span>
}

export default TickerArrows