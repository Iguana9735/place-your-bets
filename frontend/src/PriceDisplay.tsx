import {Paper, styled,} from "@mui/material";

type Props = {
    price: number
}

function PriceDisplay({price}: Props) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <PricePaper>
            <Title> One Bitcoin is: </Title>
            <Price>{formatter.format(price)}</Price>
        </PricePaper>
    )
}

const PricePaper = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    gap: theme.spacing(1),
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch"
}));

const Title = styled('div')(({theme}) => ({
    ...theme.typography.body1,
    color: theme.palette.text.primary
}));

const Price = styled('div')(({theme}) => ({
    ...theme.typography.body1,
    fontSize: 20,
    fontWeight: "bold"
}));

export default PriceDisplay
