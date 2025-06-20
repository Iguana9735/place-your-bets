import { Paper, styled } from '@mui/material'
import type { ReactNode } from 'react'

type Props = {
    title: string
    children: ReactNode
}

function ValueDisplay({ title, children }: Props) {

    return (
        <Wrapper>
            <Title>{title}</Title>
            <Value>{children}</Value>
        </Wrapper>
    )
}

const Wrapper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    gap: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
}))

const Title = styled('div')(({ theme }) => ({
    ...theme.typography.body1,
    color: theme.palette.text.primary,
}))

const Value = styled('div')(({ theme }) => ({
    ...theme.typography.body1,
    fontSize: 20,
    fontWeight: 'bold',
}))

export default ValueDisplay
