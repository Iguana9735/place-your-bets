import { formatMoney } from '../utils/formatters.ts'
import ValueDisplay from './ValueDisplay.tsx'
import TickerArrows from './TickerArrows.tsx'
import { styled } from '@mui/material'

type Props = {
    price: number
}

function PriceDisplay({ price }: Props) {
    return (
        <ValueDisplay title={'Current BTC price'}>
            <Wrapper>
                {formatMoney(price)} <TickerArrows value={price} />
            </Wrapper>
        </ValueDisplay>
    )
}

const Wrapper = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center'
}))

export default PriceDisplay
